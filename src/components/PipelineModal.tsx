import React from "react";
import { X, Terminal, CheckCircle2, AlertTriangle, RefreshCw, Download } from "lucide-react";

interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRunning: boolean;
  output: string;
  onRunAgain: () => void;
}

export const PipelineModal: React.FC<PipelineModalProps> = ({
  isOpen,
  onClose,
  isRunning,
  output,
  onRunAgain
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Live Pipeline Execution: `python run_all.py`</h3>
              <p className="text-[11px] text-slate-400">
                INES SWE 3513 Decision Pipeline Runner • Group AI-G09
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Terminal Console */}
        <div className="p-5 flex-1 overflow-y-auto font-mono text-xs bg-slate-950 text-slate-200 space-y-3">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
              <div className="text-center">
                <span className="font-bold text-white text-sm">Executing Full Python Pipeline...</span>
                <p className="text-xs text-slate-400 mt-1">
                  Ingesting data → Training NumPy Gradient Descent (2,000 epochs) → Stratified Classifier → K-Means Clustering (k=2..5)
                </p>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap leading-relaxed text-emerald-400 font-mono text-[11px]">
              {output || "Pipeline executed successfully. All artifacts generated."}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-800 bg-slate-950 text-xs">
          <div className="flex items-center gap-2">
            {!isRunning && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Pipeline Ready
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRunAgain}
              disabled={isRunning}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition font-medium"
            >
              Run Again
            </button>
            <a
              href="/api/download-zip"
              download="AI_A1_G04.zip"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
