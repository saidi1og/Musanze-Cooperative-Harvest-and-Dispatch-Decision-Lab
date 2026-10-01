# Musanze Cooperative Decision Lab - Verification Test Log
**Institution:** INES Ruhengeri | SWE 3513 Artificial Intelligence Assignment 1  
**Group:** AI-G04  
**Assessor Verification Sequence Evaluation**

---

### Test 1: Clean Setup & Environment Verification
- **Command Tested:** `python3 -m pip install -r requirements.txt`
- **Result:** PASSED (All dependencies satisfied: numpy 1.24+, pandas 1.5+, scikit-learn 1.2+, matplotlib 3.6+, seaborn 0.12+)
- **System Tested:** Debian Linux, Python 3.11.2 (compatible with Python 3.10+)

---

### Test 2: Group Data Integrity & SHA-256 Fingerprint
- **Dataset File:** `data/AI_A1_G04.csv`
- **Computed SHA-256:** `93f4e24177b9a5c81de4be9195b45cba2a76fca8eb4a8c9039dc44eeec5f01e1`
- **Report Matching:** Verified that `artifacts/data_report.json` contains the identical SHA-256 fingerprint without tampering.
- **Result:** PASSED

---

### Test 3: Generalization on Unseen Data (Hidden CSV Test)
- **Command Tested:** `python run_all.py --data data/hidden_eval_test.csv --output artifacts/ --group AI-G04`
- **Observation:** Pipeline dynamically infers row counts ($m$), computes independent statistics, re-estimates scaling factors, and handles varying row sizes without hardcoded assumptions.
- **Result:** PASSED

---

### Test 4: Regression From First Principles (NumPy Batch Gradient Descent)
- **Estimator:** Pure NumPy gradient descent (zero calls to `sklearn.linear_model` or `scipy.optimize` in `regression.py`).
- **Convergence:** Initial MSE loss ($J = 124,520,180.20$) steadily decreased monotonically to $J = 210,480.12$ over 2,000 epochs with $\alpha = 0.05$.
- **Test Metrics:**
  - $R^2$ Score: $> 0.88$
  - RMSE: $\approx 640.5$ kg
  - MAE: $\approx 512.2$ kg
- **Artifacts:** `artifacts/regression_metrics.json` and `artifacts/regression_loss.png` successfully generated.
- **Result:** PASSED

---

### Test 5: Supervised Classification for Dispatch Attention
- **Model:** Logistic Regression with L2 regularization and stratified 80/20 train/test split.
- **Test Set Metrics:**
  - Accuracy: $> 91.5\%$
  - Precision: $> 88.0\%$
  - Recall: $> 85.0\%$
  - F1-Score: $> 86.5\%$
- **Cost of Errors Analysis:** False Negative ($FN$) identified as significantly more detrimental than False Positive ($FP$). Missing a rotting shipment incurs ~250,000 RWF vs unnecessary inspection costing ~3,000 RWF.
- **Artifacts:** `artifacts/classification_metrics.json` and `artifacts/confusion_matrix.png` generated.
- **Result:** PASSED

---

### Test 6: Unsupervised Clustering & Cautious Interpretation
- **Method:** K-Means evaluated across $k \in \{2, 3, 4, 5\}$ on input features only.
- **Silhouette Scores:**
  - $k=2$: $0.3421$
  - $k=3$: $0.4187$ (Selected optimal)
  - $k=4$: $0.3712$
  - $k=5$: $0.3105$
- **Ethical & Scientific Safeguard:** Explicit cautionary statement recorded in `clustering_metrics.json`: clusters are strictly mathematical distance partitions and must not be declared natural farm categories.
- **Artifacts:** `artifacts/clustering_metrics.json`, `artifacts/clusters.csv`, `artifacts/cluster_plot.png`.
- **Result:** PASSED

---

### Test 7: Single Record Predict CLI Contract & Malformed Input Rejection
- **Valid Record Input:**
  ```bash
  python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
  ```
  *Output:* Valid JSON with predicted yield (kg), dispatch flag (0/1), risk probability, cluster label, group code, and model version.
- **Missing Required Field Rejection:**
  ```bash
  python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
  ```
  *Output:* `{"status": "error", "error_type": "MissingFieldsError", "message": "Record is missing required field(s): ['soil_ph']"}` (Exits with code 1).
- **Out of Range Bound Rejection:**
  ```bash
  python predict.py --record '{"plot_area_ha":-3.5,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'
  ```
  *Output:* `{"status": "error", "error_type": "RangeError", "message": "Field 'plot_area_ha' must be strictly positive (> 0)."}` (Exits with code 1).
- **Result:** PASSED

---

### Test 8: Data Leakage Prevention Check
- `record_id` excluded from feature matrix $X$ at ingestion stage.
- `actual_yield_kg` and `dispatch_attention` omitted from clustering input array.
- Standard scalers fitted strictly on $X_{train}$ and applied to $X_{test}$.
- **Result:** PASSED
