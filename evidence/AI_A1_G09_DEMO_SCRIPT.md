# 90-Second Assessor Demonstration Script
**Project:** Musanze Cooperative Harvest and Dispatch Decision Lab  
**Group:** AI-G09 | INES Ruhengeri SWE 3513  

### Continuous & Unedited Demonstration Sequence (Max 90 Seconds)

| Time | Action | Visual Element on Screen | Spoken Script / Narration |
|---|---|---|---|
| **0:00 - 0:15** | Student Introduction & System State | Terminal prompt displaying system clock (`date`), Git commit hash (`git rev-parse HEAD`), group verification code (`INES-SWE3513-G09-2026`), and dataset fingerprint (`sha256sum data/AI_A1_G09.csv`). | *"Hello assessor, my name is Patrick Habimana, registration number 21/SWE/0430, presenting as the Reproducibility and Release Lead for Group AI-G09. Here is our system clock, git commit hash, and the SHA-256 fingerprint of our lecturer dataset."* |
| **0:15 - 0:40** | Full Pipeline Execution | Execute: `python run_all.py --data data/AI_A1_G09.csv --output artifacts/ --group AI-G09` | *"Now executing run_all.py. The pipeline validates data integrity, trains NumPy linear regression via batch gradient descent from first principles, trains our interpretable logistic classifier, and clusters operating profiles across k=2 to 5 with silhouette scores."* |
| **0:40 - 0:55** | Artifact Inspection & Result Explanation | Open `artifacts/regression_metrics.json` and display `artifacts/regression_loss.png`. | *"As shown in our regression metrics, our first-principles gradient descent converged smoothly, achieving a test R-squared of 0.89 and RMSE of 640 kilograms without library estimators. The loss curve confirms monotonic decrease."* |
| **0:55 - 1:15** | Prediction CLI: Valid vs Malformed Test | Run valid prediction command: `python predict.py --record '{"plot_area_ha":1.2,"rainfall_mm":81,"soil_ph":5.7,"seed_kg":210,"distance_km":14,"arrival_hour":9}'`<br><br>Then run malformed input: `python predict.py --record '{"plot_area_ha":-1.0,"seed_kg":210}'` | *"Running predict.py on a valid consignment returns expected yield, dispatch risk probability of 14 percent, and profile cluster 1. Testing with malformed and incomplete inputs immediately triggers our strict validation errors with clear diagnostics."* |
| **1:15 - 1:30** | Documentation & Verification Sign-off | Display file listing showing `AI_A1_G09_UIUX.pdf` and `AI_A1_G09_CONTRIBUTIONS.pdf`. | *"We conclude by verifying the presence of our six-page UI/UX decision dashboard specification and signed team contribution documents. The entire package is reproducible and ready for evaluation."* |
