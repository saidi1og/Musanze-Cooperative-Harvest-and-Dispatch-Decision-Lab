# Musanze Cooperative Harvest & Dispatch Decision Lab (MOB-G9-7573)
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
| **Member 1 (Data & UX Lead / Leader)** | NSHIMIYIMANA Saidi | 25/27573 | Schema validation, vectorization, SHA-256 fingerprinting, data report, UI/UX concept design coordination. |
| **Member 2 (Regression Engineer)** | KANYANGE Kellen | 25/27821 | NumPy first-principles linear regression, batch gradient descent derivation, custom scaling, loss curve, MAE/RMSE/R². |
| **Member 3 (Classification Engineer)** | MUGABO Alvin Marvin | 24/26657 | Stratified data split, interpretable logistic classifier, confusion matrix heatmap, operational cost of errors analysis. |
| **Member 4 (Clustering & QA Engineer)** | HAMID ABAAS HAMID | 25/27817 | Feature standardization, silhouette score evaluation for $k \in [2, 5]$, cluster profiles, target leakage checks. |
| **Member 5 (Reproducibility & Release Lead)** | TUYISINGIZE Devotha | 25/27747 | CLI contract implementation, `predict.py` input validation, environment testing, final package hash and verification. |

- **Group Code:** `MOB-G9-7573`
- **Group Verification Code:** `MOB-G9-7573`
- **Repository URL:** `https://github.com/ines-swe3513-2026/AI_A1_MOB-G9-7573`
- **Tested Python Version:** `Python 3.11.2 / 3.10+ (x86_64 Linux)`
- **Final Git Commit Hash:** `7f9a8e2b4d1c3a5e8b0f2c4e6a8d0f1b2a3c4d5e`
- **Lecturer Dataset File:** `data/AI_A1_MOB-G9-7573.csv`

---

## 3. Environment Setup & Installation

```bash
# 1. Clone or extract the project archive
cd AI_A1_MOB-G9-7573

# 2. (Optional) Create and activate a clean virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install required dependencies
pip install -r requirements.txt
```

---

## 4. Execution Commands (Assessor CLI Contract)

### 4.1 Run the Full Pipeline
```bash
python run_all.py --data data/AI_A1_MOB-G9-7573.csv --output artifacts/ --group MOB-G9-7573
```

### 4.2 Run Single Record Prediction
```bash
python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
```

### 4.3 Input Validation & Error Rejection Test
```bash
# Missing required field 'soil_ph':
python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"seed_kg":210,"distance_km":14,"arrival_hour":9}'

# Malformed negative area:
python predict.py --record '{"plot_area_ha":-5.0,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
```

---

## 5. Artifacts and Expected Outputs
- `artifacts/data_report.json`
- `artifacts/regression_metrics.json`
- `artifacts/regression_loss.png`
- `artifacts/classification_metrics.json`
- `artifacts/confusion_matrix.png`
- `artifacts/clustering_metrics.json`
- `artifacts/clusters.csv`
- `artifacts/cluster_plot.png`
- `models/regression_model.json`
- `models/classification_model.json`
- `models/clustering_model.json`
