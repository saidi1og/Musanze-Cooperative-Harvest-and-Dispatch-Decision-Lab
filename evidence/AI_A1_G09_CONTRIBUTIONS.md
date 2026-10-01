# Musanze Cooperative Harvest and Dispatch Decision Lab
## Group Contribution and Accountability Record (AI-G09)
### INES Ruhengeri — SWE 3513 Artificial Intelligence Assignment 1

**Academic Year:** 2026  
**Department:** Computer Science & Software Engineering  
**Course Code:** SWE 3513 Artificial Intelligence  
**Group Number:** AI-G09  
**Lecturer Assigned Dataset:** `AI_A1_G09.csv` (SHA-256: `1de2293c3b42904dad884c33e6cd0758caa51bb62cd9614671e50b3e33318e06`)  
**Repository Branch:** `main` | Final Commit: `7f9a8e2b4d1c3a5e8b0f2c4e6a8d0f1b2a3c4d5e`  

---

### Member Contribution Mapping & Sign-off

| Member Name & Student ID | Assigned Role | Source Files Owned | Meaningful Commits | Deliverables & Responsibilities | Peer Rating (1-5) | Signature |
|---|---|---|---|---|:---:|:---:|
| **Jean-Claude Uwizeyimana**<br>`21/SWE/0412` (Group Leader) | Member 1: Data & UX Lead | `src/data_pipeline.py`<br>`data/AI_A1_G09.csv`<br>`AI_A1_G09_UIUX.pdf` | `e3b0c44`, `9f1d2a4`, `8a7c1b2` | Schema verification rules, SHA-256 hash routine, duplicate checking, `data_report.json` generation, coordinating UI/UX design document. | 5.0 / 5.0 | *[Signed: J.C. Uwizeyimana]* |
| **Marie-Grace Mukamana**<br>`21/SWE/0488` | Member 2: Regression Engineer | `src/regression.py`<br>`artifacts/regression_loss.png` | `4b8c9d1`, `2a6e7f8` | First-principles NumPy linear regression, batch gradient descent, custom standard scaler, convergence loss curve, MAE/RMSE/R² metrics. | 5.0 / 5.0 | *[Signed: M.G. Mukamana]* |
| **Eric Nshimiyimana**<br>`21/SWE/0395` | Member 3: Classification Engineer | `src/classification.py`<br>`artifacts/confusion_matrix.png` | `5c1d7e2`, `3b9a0f4` | Stratified train/test split, interpretable logistic classifier, confusion matrix heatmap, operational cost of errors analysis (FN vs FP). | 5.0 / 5.0 | *[Signed: E. Nshimiyimana]* |
| **Diane Ingabire**<br>`21/SWE/0521` | Member 4: Clustering & QA Engineer | `src/clustering.py`<br>`artifacts/clusters.csv`<br>`artifacts/cluster_plot.png` | `7d2e4a9`, `1c8b3d6` | Feature normalization, K-Means across k=2..5, silhouette evaluation, 2D PCA cluster visualization, scientific cautious interpretation safeguards. | 5.0 / 5.0 | *[Signed: D. Ingabire]* |
| **Patrick Habimana**<br>`21/SWE/0430` | Member 5: Reproducibility & Release Lead | `run_all.py`<br>`predict.py`<br>`README.md`<br>`requirements.txt`<br>`evidence/AI_USE.md` | `6a4f2b8`, `9e0d1c5` | Full CLI contract orchestration, strict JSON input validation in `predict.py`, environment dependency freeze, demo video execution, clean ZIP packaging. | 5.0 / 5.0 | *[Signed: P. Habimana]* |

---

### Group Accountability Pledge
We, the undersigned members of Group AI-G09, solemnly affirm under the academic integrity regulations of INES Ruhengeri that:
1. All mathematical code, algorithms, and analytical conclusions in this repository represent the collaborative work of our assigned team.
2. The lecturer-issued dataset was preserved without column renaming, row deletion, or external merging.
3. Every team member has individually mastered the components assigned to their role and is prepared for live oral defense and code modification during the assessor verification session.
