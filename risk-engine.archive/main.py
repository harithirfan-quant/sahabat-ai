"""FastAPI service that serves the SAHABAT.AI wellbeing risk model.

Endpoints
---------
    GET  /healthz     Liveness + model loaded check.
    POST /score       Body: features → { score, tier, top_factors }.

The /score response always includes the three features that contributed most
to any risk, so the Next.js dashboard can say "Sleep and mood are the main
signals this week" without re-deriving it client-side.
"""
from __future__ import annotations

import logging
import os
import pickle
from pathlib import Path
from typing import List

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from features import FEATURES, FEATURE_KEYS, tier_for_score

log = logging.getLogger("risk-engine")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

MODEL_PATH = Path(__file__).parent / "model.pkl"


# ---------------------------------------------------------------------------
# Pydantic I/O
# ---------------------------------------------------------------------------

class ScoreRequest(BaseModel):
    sentiment_avg_7d: float = Field(..., ge=-1.0, le=1.0)
    mood_avg_7d: float = Field(..., ge=1.0, le=10.0)
    sleep_avg_7d: float = Field(..., ge=0.0, le=24.0)
    journal_count_7d: float = Field(..., ge=0.0, le=31.0)
    social_engagement_7d: float = Field(..., ge=0.0, le=1.0)


class TopFactor(BaseModel):
    key: str
    label: str
    direction: str   # "low" | "high" | "healthy"
    value: float
    contribution: float  # 0..1, relative to the other top factors
    copy: str            # human-readable one-liner


class ScoreResponse(BaseModel):
    score: int
    tier: str
    top_factors: List[TopFactor]
    model_version: str


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def _load_model():
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"model.pkl not found at {MODEL_PATH}. Run `python model.py` first."
        )
    with MODEL_PATH.open("rb") as f:
        return pickle.load(f)


_model = None
_feature_importance: dict[str, float] = {}


def get_model():
    global _model, _feature_importance
    if _model is None:
        _model = _load_model()
        try:
            importances = _model.feature_importances_.tolist()
            _feature_importance = dict(zip(FEATURE_KEYS, importances))
        except Exception:
            _feature_importance = {k: 1.0 / len(FEATURE_KEYS) for k in FEATURE_KEYS}
    return _model


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="SAHABAT.AI Risk Engine", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz():
    try:
        get_model()
        return {"status": "ok", "model_loaded": True}
    except Exception as e:  # pragma: no cover - surfaces deploy-time errors
        raise HTTPException(status_code=503, detail=str(e))


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

def _explain(features: dict[str, float]) -> list[TopFactor]:
    """Rank the user's features by how much they plausibly pushed the score.

    Contribution = feature_importance × normalised deviation from the
    feature's healthy baseline. This is an inexpensive approximation that
    avoids the SHAP dependency (keeps the container small for the free
    Fly.io VM). Top 3 are returned sorted by contribution desc.
    """
    rows: list[tuple[float, TopFactor]] = []
    for spec in FEATURES:
        value = features[spec.key]
        span = max(spec.soft_max - spec.soft_min, 1e-6)

        if spec.key == "sleep_avg_7d":
            # Bidirectional — deviation from the healthy value in either
            # direction counts as risk.
            deviation = abs(value - spec.healthy) / span
            direction = (
                "healthy"
                if deviation < 0.08
                else ("low" if value < spec.healthy else "high")
            )
        else:
            # Unidirectional (risk grows as value drops toward soft_min).
            if value >= spec.healthy:
                deviation = 0.0
                direction = "healthy"
            else:
                deviation = (spec.healthy - value) / max(
                    spec.healthy - spec.soft_min, 1e-6
                )
                direction = "low"

        importance = _feature_importance.get(spec.key, 1.0 / len(FEATURES))
        contribution = max(deviation, 0.0) * importance

        copy = {
            "healthy": spec.healthy_copy,
            "low": spec.low_copy,
            "high": spec.high_copy,
        }[direction]

        rows.append(
            (
                contribution,
                TopFactor(
                    key=spec.key,
                    label=spec.label,
                    direction=direction,
                    value=float(value),
                    contribution=0.0,  # normalised below
                    copy=copy,
                ),
            )
        )

    rows.sort(key=lambda r: r[0], reverse=True)
    top = rows[:3]

    # Normalise contributions in the top-3 so they sum to 1 (for the UI).
    total = sum(c for c, _ in top) or 1.0
    return [TopFactor(**{**tf.model_dump(), "contribution": round(c / total, 3)}) for c, tf in top]


@app.post("/score", response_model=ScoreResponse)
def score(req: ScoreRequest) -> ScoreResponse:
    model = get_model()
    features = req.model_dump()

    # Keep column order aligned with training.
    x = np.array([[features[k] for k in FEATURE_KEYS]], dtype=float)
    raw = float(model.predict(x)[0])
    score_int = int(round(max(0.0, min(100.0, raw))))

    return ScoreResponse(
        score=score_int,
        tier=tier_for_score(score_int),
        top_factors=_explain(features),
        model_version=os.environ.get("MODEL_VERSION", "xgb-0.1.0"),
    )
