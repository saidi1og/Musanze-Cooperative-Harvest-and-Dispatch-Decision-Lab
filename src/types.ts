export interface DataReport {
  group_code: string;
  dataset_path: string;
  sha256_fingerprint: string;
  row_count: number;
  feature_count: number;
  feature_names: string[];
  identifier_column: string;
  missing_values: Record<string, number>;
  duplicate_record_ids: number;
  duplicate_feature_rows: number;
  descriptive_statistics: Record<
    string,
    {
      mean: number;
      std: number;
      min: number;
      "25%": number;
      "50%": number;
      "75%": number;
      max: number;
    }
  >;
  schema_validation: string;
}

export interface RegressionMetrics {
  model_name: string;
  random_seed: number;
  n_train_samples: number;
  n_test_samples: number;
  hyperparameters: {
    learning_rate: number;
    n_epochs: number;
    optimization_method: string;
    loss_function: string;
  };
  training_performance: {
    initial_loss: number;
    final_loss: number;
    mae_kg: number;
    rmse_kg: number;
    r2_score: number;
  };
  test_performance: {
    mae_kg: number;
    rmse_kg: number;
    r2_score: number;
  };
  model_parameters: {
    bias_intercept: number;
    standardized_feature_weights: Record<string, number>;
  };
  scientific_integrity: {
    scaler_fitted_on: string;
    leakage_prevented: boolean;
    estimator_source: string;
  };
}

export interface ClassificationMetrics {
  model_name: string;
  random_seed: number;
  split_method: string;
  train_samples: number;
  test_samples: number;
  class_distribution_test: {
    standard_dispatch_0: number;
    dispatch_attention_1: number;
  };
  confusion_matrix: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
    matrix_2x2: number[][];
  };
  performance_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  interpretability_feature_coefficients: Record<string, number>;
  intercept: number;
  cost_of_errors_analysis: string;
  scientific_integrity: {
    scaler_fitted_on: string;
    stratified_split: boolean;
    leakage_prevented: boolean;
  };
}

export interface ClusteringMetrics {
  model_name: string;
  random_seed: number;
  features_evaluated: string[];
  input_features_count: number;
  target_leakage_prevented: boolean;
  silhouette_scores_by_k: Record<string, number>;
  selected_k: number;
  selected_silhouette_score: number;
  selection_justification: string;
  cautious_interpretation_statement: string;
  cluster_distribution: Record<string, number>;
  cluster_centroids_original_units: Record<string, Record<string, number>>;
}

export interface ArtifactsResponse {
  data_report: DataReport;
  regression_metrics: RegressionMetrics;
  classification_metrics: ClassificationMetrics;
  clustering_metrics: ClusteringMetrics;
  images: {
    regression_loss: string;
    confusion_matrix: string;
    cluster_plot: string;
  };
}

export interface FarmRecord {
  record_id: string;
  plot_area_ha: number;
  rainfall_mm: number;
  soil_ph: number;
  seed_kg: number;
  distance_km: number;
  arrival_hour: number;
  actual_yield_kg: number;
  dispatch_attention: number;
  cluster_label?: number;
}
