/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ExecutiveOverview } from "./components/ExecutiveOverview";
import { DataPipelineView } from "./components/DataPipelineView";
import { RegressionView } from "./components/RegressionView";
import { ClassificationView } from "./components/ClassificationView";
import { ClusteringView } from "./components/ClusteringView";
import { PredictorConsole } from "./components/PredictorConsole";
import { UIUXDocumentView } from "./components/UIUXDocumentView";
import { AssessorChecklist } from "./components/AssessorChecklist";
import { PipelineModal } from "./components/PipelineModal";
import { ArtifactsResponse } from "./types";
import { initialArtifactsData } from "./mockData";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [artifacts, setArtifacts] = useState<ArtifactsResponse>(initialArtifactsData);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [pipelineOutput, setPipelineOutput] = useState<string>("");

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      const res = await fetch("/api/artifacts");
      if (res.ok) {
        const data = await res.json();
        if (data.data_report && data.regression_metrics) {
          setArtifacts({
            data_report: data.data_report,
            regression_metrics: data.regression_metrics,
            classification_metrics: data.classification_metrics,
            clustering_metrics: data.clustering_metrics,
            images: data.images || initialArtifactsData.images
          });
        }
      }
    } catch (err) {
      console.warn("Using bundled initial artifacts data", err);
    }
  };

  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    setIsModalOpen(true);
    setPipelineOutput("");

    try {
      const res = await fetch("/api/run-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group: "AI-G09", data: "data/AI_A1_G09.csv" })
      });
      const data = await res.json();
      setPipelineOutput(data.output || "Execution completed.");
      // Refresh artifacts after run
      await fetchArtifacts();
    } catch (err: any) {
      setPipelineOutput(`Execution error: ${err.message}`);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sha256={artifacts.data_report.sha256_fingerprint}
        onRunPipeline={handleRunPipeline}
        isRunningPipeline={isRunningPipeline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <ExecutiveOverview
            artifacts={artifacts}
            setActiveTab={setActiveTab}
            onRunPipeline={handleRunPipeline}
            isRunningPipeline={isRunningPipeline}
          />
        )}

        {activeTab === "data" && (
          <DataPipelineView dataReport={artifacts.data_report} />
        )}

        {activeTab === "regression" && (
          <RegressionView
            metrics={artifacts.regression_metrics}
            lossImageUrl={artifacts.images.regression_loss}
          />
        )}

        {activeTab === "classification" && (
          <ClassificationView
            metrics={artifacts.classification_metrics}
            cmImageUrl={artifacts.images.confusion_matrix}
          />
        )}

        {activeTab === "clustering" && (
          <ClusteringView
            metrics={artifacts.clustering_metrics}
            clusterImageUrl={artifacts.images.cluster_plot}
          />
        )}

        {activeTab === "predict" && <PredictorConsole />}

        {activeTab === "uiux" && <UIUXDocumentView />}

        {activeTab === "assessor" && (
          <AssessorChecklist
            onRunPipeline={handleRunPipeline}
            isRunning={isRunningPipeline}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Musanze HarvestLink Cooperative</span>
            <span>• Decision & Dispatch Lab</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">INES Ruhengeri SWE 3513 (Group AI-G09)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Commit: 7f9a8e2b</span>
            <span>SHA-256: {artifacts.data_report.sha256_fingerprint.slice(0, 12)}...</span>
            <a
              href="/api/download-zip"
              download="AI_A1_G09.zip"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              AI_A1_G09.zip
            </a>
          </div>
        </div>
      </footer>

      {/* Live Pipeline Execution Modal */}
      <PipelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isRunning={isRunningPipeline}
        output={pipelineOutput}
        onRunAgain={handleRunPipeline}
      />
    </div>
  );
}
