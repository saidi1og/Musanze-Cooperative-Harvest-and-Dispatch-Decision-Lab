import { ArtifactsResponse } from "./types";

export const initialArtifactsData: ArtifactsResponse = {
  data_report: {
    group_code: "AI-G09",
    dataset_path: "data/AI_A1_G09.csv",
    sha256_fingerprint: "1de2293c3b42904dad884c33e6cd0758caa51bb62cd9614671e50b3e33318e06",
    row_count: 420,
    feature_count: 6,
    feature_names: [
      "plot_area_ha",
      "rainfall_mm",
      "soil_ph",
      "seed_kg",
      "distance_km",
      "arrival_hour"
    ],
    identifier_column: "record_id (excluded from feature matrix)",
    missing_values: {
      record_id: 0,
      plot_area_ha: 0,
      rainfall_mm: 0,
      soil_ph: 0,
      seed_kg: 0,
      distance_km: 0,
      arrival_hour: 0,
      actual_yield_kg: 0,
      dispatch_attention: 0
    },
    duplicate_record_ids: 0,
    duplicate_feature_rows: 0,
    descriptive_statistics: {
      plot_area_ha: { mean: 2.71, std: 1.21, min: 0.6, "25%": 1.66, "50%": 2.73, "75%": 3.75, max: 4.8 },
      rainfall_mm: { mean: 95.8, std: 24.3, min: 41.2, "25%": 79.1, "50%": 94.6, "75%": 111.4, max: 168.5 },
      soil_ph: { mean: 5.75, std: 0.44, min: 4.8, "25%": 5.45, "50%": 5.74, "75%": 6.05, max: 6.8 },
      seed_kg: { mean: 623.5, std: 279.4, min: 110.0, "25%": 381.2, "50%": 628.0, "75%": 863.5, max: 1120.0 },
      distance_km: { mean: 17.2, std: 8.5, min: 2.5, "25%": 9.8, "50%": 17.1, "75%": 24.5, max: 32.0 },
      arrival_hour: { mean: 9.8, std: 2.6, min: 6.0, "25%": 8.0, "50%": 9.0, "75%": 11.0, max: 18.0 },
      actual_yield_kg: { mean: 39512.4, std: 18560.1, min: 5410.0, "25%": 23410.0, "50%": 39810.0, "75%": 55120.0, max: 78920.0 },
      dispatch_attention: { mean: 0.136, std: 0.343, min: 0.0, "25%": 0.0, "50%": 0.0, "75%": 0.0, max: 1.0 }
    },
    schema_validation: "PASSED"
  },
  regression_metrics: {
    model_name: "NumPy Linear Regression (Batch Gradient Descent)",
    random_seed: 42,
    n_train_samples: 336,
    n_test_samples: 84,
    hyperparameters: {
      learning_rate: 0.05,
      n_epochs: 2000,
      optimization_method: "Batch Gradient Descent",
      loss_function: "Mean Squared Error (MSE / 2)"
    },
    training_performance: {
      initial_loss: 148472362.53,
      final_loss: 10175429.99,
      mae_kg: 3412.35,
      rmse_kg: 4511.19,
      r2_score: 0.9412
    },
    test_performance: {
      mae_kg: 3666.54,
      rmse_kg: 5159.71,
      r2_score: 0.9227
    },
    model_parameters: {
      bias_intercept: 39540.21,
      standardized_feature_weights: {
        plot_area_ha: 14210.45,
        rainfall_mm: 1210.12,
        soil_ph: 840.67,
        seed_kg: 3150.88,
        distance_km: -210.45,
        arrival_hour: -105.32
      }
    },
    scientific_integrity: {
      scaler_fitted_on: "training_data_only",
      leakage_prevented: true,
      estimator_source: "pure_numpy_from_first_principles"
    }
  },
  classification_metrics: {
    model_name: "Interpretable Logistic Regression",
    random_seed: 42,
    split_method: "Stratified Train/Test Split (80/20)",
    train_samples: 336,
    test_samples: 84,
    class_distribution_test: {
      standard_dispatch_0: 73,
      dispatch_attention_1: 11
    },
    confusion_matrix: {
      true_negatives: 72,
      false_positives: 1,
      false_negatives: 6,
      true_positives: 5,
      matrix_2x2: [[72, 1], [6, 5]]
    },
    performance_metrics: {
      accuracy: 0.9167,
      precision: 0.8333,
      recall: 0.4545,
      f1_score: 0.5882
    },
    interpretability_feature_coefficients: {
      arrival_hour: 2.145,
      distance_km: 1.621,
      rainfall_mm: 1.042,
      soil_ph: -0.835,
      seed_kg: -0.214,
      plot_area_ha: 0.112
    },
    intercept: -3.1205,
    cost_of_errors_analysis: "In the Musanze HarvestLink operational workflow, a False Negative (FN: failing to flag a high-risk consignment) is substantially more damaging than a False Positive (FP: unnecessarily inspecting a sound consignment). Missing a risk flag allows perishable potatoes damaged by rain or delayed transit to be loaded onto Kigali distribution trucks, leading to batch rotting, contractual penalties, and cooperative reputation damage (~250,000 RWF per lot). Conversely, a False Positive results merely in a 5-minute visual quality audit by warehouse inspectors (~3,000 RWF). Hence, operational priority requires maintaining high Recall to catch all fragile shipments.",
    scientific_integrity: {
      scaler_fitted_on: "training_data_only",
      stratified_split: true,
      leakage_prevented: true
    }
  },
  clustering_metrics: {
    model_name: "K-Means Clustering with Silhouette Optimization",
    random_seed: 42,
    features_evaluated: [
      "plot_area_ha",
      "rainfall_mm",
      "soil_ph",
      "seed_kg",
      "distance_km",
      "arrival_hour"
    ],
    input_features_count: 6,
    target_leakage_prevented: true,
    silhouette_scores_by_k: {
      "2": 0.2353,
      "3": 0.1783,
      "4": 0.1751,
      "5": 0.1642
    },
    selected_k: 2,
    selected_silhouette_score: 0.2353,
    selection_justification: "Evaluation of candidate values k in [2, 3, 4, 5] indicated that k = 2 achieves the highest mean silhouette coefficient (0.2353). This indicates the greatest relative cluster cohesion (intra-cluster compactness) and separation (inter-cluster distance) without creating overly fragmented, sparse operational buckets.",
    cautious_interpretation_statement: "CAUTIONARY SCIENTIFIC INTERPRETATION: As required by machine learning ethics and sound methodology, these clusters represent mathematical groupings in normalized feature space and MUST NOT be claimed as verified real-world categories or inherent farm typologies. Real-world agronomic performance depends on unmeasured micro-climates, seed varieties, and farmer practices. Cluster labels should be treated as exploratory operational groupings for logistics scheduling rather than deterministic labels.",
    cluster_distribution: {
      cluster_0: 218,
      cluster_1: 202
    },
    cluster_centroids_original_units: {
      cluster_0: {
        plot_area_ha: 1.74,
        rainfall_mm: 94.2,
        soil_ph: 5.76,
        seed_kg: 398.5,
        distance_km: 16.8,
        arrival_hour: 9.6
      },
      cluster_1: {
        plot_area_ha: 3.75,
        rainfall_mm: 97.4,
        soil_ph: 5.73,
        seed_kg: 865.8,
        distance_km: 17.6,
        arrival_hour: 10.1
      }
    }
  },
  images: {
    regression_loss: "/artifacts/regression_loss.png",
    confusion_matrix: "/artifacts/confusion_matrix.png",
    cluster_plot: "/artifacts/cluster_plot.png"
  }
};
