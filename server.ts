import express from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Static serving for artifacts (PNG charts, CSVs, JSONs)
  app.use("/artifacts", express.static(path.join(__dirname, "artifacts")));
  app.use("/AI_A1_G04/artifacts", express.static(path.join(__dirname, "AI_A1_G04", "artifacts")));

  // API Route: Get Pipeline Status and System Check
  app.get("/api/status", (req, res) => {
    const hasData = fs.existsSync(path.join(__dirname, "data", "AI_A1_G09.csv")) ||
                    fs.existsSync(path.join(__dirname, "data", "AI_A1_G04.csv"));
    const hasZip = fs.existsSync(path.join(__dirname, "AI_A1_G09.zip")) ||
                   fs.existsSync(path.join(__dirname, "AI_A1_G04.zip"));
    const hasReport = fs.existsSync(path.join(__dirname, "artifacts", "data_report.json"));
    const hasRegMetrics = fs.existsSync(path.join(__dirname, "artifacts", "regression_metrics.json"));
    const hasClfMetrics = fs.existsSync(path.join(__dirname, "artifacts", "classification_metrics.json"));
    const hasClustMetrics = fs.existsSync(path.join(__dirname, "artifacts", "clustering_metrics.json"));

    res.json({
      status: "ready",
      group_code: "AI-G09",
      academic_course: "SWE 3513 Artificial Intelligence - Assignment 1",
      institution: "INES Ruhengeri",
      dataset_ready: hasData,
      artifacts_generated: hasReport && hasRegMetrics && hasClfMetrics && hasClustMetrics,
      zip_ready: hasZip,
    });
  });

  // API Route: Get all generated metrics
  app.get("/api/artifacts", (req, res) => {
    try {
      const readJsonSafe = (filePath: string) => {
        if (fs.existsSync(filePath)) {
          return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
        return null;
      };

      const dataReport = readJsonSafe(path.join(__dirname, "artifacts", "data_report.json"));
      const regMetrics = readJsonSafe(path.join(__dirname, "artifacts", "regression_metrics.json"));
      const clfMetrics = readJsonSafe(path.join(__dirname, "artifacts", "classification_metrics.json"));
      const clustMetrics = readJsonSafe(path.join(__dirname, "artifacts", "clustering_metrics.json"));

      res.json({
        data_report: dataReport,
        regression_metrics: regMetrics,
        classification_metrics: clfMetrics,
        clustering_metrics: clustMetrics,
        images: {
          regression_loss: "/artifacts/regression_loss.png",
          confusion_matrix: "/artifacts/confusion_matrix.png",
          cluster_plot: "/artifacts/cluster_plot.png"
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Get sample of dataset records
  app.get("/api/dataset", (req, res) => {
    try {
      let csvPath = path.join(__dirname, "data", "AI_A1_G09.csv");
      if (!fs.existsSync(csvPath)) {
        csvPath = path.join(__dirname, "data", "AI_A1_G04.csv");
      }
      if (!fs.existsSync(csvPath)) {
        return res.status(404).json({ error: "Dataset file not found" });
      }
      const raw = fs.readFileSync(csvPath, "utf-8").trim().split("\n");
      const headers = raw[0].split(",");
      const limit = parseInt(req.query.limit as string) || 100;
      
      const records = raw.slice(1, limit + 1).map((line) => {
        const values = line.split(",");
        const obj: Record<string, any> = {};
        headers.forEach((h, idx) => {
          const val = values[idx];
          obj[h] = isNaN(Number(val)) ? val : Number(val);
        });
        return obj;
      });

      res.json({
        total_rows: raw.length - 1,
        headers,
        sample: records
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Trigger live Python pipeline run
  app.post("/api/run-pipeline", (req, res) => {
    const group = req.body.group || "AI-G09";
    let dataFile = req.body.data || "data/AI_A1_G09.csv";
    if (!fs.existsSync(path.join(__dirname, dataFile))) {
      dataFile = "data/AI_A1_G04.csv";
    }
    const cmd = `python3 run_all.py --data ${dataFile} --output artifacts/ --group ${group}`;

    exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
      // Re-package zip after run
      exec("python3 package_submission.py", { cwd: __dirname });

      if (error) {
        return res.status(500).json({
          success: false,
          output: stdout + "\n" + stderr,
          error: error.message
        });
      }
      res.json({
        success: true,
        output: stdout,
        group_code: group
      });
    });
  });

  // API Route: Run Single Record Prediction
  app.post("/api/predict", (req, res) => {
    const recordPayload = JSON.stringify(req.body.record || req.body);
    // Escaped string for bash
    const escapedPayload = recordPayload.replace(/'/g, "'\\''");
    const cmd = `python3 predict.py --record '${escapedPayload}'`;

    exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
      try {
        const parsed = JSON.parse(stdout || stderr);
        if (error && parsed.status === "error") {
          return res.status(400).json(parsed);
        }
        return res.json(parsed);
      } catch (parseErr) {
        if (error) {
          return res.status(400).json({
            status: "error",
            error_type: "ExecutionError",
            message: stderr || stdout || error.message
          });
        }
        res.json({ raw_output: stdout });
      }
    });
  });

  // API Route: Download submission ZIP
  app.get("/api/download-zip", (req, res) => {
    let zipPath = path.join(__dirname, "AI_A1_G09.zip");
    let zipName = "AI_A1_G09.zip";
    if (!fs.existsSync(zipPath)) {
      zipPath = path.join(__dirname, "AI_A1_G04.zip");
      zipName = "AI_A1_G04.zip";
    }
    if (!fs.existsSync(zipPath)) {
      return res.status(404).send("ZIP file not found. Run pipeline first.");
    }
    res.download(zipPath, zipName);
  });

  // Setup Vite dev server middleware in development
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Serve dist in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Musanze Decision Lab Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
