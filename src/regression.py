"""NumPy Linear Regression with Batch Gradient Descent From First Principles.
INES Ruhengeri - SWE 3513 AI Assignment 1
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from typing import Dict, Any, Tuple
from .utils import calculate_regression_metrics, save_json, ensure_dir


class NumPyStandardScaler:
    """Standardizes features by removing the mean and scaling to unit variance (first principles)."""
    def __init__(self):
        self.mean_ = None
        self.scale_ = None

    def fit(self, X: np.ndarray) -> "NumPyStandardScaler":
        self.mean_ = np.mean(X, axis=0)
        self.scale_ = np.std(X, axis=0)
        # Avoid division by zero for constant features
        self.scale_[self.scale_ == 0.0] = 1.0
        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        if self.mean_ is None or self.scale_ is None:
            raise ValueError("Scaler has not been fitted yet.")
        return (X - self.mean_) / self.scale_

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        return self.fit(X).transform(X)

    def to_dict(self) -> dict:
        return {
            "mean": self.mean_.tolist(),
            "scale": self.scale_.tolist()
        }

    def from_dict(self, data: dict):
        self.mean_ = np.array(data["mean"], dtype=np.float64)
        self.scale_ = np.array(data["scale"], dtype=np.float64)
        return self


def train_test_split_numpy(
    X: np.ndarray,
    y: np.ndarray,
    test_size: float = 0.2,
    random_state: int = 42
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Splits NumPy arrays into train and test sets using a fixed random seed."""
    rng = np.random.RandomState(random_state)
    n_samples = len(X)
    indices = np.arange(n_samples)
    rng.shuffle(indices)

    n_test = int(n_samples * test_size)
    test_idx = indices[:n_test]
    train_idx = indices[n_test:]

    return X[train_idx], X[test_idx], y[train_idx], y[test_idx]


class NumPyLinearRegression:
    """Multiple Linear Regression estimated via Batch Gradient Descent using pure NumPy."""
    def __init__(self, learning_rate: float = 0.05, n_epochs: int = 2000, random_state: int = 42):
        self.learning_rate = learning_rate
        self.n_epochs = n_epochs
        self.random_state = random_state
        self.weights = None
        self.bias = 0.0
        self.loss_history = []

    def fit(self, X: np.ndarray, y: np.ndarray) -> "NumPyLinearRegression":
        m, n = X.shape
        rng = np.random.RandomState(self.random_state)
        # Initialize weights with small random values
        self.weights = rng.normal(0, 0.01, size=n)
        self.bias = float(np.mean(y))  # Initialize bias near sample target mean
        self.loss_history = []

        for epoch in range(self.n_epochs):
            # Forward pass: hypothesis y_hat = X * w + b
            y_pred = np.dot(X, self.weights) + self.bias
            errors = y_pred - y

            # Mean Squared Error Cost: J = (1 / 2m) * sum(errors^2)
            cost = float(np.mean(errors ** 2) / 2.0)
            self.loss_history.append(cost)

            # Gradient computation
            # dJ/dw = (1/m) * X^T * errors
            # dJ/db = (1/m) * sum(errors)
            dw = np.dot(X.T, errors) / m
            db = np.sum(errors) / m

            # Gradient Descent update
            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        if self.weights is None:
            raise ValueError("Model has not been trained yet.")
        return np.dot(X, self.weights) + self.bias


def run_regression_pipeline(
    X: np.ndarray,
    y: np.ndarray,
    feature_names: list,
    output_dir: str = "artifacts",
    models_dir: str = "models",
    random_state: int = 42,
    learning_rate: float = 0.05,
    n_epochs: int = 2000
) -> Dict[str, Any]:
    """Executes the NumPy regression pipeline: split, scaling, gradient descent, metrics, and plots."""
    ensure_dir(output_dir)
    ensure_dir(models_dir)

    # 1. Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split_numpy(
        X, y, test_size=0.2, random_state=random_state
    )

    # 2. Feature scaling (FIT SCALER ONLY ON TRAINING DATA to prevent data leakage)
    scaler = NumPyStandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 3. Train Linear Regression using Batch Gradient Descent
    model = NumPyLinearRegression(
        learning_rate=learning_rate,
        n_epochs=n_epochs,
        random_state=random_state
    )
    model.fit(X_train_scaled, y_train)

    # 4. Predictions on both train and test sets
    y_train_pred = model.predict(X_train_scaled)
    y_test_pred = model.predict(X_test_scaled)

    # 5. Compute metrics
    train_metrics = calculate_regression_metrics(y_train, y_train_pred)
    test_metrics = calculate_regression_metrics(y_test, y_test_pred)

    weights_dict = {
        name: round(float(w), 4) for name, w in zip(feature_names, model.weights)
    }

    metrics_report = {
        "model_name": "NumPy Linear Regression (Batch Gradient Descent)",
        "random_seed": random_state,
        "n_train_samples": len(X_train),
        "n_test_samples": len(X_test),
        "hyperparameters": {
            "learning_rate": learning_rate,
            "n_epochs": n_epochs,
            "optimization_method": "Batch Gradient Descent",
            "loss_function": "Mean Squared Error (MSE / 2)"
        },
        "training_performance": {
            "initial_loss": round(model.loss_history[0], 4),
            "final_loss": round(model.loss_history[-1], 4),
            "mae_kg": train_metrics["mae"],
            "rmse_kg": train_metrics["rmse"],
            "r2_score": train_metrics["r2"]
        },
        "test_performance": {
            "mae_kg": test_metrics["mae"],
            "rmse_kg": test_metrics["rmse"],
            "r2_score": test_metrics["r2"]
        },
        "model_parameters": {
            "bias_intercept": round(float(model.bias), 4),
            "standardized_feature_weights": weights_dict
        },
        "scientific_integrity": {
            "scaler_fitted_on": "training_data_only",
            "leakage_prevented": True,
            "estimator_source": "pure_numpy_from_first_principles"
        }
    }

    # Save metrics JSON
    metrics_path = os.path.join(output_dir, "regression_metrics.json")
    save_json(metrics_report, metrics_path)

    # 6. Generate and save Loss Curve Plot
    plot_path = os.path.join(output_dir, "regression_loss.png")
    fig, ax = plt.subplots(figsize=(8, 5), dpi=150)
    epochs_axis = np.arange(1, len(model.loss_history) + 1)
    ax.plot(epochs_axis, model.loss_history, color="#10b981", linewidth=2.2, label="BGD Training Loss ($J$)")
    ax.set_title("NumPy Gradient Descent Convergence (Musanze Potato Yield)", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Epoch / Iteration", fontsize=11)
    ax.set_ylabel("Mean Squared Error Cost ($J$)", fontsize=11)
    ax.grid(True, linestyle="--", alpha=0.5)
    ax.legend(frameon=True, facecolor="#f8fafc")
    
    # Text annotation for final R² and RMSE
    info_text = f"Test $R^2$: {test_metrics['r2']:.3f}\nTest RMSE: {test_metrics['rmse']:.1f} kg\nTest MAE: {test_metrics['mae']:.1f} kg"
    ax.text(
        0.65, 0.65, info_text, transform=ax.transAxes,
        fontsize=10, verticalalignment="top",
        bbox=dict(boxstyle="round,pad=0.5", facecolor="#f1f5f9", edgecolor="#cbd5e1")
    )
    plt.tight_layout()
    fig.savefig(plot_path)
    plt.close(fig)

    # 7. Save model and scaler for predict.py
    model_save_path = os.path.join(models_dir, "regression_model.json")
    save_json({
        "weights": model.weights.tolist(),
        "bias": float(model.bias),
        "scaler": scaler.to_dict(),
        "feature_names": feature_names,
        "metrics": metrics_report["test_performance"]
    }, model_save_path)

    return metrics_report
