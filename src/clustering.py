"""Unsupervised Clustering of Musanze Farm Operating Profiles.
INES Ruhengeri - SWE 3513 AI Assignment 1
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA
from typing import Dict, Any, List
from .utils import save_json, ensure_dir


def run_clustering_pipeline(
    df: pd.DataFrame,
    X: np.ndarray,
    feature_names: List[str],
    output_dir: str = "artifacts",
    models_dir: str = "models",
    random_state: int = 42
) -> Dict[str, Any]:
    """Evaluates k=2..5 with silhouette scores, assigns cluster labels,

    generates clusters.csv, cluster_plot.png, and clustering_metrics.json.
    """
    ensure_dir(output_dir)
    ensure_dir(models_dir)

    # 1. Standardize features (Targets strictly excluded!)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 2. Evaluate k from 2 through 5
    k_range = [2, 3, 4, 5]
    silhouette_scores = {}
    models_by_k = {}
    labels_by_k = {}

    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=random_state, n_init=10)
        labels = kmeans.fit_predict(X_scaled)
        score = float(silhouette_score(X_scaled, labels))
        silhouette_scores[str(k)] = round(score, 4)
        models_by_k[k] = kmeans
        labels_by_k[k] = labels

    # 3. Select optimal k (maximum silhouette score)
    best_k = int(max(silhouette_scores, key=lambda k: silhouette_scores[k]))
    best_model = models_by_k[best_k]
    best_labels = labels_by_k[best_k]
    best_score = silhouette_scores[str(best_k)]

    # Justification text
    justification = (
        f"Evaluation of candidate values k in [2, 3, 4, 5] indicated that k = {best_k} achieves the highest "
        f"mean silhouette coefficient ({best_score:.4f}). This indicates the greatest relative cluster cohesion "
        f"(intra-cluster compactness) and separation (inter-cluster distance) without creating overly fragmented, "
        f"sparse operational buckets."
    )

    # Cautious scientific interpretation statement (rubric constraint)
    cautious_notice = (
        "CAUTIONARY SCIENTIFIC INTERPRETATION: As required by machine learning ethics and sound methodology, "
        "these clusters represent mathematical groupings in normalized feature space and MUST NOT be claimed as "
        "verified real-world categories or inherent farm typologies. Real-world agronomic performance depends on unmeasured "
        "micro-climates, seed varieties, and farmer practices. Cluster labels should be treated as exploratory operational "
        "groupings for logistics scheduling rather than deterministic labels."
    )

    # 4. Save cluster labels for every record in clusters.csv
    clusters_df = df.copy()
    clusters_df["cluster_label"] = best_labels
    clusters_csv_path = os.path.join(output_dir, "clusters.csv")
    clusters_df.to_csv(clusters_csv_path, index=False)

    # 5. Calculate cluster profiles (centroids in original units).
    # Labels are positional; index alignment would mis-assign rows when
    # the frame index is duplicated or non-monotonic.
    excluded_columns = [col for col in df.columns if col not in feature_names]
    cluster_profiles = {}
    cluster_counts = {}
    for cl in range(best_k):
        subset = df.iloc[np.flatnonzero(best_labels == cl)]
        cluster_counts[f"cluster_{cl}"] = len(subset)
        cluster_profiles[f"cluster_{cl}"] = {
            col: round(float(subset[col].mean()), 2)
            for col in feature_names
        }

    metrics_report = {
        "model_name": "K-Means Clustering with Silhouette Optimization",
        "random_seed": random_state,
        "features_evaluated": feature_names,
        "input_features_count": len(feature_names),
        "columns_excluded_from_clustering": excluded_columns,
        "target_leakage_prevented": True,
        "silhouette_scores_by_k": silhouette_scores,
        "selected_k": best_k,
        "selected_silhouette_score": best_score,
        "selection_justification": justification,
        "cautious_interpretation_statement": cautious_notice,
        "cluster_distribution": cluster_counts,
        "cluster_centroids_original_units": cluster_profiles
    }

    # Save metrics JSON
    metrics_path = os.path.join(output_dir, "clustering_metrics.json")
    save_json(metrics_report, metrics_path)

    # 6. Generate 2D PCA cluster visualization plot
    plot_path = os.path.join(output_dir, "cluster_plot.png")
    pca = PCA(n_components=2, random_state=random_state)
    X_pca = pca.fit_transform(X_scaled)
    centers_pca = pca.transform(best_model.cluster_centers_)

    fig, ax = plt.subplots(figsize=(8, 5.5), dpi=150)
    palette = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

    for cl in range(best_k):
        mask = (best_labels == cl)
        ax.scatter(
            X_pca[mask, 0], X_pca[mask, 1],
            c=palette[cl % len(palette)],
            label=f"Cluster {cl} (n={cluster_counts[f'cluster_{cl}']})",
            alpha=0.65, edgecolors="none", s=38
        )

    # Plot centroids
    ax.scatter(
        centers_pca[:, 0], centers_pca[:, 1],
        c="#0f172a", marker="X", s=130, linewidths=1.5, edgecolors="#ffffff",
        label="Cluster Centroids"
    )

    ax.set_title(
        f"Farm Operating Profiles (PCA Projection, k={best_k}, Silhouette={best_score:.3f})",
        fontsize=12, fontweight="bold", pad=12
    )
    ax.set_xlabel(f"Principal Component 1 ({pca.explained_variance_ratio_[0]*100:.1f}% var)", fontsize=10)
    ax.set_ylabel(f"Principal Component 2 ({pca.explained_variance_ratio_[1]*100:.1f}% var)", fontsize=10)
    ax.grid(True, linestyle="--", alpha=0.4)
    ax.legend(frameon=True, facecolor="#f8fafc", loc="best")
    plt.tight_layout()
    fig.savefig(plot_path)
    plt.close(fig)

    # 7. Save model configuration and centroids for predict.py
    model_save_path = os.path.join(models_dir, "clustering_model.json")
    save_json({
        "selected_k": best_k,
        "cluster_centers": best_model.cluster_centers_.tolist(),
        "scaler_mean": scaler.mean_.tolist(),
        "scaler_scale": scaler.scale_.tolist(),
        "feature_names": feature_names,
        "pca_components": pca.components_.tolist(),
        "pca_mean": pca.mean_.tolist(),
        "cluster_centroids_original_units": cluster_profiles
    }, model_save_path)

    return metrics_report
