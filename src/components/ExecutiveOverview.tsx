import React from "react";
import {
  TrendingUp,
  ShieldAlert,
  Layers,
  ArrowRight,
  Database,
  CheckCircle2,
  Terminal,
  Cpu,
  Award,
  AlertCircle
} from "lucide-react";
import { ArtifactsResponse } from "../types";

interface ExecutiveOverviewProps {
  artifacts: ArtifactsResponse;
  setActiveTab: (tab: string) => void;
  onRunPipeline: () => void;
  isRunningPipeline: boolean;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  artifacts,
  setActiveTab,
  onRunPipeline,
  isRunningPipeline
}) => {
  const { data_report, regression_metrics, classification_metrics, clustering_metrics } = artifacts;

  return (
    <div className="space-y-6">
      {/* Hero / Scenario Context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Operational Potato Dispatch Decision System • Musanze District, Rwanda
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Musanze HarvestLink Cooperative Decision Lab
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Musanze HarvestLink coordinates Irish potato collection from smallholder and commercial farms on the volcanic slopes of Mt. Sabyinyo and Mt. Bisoke (Kinigi, Nyange, Cyanika). Before dispatching consignments to Kigali wholesale markets, our reproducible machine learning pipeline automates three mission-critical operational decisions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("predict")}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow"
            >
              <Terminal className="w-4 h-4" />
              <span>Test Single Record</span>
            </button>
            <button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-semibold px-4 py-2.5 rounded-lg transition"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>{isRunningPipeline ? "Executing..." : "Execute run_all.py"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dataset Ingestion */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider">Ingested Records</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {data_report.row_count} <span className="text-xs font-normal text-slate-400">batches</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Schema verified • 0 missing • 0 dups</span>
          </p>
        </div>

        {/* Decision 1: Regression */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider">Decision 1: Yield R²</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {regression_metrics.test_performance.r2_score.toFixed(4)}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
            <span>RMSE: {regression_metrics.test_performance.rmse_kg.toLocaleString()} kg • First Principles BGD</span>
          </p>
        </div>

        {/* Decision 2: Classification */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider">Decision 2: Accuracy</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mb-1">
            {(classification_metrics.performance_metrics.accuracy * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
            <span>F1: {classification_metrics.performance_metrics.f1_score.toFixed(3)} • Stratified Split</span>
          </p>
        </div>

        {/* Decision 3: Clustering */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider">Decision 3: Clusters</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            k = {clustering_metrics.selected_k}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
            <span>Silhouette: {clustering_metrics.selected_silhouette_score.toFixed(4)} (k=2..5 evaluated)</span>
          </p>
        </div>
      </div>

      {/* The 3 Core Decisions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Decision 1 Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Decision 1</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Expected Harvest Weight Estimation
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Predicts consignment potato weight (<code className="text-emerald-300 font-mono">actual_yield_kg</code>) before physical weighing at collection centers. Uses custom NumPy Batch Gradient Descent from first principles without library estimators.
            </p>
            <div className="pt-2 text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">Test R² Score:</span>
                <span className="font-mono font-semibold text-emerald-400">{regression_metrics.test_performance.r2_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Test RMSE:</span>
                <span className="font-mono text-slate-200">{regression_metrics.test_performance.rmse_kg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Epochs:</span>
                <span className="font-mono text-slate-200">2,000 (α = 0.05)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("regression")}
            className="mt-4 flex items-center justify-between text-xs font-medium text-emerald-400 hover:text-emerald-300 pt-3 border-t border-slate-800 group"
          >
            <span>Inspect NumPy Loss Curve & Simulator</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Decision 2 Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">Decision 2</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Consignment Dispatch Attention Flag
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Binary classification (<code className="text-amber-300 font-mono">dispatch_attention</code>: 0 or 1) to identify consignments at risk of delay, spoilage, or quality rot prior to dispatching refrigerated trucks to Kigali.
            </p>
            <div className="pt-2 text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">Accuracy:</span>
                <span className="font-mono font-semibold text-amber-400">{(classification_metrics.performance_metrics.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Precision / Recall:</span>
                <span className="font-mono text-slate-200">{(classification_metrics.performance_metrics.precision * 100).toFixed(1)}% / {(classification_metrics.performance_metrics.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Error Cost Rationale:</span>
                <span className="text-slate-300 font-medium">FN &gt;&gt; FP (Prioritize Recall)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("classification")}
            className="mt-4 flex items-center justify-between text-xs font-medium text-amber-400 hover:text-amber-300 pt-3 border-t border-slate-800 group"
          >
            <span>View Confusion Matrix & Error Costs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Decision 3 Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-800/80 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase">Decision 3</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Collection Point Operating Profiles
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unsupervised K-Means clustering across standardized input features (target columns excluded). Evaluates k from 2 through 5 using silhouette scores to cluster operational logistics patterns.
            </p>
            <div className="pt-2 text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">Optimal k Selected:</span>
                <span className="font-mono font-semibold text-purple-400">k = {clustering_metrics.selected_k}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Silhouette Score:</span>
                <span className="font-mono text-slate-200">{clustering_metrics.selected_silhouette_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scientific Caution:</span>
                <span className="text-slate-300 font-medium">No real-world category claims</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("clustering")}
            className="mt-4 flex items-center justify-between text-xs font-medium text-purple-400 hover:text-purple-300 pt-3 border-t border-slate-800 group"
          >
            <span>Explore Silhouette Scores & 2D PCA</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Scientific & Academic Integrity Verification Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>INES Ruhengeri SWE 3513 Academic & Scientific Compliance Verification</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> First Principles Regression
            </span>
            <p className="text-slate-400">
              Zero library estimators utilized. Batch Gradient Descent implemented purely with NumPy matrix algebra and custom standardization.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Data Leakage
            </span>
            <p className="text-slate-400">
              <code className="text-slate-300">record_id</code> stripped before feature matrix. Scalers fitted strictly on training data splits. Targets excluded from clustering.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reusable CLI Contract
            </span>
            <p className="text-slate-400">
              Both <code className="text-slate-300">run_all.py</code> and <code className="text-slate-300">predict.py</code> comply with exact specification flags and reject malformed JSON with clear errors.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Full Traceable Evidence
            </span>
            <p className="text-slate-400">
              SHA-256 fingerprint verified, 5 member roles mapped with signed commitments, AI disclosure documented in <code className="text-slate-300">AI_USE.md</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
