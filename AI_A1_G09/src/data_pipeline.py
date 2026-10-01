"""Data Loading, Validation, and Vectorization Pipeline.
INES Ruhengeri - SWE 3513 AI Assignment 1
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any
from .utils import compute_file_sha256, save_json

EXPECTED_COLUMNS = [
    "record_id",
    "plot_area_ha",
    "rainfall_mm",
    "soil_ph",
    "seed_kg",
    "distance_km",
    "arrival_hour",
    "actual_yield_kg",
    "dispatch_attention"
]

FEATURE_COLUMNS = [
    "plot_area_ha",
    "rainfall_mm",
    "soil_ph",
    "seed_kg",
    "distance_km",
    "arrival_hour"
]

NUMERIC_COLUMNS = FEATURE_COLUMNS + ["actual_yield_kg", "dispatch_attention"]


def load_and_validate_data(
    filepath: str,
    group_code: str = "AI-G09",
    output_dir: str = "artifacts"
) -> Tuple[pd.DataFrame, np.ndarray, np.ndarray, np.ndarray, Dict[str, Any]]:
    """Loads CSV, validates columns and types, checks missing/duplicates, produces NumPy matrix,

    and saves data_report.json.

    Returns:
        df: Cleaned pandas DataFrame
        X: Feature matrix (NumPy array)
        y_reg: Regression target actual_yield_kg (NumPy array)
        y_clf: Classification target dispatch_attention (NumPy array)
        report: Dict containing dataset statistics and fingerprint
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at: {filepath}")

    # Compute SHA-256 fingerprint of the raw dataset
    sha256_fingerprint = compute_file_sha256(filepath)

    # Load data
    df = pd.read_csv(filepath)

    # 1. Schema Validation
    missing_cols = [c for c in EXPECTED_COLUMNS if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Schema Error: Missing required columns: {missing_cols}")

    # 2. Check row and feature counts
    row_count_initial = len(df)
    if row_count_initial == 0:
        raise ValueError("Schema Error: Dataset is empty.")

    # 3. Missing values check
    missing_dict = df[EXPECTED_COLUMNS].isnull().sum().to_dict()

    # 4. Duplicate checks
    duplicate_records_count = int(df["record_id"].duplicated().sum())
    feature_duplicate_count = int(df[FEATURE_COLUMNS].duplicated().sum())

    # Handle missing values if any exist on unseen test datasets (impute with median for numeric)
    for col in NUMERIC_COLUMNS:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        if df[col].isnull().sum() > 0:
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)

    # 5. Descriptive statistics
    desc_stats = {}
    for col in NUMERIC_COLUMNS:
        series = df[col]
        desc_stats[col] = {
            "mean": round(float(series.mean()), 4),
            "std": round(float(series.std()), 4),
            "min": round(float(series.min()), 4),
            "25%": round(float(series.quantile(0.25)), 4),
            "50%": round(float(series.quantile(0.50)), 4),
            "75%": round(float(series.quantile(0.75)), 4),
            "max": round(float(series.max()), 4),
        }

    # 6. Separate identifiers from features to prevent data leakage
    # record_id must NEVER be used as a model feature!
    X = df[FEATURE_COLUMNS].to_numpy(dtype=np.float64)
    y_reg = df["actual_yield_kg"].to_numpy(dtype=np.float64)
    y_clf = df["dispatch_attention"].to_numpy(dtype=np.int64)

    # 7. Generate data report
    report = {
        "group_code": group_code,
        "dataset_path": filepath,
        "sha256_fingerprint": sha256_fingerprint,
        "row_count": len(df),
        "feature_count": len(FEATURE_COLUMNS),
        "feature_names": FEATURE_COLUMNS,
        "identifier_column": "record_id (excluded from feature matrix)",
        "missing_values": missing_dict,
        "duplicate_record_ids": duplicate_records_count,
        "duplicate_feature_rows": feature_duplicate_count,
        "descriptive_statistics": desc_stats,
        "schema_validation": "PASSED"
    }

    report_path = os.path.join(output_dir, "data_report.json")
    save_json(report, report_path)

    return df, X, y_reg, y_clf, report
