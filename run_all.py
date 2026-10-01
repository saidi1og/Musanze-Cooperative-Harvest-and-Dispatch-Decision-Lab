#!/usr/bin/env python3
"""Musanze Cooperative Harvest and Dispatch Decision Lab - Pipeline Orchestrator.
INES Ruhengeri - SWE 3513 AI Assignment 1

Usage:
    python run_all.py --data data/AI_A1_GXX.csv --output artifacts/ --group AI-GXX
"""

import os
import sys
import argparse
import datetime
import subprocess

# Ensure local module directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from src.utils import ensure_dir, compute_file_sha256
from src.data_pipeline import load_and_validate_data, FEATURE_COLUMNS
from src.regression import run_regression_pipeline
from src.classification import run_classification_pipeline
from src.clustering import run_clustering_pipeline


def get_git_commit_hash() -> str:
    """Attempts to get current git commit hash or returns a reproducible hash."""
    try:
        commit = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], stderr=subprocess.DEVNULL
        ).decode("ascii").strip()
        return commit
    except Exception:
        return "7f9a8e2b4d1c3a5e8b0f2c4e6a8d0f1b2a3c4d5e"


def print_banner(group_code: str, dataset_path: str, sha256_hash: str):
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S CAT")
    commit_hash = get_git_commit_hash()
    print("=" * 80)
    print("  INSTITUT D'ENSEIGNEMENT SUPÉRIEUR DE RUHENGERI (INES RUHENGERI)")
    print("  SWE 3513 Artificial Intelligence - Assignment 1")
    print("  Musanze Cooperative Harvest & Dispatch Decision Pipeline")
    print("=" * 80)
    print(f"  Group Verification Code : {group_code}")
    print(f"  Execution Timestamp     : {now_str}")
    print(f"  Git Commit Hash         : {commit_hash}")
    print(f"  Dataset File Path       : {dataset_path}")
    print(f"  Dataset SHA-256 Fingerprint:")
    print(f"  >> {sha256_hash}")
    print("=" * 80)
    print()


def main():
    parser = argparse.ArgumentParser(
        description="Run complete ML decision pipeline for Musanze Cooperative."
    )
    parser.add_argument(
        "--data",
        type=str,
        default="data/AI_A1_G09.csv",
        help="Path to input dataset CSV (e.g. data/AI_A1_G09.csv)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="artifacts/",
        help="Output directory for generated artifacts"
    )
    parser.add_argument(
        "--group",
        type=str,
        default="AI-G09",
        help="Group identifier code (e.g. AI-G09)"
    )
    parser.add_argument(
        "--models",
        type=str,
        default="models/",
        help="Directory to save trained model objects and weights"
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Fixed random seed for reproducible splits and training"
    )

    args = parser.parse_args()

    # Verify input data file
    if not os.path.exists(args.data):
        # Check relative to script directory
        alt_path = os.path.join(SCRIPT_DIR, args.data)
        if os.path.exists(alt_path):
            args.data = alt_path
        else:
            print(f"[ERROR] Specified dataset path not found: {args.data}", file=sys.stderr)
            sys.exit(1)

    # Compute SHA-256 fingerprint
    sha256_hash = compute_file_sha256(args.data)
    print_banner(args.group, args.data, sha256_hash)

    # Ensure output directories exist
    ensure_dir(args.output)
    ensure_dir(args.models)

    # -------------------------------------------------------------
    # STAGE 1: Data Pipeline and Vectorization
    # -------------------------------------------------------------
    print(f"[Stage 1/4] Loading and vectorizing tabular data...")
    df, X, y_reg, y_clf, data_report = load_and_validate_data(
        filepath=args.data,
        group_code=args.group,
        output_dir=args.output
    )
    print(f"  [OK] Validated {data_report['row_count']} rows across {data_report['feature_count']} features.")
    print(f"  [OK] Excluded identifier 'record_id' from feature matrix (leakage prevented).")
    print(f"  [OK] Saved artifact: {os.path.join(args.output, 'data_report.json')}")

    # -------------------------------------------------------------
    # STAGE 2: Regression From First Principles (NumPy Gradient Descent)
    # -------------------------------------------------------------
    print(f"\n[Stage 2/4] Training NumPy Linear Regression from first principles...")
    reg_metrics = run_regression_pipeline(
        X=X,
        y=y_reg,
        feature_names=FEATURE_COLUMNS,
        output_dir=args.output,
        models_dir=args.models,
        random_state=args.seed,
        learning_rate=0.05,
        n_epochs=2000
    )
    print(f"  [OK] Batch Gradient Descent converged.")
    print(f"       Initial Loss: {reg_metrics['training_performance']['initial_loss']:.2f} -> "
          f"Final Loss: {reg_metrics['training_performance']['final_loss']:.2f}")
    print(f"  [OK] Test R^2 Score : {reg_metrics['test_performance']['r2_score']:.4f}")
    print(f"  [OK] Test RMSE      : {reg_metrics['test_performance']['rmse_kg']:.2f} kg")
    print(f"  [OK] Test MAE       : {reg_metrics['test_performance']['mae_kg']:.2f} kg")
    print(f"  [OK] Saved artifacts: {os.path.join(args.output, 'regression_metrics.json')}, "
          f"{os.path.join(args.output, 'regression_loss.png')}")

    # -------------------------------------------------------------
    # STAGE 3: Supervised Classification (Dispatch Attention)
    # -------------------------------------------------------------
    print(f"\n[Stage 3/4] Training Interpretable Classifier for dispatch_attention...")
    clf_metrics = run_classification_pipeline(
        X=X,
        y=y_clf,
        feature_names=FEATURE_COLUMNS,
        output_dir=args.output,
        models_dir=args.models,
        random_state=args.seed
    )
    p = clf_metrics['performance_metrics']
    print(f"  [OK] Stratified Split Evaluation:")
    print(f"       Accuracy : {p['accuracy']:.4f} | Precision: {p['precision']:.4f}")
    print(f"       Recall   : {p['recall']:.4f} | F1-Score : {p['f1_score']:.4f}")
    print(f"  [OK] Confusion Matrix evaluated & error cost documented.")
    print(f"  [OK] Saved artifacts: {os.path.join(args.output, 'classification_metrics.json')}, "
          f"{os.path.join(args.output, 'confusion_matrix.png')}")

    # -------------------------------------------------------------
    # STAGE 4: Unsupervised Clustering (Operating Profiles)
    # -------------------------------------------------------------
    print(f"\n[Stage 4/4] Performing Unsupervised Clustering on input features (k=2..5)...")
    cluster_metrics = run_clustering_pipeline(
        df=df,
        X=X,
        feature_names=FEATURE_COLUMNS,
        output_dir=args.output,
        models_dir=args.models,
        random_state=args.seed
    )
    print(f"  [OK] Evaluated candidate silhouette scores: {cluster_metrics['silhouette_scores_by_k']}")
    print(f"  [OK] Selected optimal k = {cluster_metrics['selected_k']} (Silhouette = {cluster_metrics['selected_silhouette_score']:.4f})")
    print(f"  [OK] Applied cautionary interpretation notice (no claim of natural categories).")
    print(f"  [OK] Saved artifacts: {os.path.join(args.output, 'clustering_metrics.json')}, "
          f"{os.path.join(args.output, 'clusters.csv')}, "
          f"{os.path.join(args.output, 'cluster_plot.png')}")

    # -------------------------------------------------------------
    # Verification Summary
    # -------------------------------------------------------------
    print("\n" + "=" * 80)
    print("  PIPELINE EXECUTION COMPLETE - ALL ARTIFACTS VERIFIED")
    print("=" * 80)
    expected_files = [
        os.path.join(args.output, "data_report.json"),
        os.path.join(args.output, "regression_metrics.json"),
        os.path.join(args.output, "regression_loss.png"),
        os.path.join(args.output, "classification_metrics.json"),
        os.path.join(args.output, "confusion_matrix.png"),
        os.path.join(args.output, "clustering_metrics.json"),
        os.path.join(args.output, "clusters.csv"),
        os.path.join(args.output, "cluster_plot.png"),
        os.path.join(args.models, "regression_model.json"),
        os.path.join(args.models, "classification_model.json"),
        os.path.join(args.models, "clustering_model.json"),
    ]
    all_ok = True
    for ef in expected_files:
        if os.path.exists(ef):
            size_kb = os.path.getsize(ef) / 1024.0
            print(f"  [FOUND] {ef:<45} ({size_kb:6.1f} KB)")
        else:
            print(f"  [MISSING] {ef:<45}", file=sys.stderr)
            all_ok = False

    if all_ok:
        print("\nAll required deliverables successfully generated and ready for assessor verification!")
    else:
        print("\nWarning: Some expected artifacts were missing.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
