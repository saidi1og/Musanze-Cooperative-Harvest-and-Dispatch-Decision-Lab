#!/usr/bin/env python3
"""Musanze Cooperative Single Record Reusable Predictor.
INES Ruhengeri - SWE 3513 AI Assignment 1

Usage:
    python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
"""

import os
import sys
import json
import argparse
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REQUIRED_FIELDS = [
    "plot_area_ha",
    "rainfall_mm",
    "soil_ph",
    "seed_kg",
    "distance_km",
    "arrival_hour"
]
GROUP_CODE = "AI-G09"
MODEL_VERSION = "1.0.0"


def format_error_response(error_type: str, message: str, details: dict = None) -> dict:
    """Formats standardized JSON error for malformed or missing input fields."""
    resp = {
        "status": "error",
        "error_type": error_type,
        "message": message,
        "group_code": GROUP_CODE,
        "model_version": MODEL_VERSION
    }
    if details:
        resp["details"] = details
    return resp


def validate_record(record: dict) -> tuple[bool, dict, list]:
    """Validates the input dictionary against the documented schema and numeric bounds.

    Returns (is_valid, cleaned_dict_or_error, feature_list).
    """
    if not isinstance(record, dict):
        return False, format_error_response("InvalidPayload", "Record must be a JSON object."), []

    missing = [f for f in REQUIRED_FIELDS if f not in record]
    if missing:
        return False, format_error_response(
            "MissingFieldsError",
            f"Record is missing required field(s): {missing}",
            {"missing_fields": missing, "required_fields": REQUIRED_FIELDS}
        ), []

    cleaned = {}
    for f in REQUIRED_FIELDS:
        val = record[f]
        if val is None or isinstance(val, bool) or not isinstance(val, (int, float)):
            try:
                val = float(val)
            except (ValueError, TypeError):
                return False, format_error_response(
                    "MalformedFieldError",
                    f"Field '{f}' must be a valid numeric value, received: {repr(record[f])}",
                    {"field": f, "received": record[f]}
                ), []

        val = float(val)
        # Agronomic and physical boundary checks
        if f == "plot_area_ha" and val <= 0:
            return False, format_error_response("RangeError", "Field 'plot_area_ha' must be strictly positive (> 0)."), []
        if f == "seed_kg" and val <= 0:
            return False, format_error_response("RangeError", "Field 'seed_kg' must be strictly positive (> 0)."), []
        if f == "rainfall_mm" and val < 0:
            return False, format_error_response("RangeError", "Field 'rainfall_mm' cannot be negative."), []
        if f == "distance_km" and val < 0:
            return False, format_error_response("RangeError", "Field 'distance_km' cannot be negative."), []
        if f == "soil_ph" and not (3.0 <= val <= 11.0):
            return False, format_error_response("RangeError", f"Field 'soil_ph' ({val}) is outside plausible soil pH range [3.0, 11.0]."), []
        if f == "arrival_hour" and not (0 <= val <= 24):
            return False, format_error_response("RangeError", f"Field 'arrival_hour' ({val}) must be within 0 and 24 hours."), []

        cleaned[f] = val

    feature_vector = [cleaned[f] for f in REQUIRED_FIELDS]
    return True, cleaned, feature_vector


def load_model_file(filename: str, models_dir: str):
    path = os.path.join(models_dir, filename)
    if not os.path.exists(path):
        alt = os.path.join(SCRIPT_DIR, "models", filename)
        if os.path.exists(alt):
            path = alt
        else:
            raise FileNotFoundError(
                f"Model file '{filename}' not found at {path}. Run run_all.py first to generate models."
            )
    with open(path, "r") as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(description="Predict cooperative decisions for a single potato record.")
    parser.add_argument("--record", type=str, help="JSON string representing a consignment record.")
    parser.add_argument("--models", type=str, default="models/", help="Path to models directory.")
    args = parser.parse_args()

    if not args.record:
        err = format_error_response("ArgumentMissing", "Missing required --record argument.")
        print(json.dumps(err, indent=2))
        sys.exit(1)

    try:
        raw_record = json.loads(args.record)
    except json.JSONDecodeError as e:
        err = format_error_response("MalformedJSON", f"Failed to parse input as valid JSON: {str(e)}")
        print(json.dumps(err, indent=2))
        sys.exit(1)

    is_valid, result_or_err, features = validate_record(raw_record)
    if not is_valid:
        print(json.dumps(result_or_err, indent=2))
        sys.exit(1)

    # Clean validated record
    clean_record = result_or_err
    x = np.array(features, dtype=np.float64)

    try:
        # 1. Regression Prediction (NumPy Linear Regression)
        reg_data = load_model_file("regression_model.json", args.models)
        scaler_mean = np.array(reg_data["scaler"]["mean"], dtype=np.float64)
        scaler_scale = np.array(reg_data["scaler"]["scale"], dtype=np.float64)
        weights = np.array(reg_data["weights"], dtype=np.float64)
        bias = float(reg_data["bias"])

        x_scaled_reg = (x - scaler_mean) / scaler_scale
        predicted_yield = float(np.dot(x_scaled_reg, weights) + bias)
        yield_per_ha = predicted_yield / clean_record["plot_area_ha"]

        # 2. Classification Prediction (Dispatch Attention Flag)
        clf_data = load_model_file("classification_model.json", args.models)
        clf_mean = np.array(clf_data["scaler_mean"], dtype=np.float64)
        clf_scale = np.array(clf_data["scaler_scale"], dtype=np.float64)
        clf_coefs = np.array(clf_data["coefficients"], dtype=np.float64)
        clf_intercept = float(clf_data["intercept"])

        x_scaled_clf = (x - clf_mean) / clf_scale
        logit = float(np.dot(x_scaled_clf, clf_coefs) + clf_intercept)
        # Sigmoid probability
        attention_prob = float(1.0 / (1.0 + np.exp(-logit)))
        predicted_flag = 1 if attention_prob >= 0.5 else 0

        risk_level = "HIGH" if attention_prob >= 0.65 else ("MEDIUM" if attention_prob >= 0.35 else "LOW")
        recommended_action = (
            "URGENT: Flag for priority depot inspection (moisture, temperature, fast-track unloading)."
            if predicted_flag == 1 else
            "Standard Dispatch: Consignment is within normal operating risk thresholds."
        )

        # 3. Clustering Assignment (Operating Profile)
        clust_data = load_model_file("clustering_model.json", args.models)
        clust_mean = np.array(clust_data["scaler_mean"], dtype=np.float64)
        clust_scale = np.array(clust_data["scaler_scale"], dtype=np.float64)
        centers = np.array(clust_data["cluster_centers"], dtype=np.float64)

        x_scaled_clust = (x - clust_mean) / clust_scale
        distances = np.linalg.norm(centers - x_scaled_clust, axis=1)
        cluster_label = int(np.argmin(distances))

        response = {
            "status": "success",
            "group_code": GROUP_CODE,
            "model_version": MODEL_VERSION,
            "input_record": clean_record,
            "predictions": {
                "regression": {
                    "target": "actual_yield_kg",
                    "predicted_yield_kg": round(predicted_yield, 2),
                    "yield_per_hectare_kg": round(yield_per_ha, 2),
                    "method": "NumPy Linear Regression (Batch Gradient Descent)"
                },
                "classification": {
                    "target": "dispatch_attention",
                    "predicted_flag": predicted_flag,
                    "dispatch_decision": "Dispatch Attention Required" if predicted_flag == 1 else "Standard Dispatch",
                    "dispatch_risk_probability": round(attention_prob, 4),
                    "risk_level": risk_level,
                    "recommended_action": recommended_action
                },
                "clustering": {
                    "cluster_label": cluster_label,
                    "profile_name": f"Operating Profile Cluster {cluster_label}",
                    "cautionary_note": (
                        "Exploratory operational grouping based on Euclidean feature similarity. "
                        "Do not claim as a verified real-world category."
                    )
                }
            }
        }

        print(json.dumps(response, indent=2))
        sys.exit(0)

    except Exception as e:
        err = format_error_response("InferenceError", f"Failed to run model inference: {str(e)}")
        print(json.dumps(err, indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()
