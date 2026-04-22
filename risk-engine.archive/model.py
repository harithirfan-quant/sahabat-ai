"""Train the SAHABAT.AI wellbeing risk model.

We synthesise 1,000 samples whose target variable is loosely aligned with
PHQ-9-style distress severity, then fit an XGBoost regressor that predicts a
0–100 *wellbeing* score (higher = healthier).

Synthetic design
----------------
For each sample we draw the five input features from plausible distributions
and combine them into a latent *distress* variable using relationships that
mirror the clinical literature:

  - Low mood → much higher distress
  - Negative sentiment → higher distress
  - Sleep deviation from ~7.5 h (either direction) → higher distress
  - Few daily check-ins → slightly higher distress
  - Low social engagement → higher distress

We add Gaussian noise so the model has to generalise rather than memorise
the formula. The wellbeing score is `100 − distress`, clipped to [0, 100].

Run
---
    python model.py              # trains and saves model.pkl + metrics.json
"""
from __future__ import annotations

import json
import pickle
from pathlib import Path

import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from features import FEATURE_KEYS

N_SAMPLES = 1000
SEED = 42
ARTIFACT_DIR = Path(__file__).parent
MODEL_PATH = ARTIFACT_DIR / "model.pkl"
METRICS_PATH = ARTIFACT_DIR / "metrics.json"


def synth_dataset(n: int, rng: np.random.Generator) -> tuple[np.ndarray, np.ndarray]:
    """Generate n samples of (X, y) where y is the 0–100 wellbeing score."""

    # --- inputs ---------------------------------------------------------------
    sentiment = rng.normal(loc=0.05, scale=0.45, size=n).clip(-1.0, 1.0)
    mood = rng.normal(loc=6.0, scale=2.0, size=n).clip(1.0, 10.0)
    sleep = rng.normal(loc=7.0, scale=1.8, size=n).clip(0.0, 12.0)
    journals = rng.integers(low=0, high=8, size=n).astype(float)  # [0, 7]
    social = rng.beta(a=2.0, b=2.0, size=n)  # [0, 1]

    # --- latent distress contributions ---------------------------------------
    # Each term is scaled so the combined distress sits roughly in [0, 100].
    distress = np.zeros(n)
    distress += (7.0 - mood) * 7.0             # up to ~42 when mood=1
    distress += (0.2 - sentiment) * 18.0       # ~22 when sentiment=-1
    distress += np.abs(sleep - 7.5) * 3.5      # bidirectional sleep penalty
    distress += (5.0 - journals).clip(0, None) * 1.8
    distress += (0.55 - social) * 22.0         # ~12 when social=0
    distress += rng.normal(loc=0.0, scale=6.0, size=n)  # irreducible noise

    # Convert to wellbeing = 100 − distress, clipped.
    wellbeing = np.clip(100.0 - distress, 0.0, 100.0)

    X = np.column_stack([sentiment, mood, sleep, journals, social])
    return X, wellbeing


def train() -> dict:
    rng = np.random.default_rng(SEED)
    X, y = synth_dataset(N_SAMPLES, rng)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED
    )

    model = xgb.XGBRegressor(
        n_estimators=400,
        max_depth=4,
        learning_rate=0.06,
        subsample=0.85,
        colsample_bytree=0.9,
        reg_lambda=1.0,
        random_state=SEED,
        # feature names travel with the model so main.py can use a dict input.
        enable_categorical=False,
    )
    # Attach feature names via a DMatrix-friendly wrapper.
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    model.get_booster().feature_names = list(FEATURE_KEYS)

    preds = model.predict(X_test)
    metrics = {
        "n_samples": N_SAMPLES,
        "seed": SEED,
        "mae": float(mean_absolute_error(y_test, preds)),
        "r2": float(r2_score(y_test, preds)),
        "feature_keys": list(FEATURE_KEYS),
        "feature_importance": {
            k: float(v)
            for k, v in zip(FEATURE_KEYS, model.feature_importances_.tolist())
        },
    }

    with MODEL_PATH.open("wb") as f:
        pickle.dump(model, f)
    with METRICS_PATH.open("w") as f:
        json.dump(metrics, f, indent=2)

    return metrics


if __name__ == "__main__":
    m = train()
    print(json.dumps(m, indent=2))
