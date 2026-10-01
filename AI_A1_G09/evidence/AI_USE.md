# AI Use Disclosure Statement

**Institution:** Institut d'Enseignement Supérieur de Ruhengeri (INES-Ruhengeri)  
**Course:** SWE 3513 Artificial Intelligence — Assignment 1  
**Group:** AI-G04  
**Date:** September 2026  
**Project:** Musanze Cooperative Harvest and Dispatch Decision Lab  

---

## 1. Compliance Statement
In accordance with INES Ruhengeri academic integrity guidelines and SWE 3513 regulations, generative AI was utilized solely as an assistive engineering and scaffolding tool for code structure, boilerplate generation, and derivation checks. All theoretical mathematical formulations (NumPy gradient descent updates, silhouette calculations, cost matrix modeling) were derived, validated, and verified by the assigned group members.

---

## 2. Disclosure Table

| Tool Name | Version / Model | Purpose of Use | Prompts / Requests | Affected Files | Verification & Testing Method |
|---|---|---|---|---|---|
| **Google AI Studio / Gemini** | Gemini 2.5 Flash / Pro | Scaffolding project architecture and standard CLI argument parsing | *"Generate standard CLI argument parser and project skeleton for reproducible ML pipeline adhering to SWE 3513 schema"* | `run_all.py`, `predict.py` | Executed CLI tests with varied flags; verified exit codes and JSON format. |
| **NumPy Matrix Derivation Assistant** | Gemini 2.5 Pro | Verification of vectorized loss gradient formulation for batch gradient descent | *"Verify batch gradient descent partial derivative formulation for vectorized linear regression with bias"* | `src/regression.py` | Derived manual step-by-step calculus on paper; verified that loss monotonically decreases over 2,000 epochs. |
| **Scikit-Learn Doc Assistant** | Gemini 2.5 Flash | Syntax check for StratifiedKFold and ConfusionMatrixDisplay parameters | *"Check syntax for Stratified train-test split with random_state and seaborn annotated heatmap"* | `src/classification.py` | Verified train/test class proportions matched original 72:28 ratio; verified confusion matrix counts sum to test set size. |
| **Matplotlib Formatting Helper** | Gemini 2.5 Flash | Matplotlib styling for high-DPI export without GUI backend | *"Provide headless Agg backend configuration for matplotlib figure saving in Docker/Linux"* | `src/regression.py`, `src/clustering.py` | Tested headless image rendering; verified PNG files exist with >100 DPI resolution. |
| **JSON Schema Validator Generator** | Gemini 2.5 Flash | Generation of unit test payload cases for valid and malformed JSON records | *"Generate sample JSON records: valid, missing soil_ph, out-of-bounds arrival_hour, negative plot area"* | `predict.py`, `evidence/TEST_LOG.md` | Executed `predict.py` against all test payloads to verify strict validation rejection. |

---

## 3. Human Authorship & Member Verification
Each team member independently inspected, tested, and understood the code modules corresponding to their role:
- **Member 1 (Data & UX Lead):** Hand-verified SHA-256 fingerprint routine against Linux `sha256sum`.
- **Member 2 (Regression Engineer):** Validated that no library estimators (`scipy.optimize` or `sklearn.LinearRegression`) were imported in `src/regression.py`.
- **Member 3 (Classification Engineer):** Verified confusion matrix calculations and formalized the operational error cost rationale.
- **Member 4 (Clustering & QA Engineer):** Verified silhouette score calculation across k=2..5 and confirmed target exclusion.
- **Member 5 (Reproducibility Lead):** Ran clean-environment setup on Python 3.10 and generated the final release verification checksums.
