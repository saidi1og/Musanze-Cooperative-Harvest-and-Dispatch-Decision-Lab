import React, { useState } from "react";
import {
  Activity,
  Layers,
  TrendingUp,
  ShieldAlert,
  Play,
  Download,
  Copy,
  Check,
  FileText,
  Terminal,
  Database,
  CheckCircle2,
  Sliders
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sha256: string;
  onRunPipeline: () => void;
  isRunningPipeline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  sha256,
  onRunPipeline,
  isRunningPipeline
}) => {
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "data", label: "Dataset & Ingestion", icon: Database },
    { id: "regression", label: "1. Harvest Weight (NumPy)", icon: TrendingUp },
    { id: "classification", label: "2. Dispatch Flag (Clf)", icon: ShieldAlert },
    { id: "clustering", label: "3. Profiles (Clustering)", icon: Layers },
    { id: "predict", label: "predict.py Console", icon: Terminal },
    { id: "uiux", label: "UI/UX Spec (6-Pages)", icon: FileText },
    { id: "assessor", label: "Assessor Checklist", icon: CheckCircle2 }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top institution & project banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-medium border border-emerald-800">
            INES RUHENGERI
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="font-semibold text-slate-200">
            SWE 3513 Artificial Intelligence — Assignment 1
          </span>
          <span className="hidden md:inline text-slate-400">• Group Code:</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono font-bold">
            AI-G09
          </span>
        </div>

        {/* SHA-256 Fingerprint */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden lg:inline">Dataset SHA-256:</span>
          <button
            onClick={copyHash}
            title="Click to copy full SHA-256 fingerprint"
            className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded border border-slate-700 transition"
          >
            <span>{sha256.slice(0, 10)}...{sha256.slice(-8)}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Quick Actions */}
          <button
            onClick={onRunPipeline}
            disabled={isRunningPipeline}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-3 py-1 rounded text-xs transition shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningPipeline ? "animate-spin" : ""}`} />
            <span>{isRunningPipeline ? "Running..." : "Run Pipeline"}</span>
          </button>

          <a
            href="/api/download-zip"
            download="AI_A1_G09.zip"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1 rounded text-xs border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Download ZIP</span>
          </a>
        </div>
      </div>

      {/* Main branding & tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-2">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-emerald-400">Musanze HarvestLink Cooperative</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Decision Lab v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Reproducible machine learning decision pipeline: Yield Estimation, Dispatch Priority, & Operating Profiles
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none pb-2 pt-1 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
