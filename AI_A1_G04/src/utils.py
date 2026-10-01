"""Utility functions for SHA-256 fingerprinting, metrics calculation, and artifact persistence.
INES Ruhengeri - SWE 3513 AI Assignment 1
"""

import os
import json
import hashlib
import numpy as np


def compute_file_sha256(filepath: str) -> str:
    """Computes the SHA-256 hexadecimal hash fingerprint of a file."""
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()


def ensure_dir(path: str):
    """Ensures that a directory exists."""
    os.makedirs(path, exist_ok=True)


def save_json(data: dict, filepath: str):
    """Saves a dictionary as formatted JSON."""
    ensure_dir(os.path.dirname(filepath))
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)


def load_json(filepath: str) -> dict:
    """Loads a JSON file as a dictionary."""
    with open(filepath, "r") as f:
        return json.load(f)


def calculate_regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculates MAE, RMSE, and R-squared from first principles."""
    y_true = np.asarray(y_true).ravel()
    y_pred = np.asarray(y_pred).ravel()
    
    n = len(y_true)
    if n == 0:
        return {"mae": 0.0, "rmse": 0.0, "r2": 0.0}
    
    residuals = y_true - y_pred
    mae = float(np.mean(np.abs(residuals)))
    mse = float(np.mean(residuals ** 2))
    rmse = float(np.sqrt(mse))
    
    ss_res = float(np.sum(residuals ** 2))
    y_mean = float(np.mean(y_true))
    ss_tot = float(np.sum((y_true - y_mean) ** 2))
    
    r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0
    
    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2": round(float(r2), 4)
    }
