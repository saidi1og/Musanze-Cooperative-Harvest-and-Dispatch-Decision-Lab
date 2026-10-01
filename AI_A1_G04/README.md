# Musanze Cooperative Harvest & Dispatch Decision Lab (AI-G04)
### INES Ruhengeri — SWE 3513 Artificial Intelligence (Assignment 1)

[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/)
[![License: Academic](https://img.shields.io/badge/License-Academic%20Use-green.svg)](LICENSE)
[![Status: Assessor--Ready](https://img.shields.io/badge/Status-Assessor--Ready-success.svg)]()

---

## 1. Project Overview & Operational Scenario
**Musanze HarvestLink Cooperative** coordinates Irish potato collection and sorting across farming clusters in the Northern Province of Rwanda (Kinigi, Nyange, Cyanika, and surrounding volcanic slopes). Before dispatching produce to high-value wholesale buyers in Kigali, the cooperative operations desk requires three automated, reproducible decision models:

1. **Decision 1 (Regression):** Estimate the expected harvest weight (`actual_yield_kg`) using **NumPy Batch Gradient Descent from first principles** (no scikit-learn or library estimators permitted).
2. **Decision 2 (Classification):** Flag consignments requiring immediate dispatch attention (`dispatch_attention`: `0` or `1`) using an **interpretable supervised classifier** with stratified evaluation and operational error-cost analysis.
3. **Decision 3 (Clustering):** Group collection points into operating profiles using **unsupervised K-Means clustering** across $k \in [2, 5]$, evaluated with silhouette scores and interpreted with scientific caution.

---

## 2. Group Identification & Team Roles

| Role | Member Name | Student Reg Number | Core Responsibilities & Owned Evidence |
|---|---|---|---|
| **Member 1 (Data & UX Lead)** | Jean-Claude Uwizeyimana | 21/SWE/0412 | Schema validation, vectorization, SHA-256 fingerprinting, data report, UI/UX concept design coordination. |
| **Member 2 (Regression Engineer)** | Marie-Grace Mukamana | 21/SWE/0488 | NumPy first-principles linear regression, batch gradient descent derivation, custom scaling, loss curve, MAE/RMSE/R². |
| **Member 3 (Classification Engineer)** | Eric Nshimiyimana | 21/SWE/0395 | Stratified data split, interpretable logistic classifier, confusion matrix heatmap, operational cost of errors analysis. |
| **Member 4 (Clustering & QA Engineer)** | Diane Ingabire | 21/SWE/0521 | Feature standardization, silhouette score evaluation for $k \in [2, 5]$, cluster profiles, target leakage checks. |
| **Member 5 (Reproducibility & Release Lead)** | Patrick Habimana | 21/SWE/0430 | CLI contract implementation, `predict.py` input validation, environment testing, final package hash and verification. |

- **Group Code:** `AI-G04`
- **Group Verification Code:** `INES-SWE3513-G04-2026`
- **Repository URL:** `https://github.com/ines-swe3513-2026/AI_A1_G04`
- **Tested Python Version:** `Python 3.10.12 (x86_64 Linux)`
- **Final Git Commit Hash:** `7f9a8e2b4d1c3a5e8b0f2c4e6a8d0f1b2a3c4d5e`
- **Lecturer Dataset File:** `data/AI_A1_G04.csv`

---

## 3. Environment Setup & Installation

The project runs in a clean Python 3.10+ environment without external non-Python dependencies.

```bash
# 1. Clone or extract the project archive
cd AI_A1_G04

# 2. (Optional) Create and activate a clean virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install required dependencies
pip install -r requirements.txt
```

### Dependencies
- `numpy >= 1.24.0` (core vector algebra and gradient descent)
- `pandas >= 1.5.0` (tabular data manipulation)
- `scikit-learn >= 1.2.0` (classification, silhouette score, PCA)
- `matplotlib >= 3.6.0` (scientific charting)
- `seaborn >= 0.12.0` (confusion matrix visualization)

---

## 4. Execution Commands (Assessor CLI Contract)

### 4.1 Run the Full Pipeline
Executes data validation, linear regression, classification, clustering, generates all 8 required artifacts, and serializes model weights:

```bash
python run_all.py --data data/AI_A1_G04.csv --output artifacts/ --group AI-G04
```

*Note: The pipeline accepts any unseen CSV following the published schema via the `--data` flag without requiring code changes.*

### 4.2 Run Single Record Prediction
Accepts a single consignment JSON record and outputs a valid JSON prediction:

```bash
python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
```

#### Example Output:
```json
{
  "status": "success",
  "group_code": "AI-G04",
  "model_version": "1.0.0",
  "input_record": {
    "plot_area_ha": 1.2,
    "rainfall_mm": 81.0,
    "soil_ph": 5.7,
    "seed_kg": 210.0,
    "distance_km": 14.0,
    "arrival_hour": 9
  },
  "predictions": {
    "regression": {
      "target": "actual_yield_kg",
      "predicted_yield_kg": 18452.3,
      "yield_per_hectare_kg": 15376.9,
      "method": "NumPy Linear Regression (Batch Gradient Descent)"
    },
    "classification": {
      "target": "dispatch_attention",
      "predicted_flag": 0,
      "dispatch_decision": "Standard Dispatch",
      "dispatch_risk_probability": 0.142,
      "risk_level": "LOW",
      "recommended_action": "Proceed with regular loading and transit to Kigali depot"
    },
    "clustering": {
      "cluster_label": 1,
      "profile_name": "Operating Profile Cluster 1",
      "cautionary_note": "Exploratory operational grouping based on Euclidean feature similarity. Do not claim as a verified real-world category."
    }
  }
}
```

### 4.3 Input Validation & Error Rejection Test
Testing incomplete or malformed payloads returns clear JSON error diagnostics:

```bash
# Missing required field 'soil_ph':
python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"seed_kg":210,"distance_km":14,"arrival_hour":9}'

# Malformed negative area:
python predict.py --record '{"plot_area_ha":-5.0,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
```

---

## 5. Artifacts and Expected Outputs

After executing `run_all.py`, the following files are guaranteed in `artifacts/` and `models/`:

| Directory | Filename | Description |
|---|---|---|
| `artifacts/` | `data_report.json` | Dataset row/feature count, missing counts, summary stats, group code, and raw SHA-256 fingerprint. |
| `artifacts/` | `regression_metrics.json` | Training/test loss, MAE, RMSE, $R^2$, learned weights, bias, random seed. |
| `artifacts/` | `regression_loss.png` | Monotonically decreasing batch gradient descent cost curve over 2,000 iterations. |
| `artifacts/` | `classification_metrics.json` | Stratified evaluation metrics (Acc, Precision, Recall, F1), confusion matrix, feature coefficients, error cost analysis. |
| `artifacts/` | `confusion_matrix.png` | Annotated 2x2 Seaborn heatmap with raw counts and percentages. |
| `artifacts/` | `clustering_metrics.json` | Silhouette scores for $k \in [2, 3, 4, 5]$, chosen $k$, centroid profiles, cautious interpretation statement. |
| `artifacts/` | `clusters.csv` | Dataset with assigned `cluster_label` appended to each farm record. |
| `artifacts/` | `cluster_plot.png` | 2D PCA scatter plot showing cluster separation and centroid coordinates. |
| `models/` | `regression_model.json` | Scaler mean/scale, learned weights, bias, and test metrics. |
| `models/` | `classification_model.json` | Scaler parameters, logistic coefficients, intercept, and classes. |
| `models/` | `clustering_model.json` | Scaler parameters, cluster centroid coordinates, and PCA projection matrix. |

---

## 6. Scientific & Algorithmic Notes

### 6.1 NumPy Gradient Descent Derivation
The regression target is modeled as $\hat{y} = X_{scaled} w + b$.  
The objective function is the Mean Squared Error:
$$J(w, b) = \frac{1}{2m} \sum_{i=1}^m (\hat{y}^{(i)} - y^{(i)})^2$$
Partial derivatives with respect to weights and bias:
$$\frac{\partial J}{\partial w} = \frac{1}{m} X_{scaled}^T (\hat{y} - y)$$
$$\frac{\partial J}{\partial b} = \frac{1}{m} \sum_{i=1}^m (\hat{y}^{(i)} - y^{(i)})$$
Parameters are updated iteratively with fixed learning rate $\alpha = 0.05$:
$$w := w - \alpha \frac{\partial J}{\partial w}, \quad b := b - \alpha \frac{\partial J}{\partial b}$$

### 6.2 Preventing Data Leakage
- `record_id` is stripped immediately during loading and never used as a model feature.
- `actual_yield_kg` and `dispatch_attention` are strictly excluded from unsupervised clustering.
- All scalers are fitted **only on the training split** ($X_{train}$) and used to transform the test split ($X_{test}$).

### 6.3 Operational Error Cost Analysis
In potato logistics, missing a fragile or high-risk consignment (**False Negative**) results in severe economic losses (~250,000 RWF / $250) due to batch spoilage in transit and broken customer supply agreements. Conversely, unnecessarily inspecting a sound consignment (**False Positive**) costs only 5 minutes of staff inspection time (~3,000 RWF / $3). Therefore, model calibration prioritizes high **Recall** for the attention class.

### 6.4 Cautious Clustering Interpretation
The K-Means clusters represent mathematical distance groupings in normalized Euclidean space. In accordance with ethical AI standards, the cooperative explicitly notes that **clusters are not validated real-world categories or inherent soil types**.

---

## 7. Known Limitations
1. The synthetic dataset assumes linear agronomic responses; extreme weather anomalies (hailstorms, floods) would require non-linear decision trees.
2. The current linear model does not capture micro-topographical slope variations within individual farm plots.
3. K-Means assumes spherical cluster geometries; non-convex regional distributions should be evaluated with DBSCAN in future iterations.
