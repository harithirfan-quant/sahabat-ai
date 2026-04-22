"""Shared feature definitions for the SAHABAT.AI risk engine.

Both `model.py` (training) and `main.py` (serving) import from here so the
feature order, human-readable names, and healthy baselines stay in sync.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

Direction = Literal["lower", "higher"]


@dataclass(frozen=True)
class FeatureSpec:
    key: str
    label: str
    # Value at which this feature is "healthiest". Used to explain which way a
    # user is deviating (e.g. sleep too low vs too high).
    healthy: float
    # When the feature value moves in this direction relative to `healthy`,
    # risk increases. "lower" = risk grows as the value drops.
    risk_direction: Direction
    # Soft min/max used to normalise deviation into [0, 1] for the
    # contribution calculation at serve time.
    soft_min: float
    soft_max: float
    healthy_copy: str
    low_copy: str
    high_copy: str


FEATURES: tuple[FeatureSpec, ...] = (
    FeatureSpec(
        key="sentiment_avg_7d",
        label="Sentiment",
        healthy=0.2,
        risk_direction="lower",
        soft_min=-1.0,
        soft_max=1.0,
        healthy_copy="Messages feel balanced to slightly positive.",
        low_copy="Messages have leaned heavy or sad this week.",
        high_copy="Messages are unusually bright — great signal.",
    ),
    FeatureSpec(
        key="mood_avg_7d",
        label="Mood",
        healthy=7.0,
        risk_direction="lower",
        soft_min=1.0,
        soft_max=10.0,
        healthy_copy="Daily mood sits in a healthy range.",
        low_copy="Daily mood check-ins have been low this week.",
        high_copy="Mood check-ins are very high — hopeful sign.",
    ),
    FeatureSpec(
        key="sleep_avg_7d",
        label="Sleep",
        healthy=7.5,
        risk_direction="lower",  # bidirectional; treated specially below
        soft_min=0.0,
        soft_max=12.0,
        healthy_copy="Sleep is in a healthy 7–9 hour range.",
        low_copy="Sleep has been running short this week.",
        high_copy="Sleep has been unusually long — worth a look.",
    ),
    FeatureSpec(
        key="journal_count_7d",
        label="Check-in streak",
        healthy=5.0,
        risk_direction="lower",
        soft_min=0.0,
        soft_max=7.0,
        healthy_copy="Consistent check-ins — keeps signals fresh.",
        low_copy="Fewer check-ins this week; signals are thinner.",
        high_copy="Check-ins are strong — great rhythm.",
    ),
    FeatureSpec(
        key="social_engagement_7d",
        label="Social engagement",
        healthy=0.55,
        risk_direction="lower",
        soft_min=0.0,
        soft_max=1.0,
        healthy_copy="You've stayed connected to people this week.",
        low_copy="Social engagement has dipped this week.",
        high_copy="Strong connection with people around you.",
    ),
)

FEATURE_KEYS: tuple[str, ...] = tuple(f.key for f in FEATURES)


def tier_for_score(score: float) -> str:
    """Map a 0–100 wellbeing score to the four-tier label."""
    if score >= 75:
        return "green"
    if score >= 55:
        return "yellow"
    if score >= 35:
        return "orange"
    return "red"
