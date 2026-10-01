import React, { useState } from "react";
import {
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Eye,
  Sliders,
  Sparkles
} from "lucide-react";

export const UIUXDocumentView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 6;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            INES SWE 3513 Deliverable • Document AI_A1_G09_UIUX.pdf
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Staff Decision Dashboard UI/UX Specification (Pages 1 to 6)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete design specification for non-technical cooperative dispatch officers in Musanze, Rwanda.
          </p>
        </div>

        {/* Page Switcher & Print */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-medium text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Document Canvas (A4 / Page Look) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto min-h-[750px] text-slate-200 print:bg-white print:text-black print:p-0 print:border-none">
        {/* PAGE 1: Cover & Operational Problem */}
        {currentPage === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-800 pb-6 text-center space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                INSTITUT D'ENSEIGNEMENT SUPÉRIEUR DE RUHENGERI (INES)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Musanze HarvestLink Cooperative
              </h1>
              <h2 className="text-base font-semibold text-slate-400">
                Staff Decision Dashboard: UI/UX Architecture & Human-AI Decision Workflow
              </h2>
              <div className="pt-2 flex justify-center gap-3 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Group Code: AI-G09</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Doc Ref: AI_A1_G09_UIUX.pdf</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Version 1.0</span>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Group AI-G09 Authors & Roles:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>• NSHIMIYIMANA Saidi (25/27573) — <em>Data & UX Lead (Group Leader)</em></div>
                <div>• KANYANGE Kellen (25/27821) — <em>Regression Engineer</em></div>
                <div>• MUGABO Alvin Marvin (24/26657) — <em>Classification Engineer</em></div>
                <div>• HAMID ABAAS HAMID (25/27817) — <em>Clustering & QA Engineer</em></div>
                <div className="sm:col-span-2">• TUYISINGIZE Devotha (25/27747) — <em>Reproducibility & Release Lead</em></div>
              </div>
            </div>

            {/* Operational Problem Statement */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>The Operational Problem in Musanze District</span>
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Musanze HarvestLink Cooperative represents over 400 potato farming families across Kinigi, Nyange, and Cyanika sectors on the volcanic slopes of Northern Rwanda. Potatoes are highly perishable once harvested. Dispatch officers face high pressure: coordinating fleet trucks to transport bulk loads to wholesale markets in Kigali (Nyabugogo and Kimironko) before spoilage occurs.
              </p>
              <p className="text-xs leading-relaxed text-slate-300">
                Without predictive support, dispatch officers suffer from three critical bottlenecks:
              </p>
            </div>

            {/* The 3 Core Decisions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold text-xs uppercase font-mono">Decision 1</span>
                <h4 className="text-sm font-bold text-white">Harvest Weight Estimation</h4>
                <p className="text-[11px] text-slate-400">
                  Estimates consignment kilograms before weighbridge arrival to allocate appropriate truck tonnage (3.5T vs 10T trucks).
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold text-xs uppercase font-mono">Decision 2</span>
                <h4 className="text-sm font-bold text-white">Dispatch Attention Flag</h4>
                <p className="text-[11px] text-slate-400">
                  Flags vulnerable or high-risk consignments for priority depot inspection to prevent loading spoiled tubers onto long-distance trucks.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold text-xs uppercase font-mono">Decision 3</span>
                <h4 className="text-sm font-bold text-white">Operating Profiles</h4>
                <p className="text-[11px] text-slate-400">
                  Groups collection points into operating profiles for route clustering and scheduling driver collection batches efficiently.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: User Journey & Information Flow */}
        {currentPage === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase">Page 2 of 6</span>
              <h2 className="text-xl font-bold text-white">User Journey & End-to-End Information Flow</h2>
              <p className="text-xs text-slate-400">How cooperative dispatch staff interact with data from field collection to human dispatch decision</p>
            </div>

            {/* Journey Steps */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 border border-emerald-800">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Stage 1: Field Data Ingestion & Automated Validation</h4>
                  <p className="text-xs text-slate-300">
                    Extension officers in Kinigi and Cyanika submit morning harvest forms via CSV upload or field tablets. The system validates required schema, computes SHA-256 fingerprint, checks range limits (e.g. soil pH 4.8–6.8), and isolates <code className="text-slate-200">record_id</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-950 text-blue-400 font-mono font-bold flex items-center justify-center shrink-0 border border-blue-800">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Stage 2: Model Inference Execution</h4>
                  <p className="text-xs text-slate-300">
                    The backend processes input vectors through the 3 models in parallel:
                  </p>
                  <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                    <li>NumPy Linear Regression calculates predicted harvest yield (kg) and expected error band.</li>
                    <li>Logistic Classifier estimates dispatch attention risk probability and flags status (0 vs 1).</li>
                    <li>K-Means model assigns the farm to an operating cluster profile for transport batching.</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-amber-950 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-800">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Stage 3: Dashboard Review & Triage</h4>
                  <p className="text-xs text-slate-300">
                    Cooperative dispatch supervisor views the daily summary board. High-risk consignments (Attention = 1) glow in high-contrast amber with root causes highlighted (e.g., "Late arrival 17:00 combined with 140mm rainfall").
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 border border-emerald-800">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Stage 4: Informed Human Decision & Action</h4>
                  <p className="text-xs text-slate-300">
                    The human officer chooses one of three actions: (A) Approve standard dispatch to Kigali; (B) Route lot to depot staging bay for 5-minute moisture/temperature audit; (C) Human Override to alter truck priority based on field agronomist call.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGES 3 to 4: Annotated Wireframes */}
        {(currentPage === 3 || currentPage === 4) && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase">Page {currentPage} of 6</span>
              <h2 className="text-xl font-bold text-white">
                {currentPage === 3 ? "Annotated Wireframe: Ingestion & Yield Estimation Screen" : "Annotated Wireframe: Attention Warnings & Cluster Profiles"}
              </h2>
              <p className="text-xs text-slate-400">
                Interface wireframe showing non-technical layout, annotations, and visual hierarchy
              </p>
            </div>

            {/* Wireframe Mockup UI */}
            <div className="bg-slate-900 rounded-xl border-2 border-dashed border-slate-700 p-5 space-y-4 font-sans">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-bold text-slate-200">HARVESTLINK MUSANZE — DISPATCH CONSOLE [WIREFRAME]</span>
                <span className="font-mono text-emerald-400">● LIVE PIPELINE READY</span>
              </div>

              {currentPage === 3 ? (
                /* Screen 1 Wireframe */
                <div className="space-y-4">
                  {/* Annotation 1 */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-emerald-700/60 relative">
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                      [Annotation A: Data Quality Header]
                    </span>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <div>
                        <span className="font-bold text-white">Batch: Kinigi Sector 29-Sept</span>
                        <div className="text-[11px] text-slate-400">SHA-256: 1de2293c... • 420 Records Verified</div>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                        ✓ 0 MISSING • 0 DUPLICATES
                      </span>
                    </div>
                  </div>

                  {/* Annotation 2: Yield Prediction Card */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-950 rounded-lg border border-blue-700/60 relative">
                      <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-[10px] font-bold border border-blue-800">
                        [Annotation B: Yield Estimation]
                      </span>
                      <div className="pt-2 text-xs space-y-1">
                        <span className="text-slate-400 text-[10px]">Predicted Consignment Weight</span>
                        <div className="text-lg font-bold text-white font-mono">18,450 kg ± 510 kg</div>
                        <div className="text-[10px] text-emerald-400">Recommended Fleet: 1x 20T Bulk Truck</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-purple-700/60 relative">
                      <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-purple-950 text-purple-400 text-[10px] font-bold border border-purple-800">
                        [Annotation C: Model Confidence]
                      </span>
                      <div className="pt-2 text-xs space-y-1">
                        <span className="text-slate-400 text-[10px]">Statistical Reliability</span>
                        <div className="text-base font-bold text-purple-300 font-mono">R² = 0.923 (High)</div>
                        <div className="text-[10px] text-slate-400">RMSE: 5,159 kg (Based on 2,000 epoch BGD)</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Screen 2 Wireframe */
                <div className="space-y-4">
                  {/* Annotation D: Dispatch Attention Card */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-amber-700/60 relative space-y-2">
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold border border-amber-800">
                      [Annotation D: Dispatch Attention Card]
                    </span>
                    <div className="flex justify-between items-start pt-1 text-xs">
                      <div>
                        <span className="font-bold text-amber-400">LOT #MCOOP-2026-0042: ATTENTION REQUIRED</span>
                        <p className="text-[11px] text-slate-300">
                          Risk Probability: <strong>78.4%</strong> • Primary Drivers: Arrival at 17:00 + High Rainfall (142mm)
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                        PRIORITY INSPECTION
                      </span>
                    </div>
                  </div>

                  {/* Annotation E: Cluster Operating Profile */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-700 relative space-y-2">
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                      [Annotation E: Cluster Operating Profile]
                    </span>
                    <div className="pt-1 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">Cluster 1: Commercial Hillside Sector</span>
                        <div className="text-[11px] text-slate-400">Avg Area: 3.75 ha • Seed: 865 kg • Distance: 17.6 km</div>
                      </div>
                      <span className="text-[10px] font-mono text-purple-400">k=2 Profile</span>
                    </div>
                  </div>

                  {/* Annotation F: Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 text-xs">
                    <button className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">
                      Log Human Note
                    </button>
                    <button className="px-3 py-1.5 rounded bg-amber-600 text-white font-bold hover:bg-amber-500">
                      Dispatch to Bay B (Inspect)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAGE 5: Responsible AI States */}
        {currentPage === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase">Page 5 of 6</span>
              <h2 className="text-xl font-bold text-white">Responsible AI States & Human Override Architecture</h2>
              <p className="text-xs text-slate-400">Managing uncertainty, missing sensor data, model boundaries, and managerial oversight</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Uncertainty Display */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> 1. Transparent Uncertainty
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Yield predictions are never presented as single deterministic numbers. The UI displays an explicit <strong>prediction interval</strong> (± RMSE) so dispatch officers avoid over-committing truck capacity when inputs lie near extreme boundary conditions.
                </p>
              </div>

              {/* Missing Data Fallback */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 2. Missing & Corrupted Data Shield
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If an agronomic sensor fails (e.g., rainfall gauge offline), <code className="text-slate-200">predict.py</code> immediately rejects the record with explicit JSON field diagnostics rather than silently guessing or corrupting downstream calculations.
                </p>
              </div>

              {/* Model Boundaries & Drift */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> 3. Model Scope Limitations
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The dashboard displays cautionary badges stating that models are trained specifically on volcanic soil conditions in Musanze. Predictions for atypical highland areas or foreign seed cultivars are flagged with an "Out-of-Distribution" advisory.
                </p>
              </div>

              {/* Human Override */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> 4. Mandatory Human Override Authority
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The AI is strictly assistive. Dispatch supervisors can override any AI recommendation with a mandatory 1-sentence operational justification. All overrides are logged for retraining audits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 6: Visual System & Accessible Design Rationale */}
        {currentPage === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase">Page 6 of 6</span>
              <h2 className="text-xl font-bold text-white">Visual System Rationale & Three Justified Decisions</h2>
              <p className="text-xs text-slate-400">Accessible design system ensuring high usability under bright outdoor warehouse lighting</p>
            </div>

            {/* Accessible Color Palette */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">High-Contrast Accessible Color System (WCAG AA Compliant)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
                  <div className="font-bold">Emerald Green</div>
                  <div className="text-[10px] text-slate-400 mt-1">#10b981 • Standard Dispatch / Healthy lot</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-950 border border-amber-800 text-amber-400">
                  <div className="font-bold">Amber Warning</div>
                  <div className="text-[10px] text-slate-400 mt-1">#f59e0b • Dispatch Attention Required</div>
                </div>
                <div className="p-3 rounded-lg bg-red-950 border border-red-800 text-red-400">
                  <div className="font-bold">Crimson Alert</div>
                  <div className="text-[10px] text-slate-400 mt-1">#ef4444 • Corrupted Data / Critical Failure</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-950 border border-blue-800 text-blue-400">
                  <div className="font-bold">Cobalt Blue</div>
                  <div className="text-[10px] text-slate-400 mt-1">#3b82f6 • Informational / Identifiers</div>
                </div>
              </div>
            </div>

            {/* Three Justified Decisions */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white">Three Methodologically Justified UI/UX Decisions</h3>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-white text-sm">
                    Justified Decision 1: Redundant Dual-Encoding (Color + Text Labels)
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    To protect colorblind dispatch workers and officers operating tablets under glare, risk states never rely solely on color. "ATTENTION REQUIRED" badges feature both an amber background and a bold text banner plus warning triangle icon.
                  </p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-white text-sm">
                    Justified Decision 2: Clear Explanation of Error Costs Over Raw Accuracy
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Rather than presenting raw statistical metrics alone, the interface visually explains why the model is tuned to avoid False Negatives (protecting the cooperative against 250,000 RWF transit spoilage losses).
                  </p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-white text-sm">
                    Justified Decision 3: Prominent Scientific Caution on Cluster Outputs
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    In compliance with the INES marking rubric, cluster labels are explicitly styled as "Exploratory Logistics Profiles" with a permanent notice prohibiting staff from treating them as natural soil classifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Page Numbering */}
        <div className="border-t border-slate-800/80 pt-4 mt-8 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>INES Ruhengeri • SWE 3513 AI</span>
          <span>Document: AI_A1_G09_UIUX.pdf — Page {currentPage} of {totalPages}</span>
        </div>
      </div>
    </div>
  );
};
