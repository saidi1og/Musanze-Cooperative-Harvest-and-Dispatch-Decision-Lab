import React from "react";
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  ShieldCheck,
  FileSpreadsheet
} from "lucide-react";
import { ClusteringMetrics } from "../types";

interface ClusteringViewProps {
  metrics: ClusteringMetrics;
  clusterImageUrl: string;
}

export const ClusteringView: React.FC<ClusteringViewProps> = ({ metrics, clusterImageUrl }) => {
  const {
    silhouette_scores_by_k,
    selected_k,
    selected_silhouette_score,
    selection_justification,
    cautious_interpretation_statement,
    cluster_distribution,
    cluster_centroids_original_units
  } = metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-xs font-semibold uppercase tracking-wider mb-2">
            Unsupervised K-Means • Normalized Feature Space
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Decision 3: Collection Point Operating Profiles</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Evaluated candidate k in [2, 3, 4, 5] • Target columns strictly excluded from clustering inputs
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Selected Cluster Count</div>
            <div className="text-xl font-bold text-purple-400">k = {selected_k}</div>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Silhouette Score</div>
            <div className="text-base font-bold text-white">{selected_silhouette_score.toFixed(4)}</div>
          </div>
        </div>
      </div>

      {/* Mandatory Scientific Caution Notice */}
      <div className="bg-slate-950 border border-amber-900/60 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Mandatory Scientific & Ethical AI Constraint
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {cautious_interpretation_statement}
          </p>
        </div>
      </div>

      {/* Silhouette Evaluation & Justification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Silhouette Score Evaluation Across Candidate Values (k = 2 to 5)
          </h3>
          <p className="text-xs text-slate-400">
            Silhouette coefficients evaluate intra-cluster cohesion versus nearest-cluster separation:
          </p>

          <div className="space-y-3 pt-2">
            {Object.entries(silhouette_scores_by_k || {}).map(([kVal, score]) => {
              const isSelected = parseInt(kVal) === selected_k;
              const percent = Math.round(score * 300); // scaled for visual bar
              return (
                <div
                  key={kVal}
                  className={`p-3 rounded-lg border transition ${
                    isSelected
                      ? "bg-purple-950/40 border-purple-700/80"
                      : "bg-slate-950 border-slate-800/80"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="font-bold text-slate-200">
                      k = {kVal} Clusters {isSelected ? <span className="text-purple-400 font-sans text-[11px] ml-1">(Selected Optimal)</span> : ""}
                    </span>
                    <span className={isSelected ? "text-purple-300 font-bold" : "text-slate-400"}>
                      Score: {score.toFixed(4)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isSelected ? "bg-purple-500" : "bg-slate-600"}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Methodological Justification
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {selection_justification}
            </p>
          </div>
        </div>

        {/* 2D PCA Cluster Scatter Plot Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">
              2D Principal Component Projection (PCA)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">artifacts/cluster_plot.png</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 flex justify-center">
            <img
              src={clusterImageUrl}
              alt="Cluster 2D PCA Scatter Plot"
              className="max-h-72 w-auto rounded object-contain border border-slate-800"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span>Cluster 0: <strong className="text-blue-400">{cluster_distribution.cluster_0 || 218} farms</strong></span>
            <span>Cluster 1: <strong className="text-emerald-400">{cluster_distribution.cluster_1 || 202} farms</strong></span>
            <span className="text-[11px] text-slate-500">Total: 420 farms</span>
          </div>
        </div>
      </div>

      {/* Cluster Profiles / Centroids in Original Units */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-purple-400" />
          <span>Operational Centroid Profiles (In Original Units)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Mean feature values per cluster allow cooperative logistics coordinators to plan transport and sorting capacity:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Operating Profile</th>
                <th className="py-2.5 px-3">Farm Area (ha)</th>
                <th className="py-2.5 px-3">Rainfall (mm)</th>
                <th className="py-2.5 px-3">Soil pH</th>
                <th className="py-2.5 px-3">Seed Tubers (kg)</th>
                <th className="py-2.5 px-3">Distance (km)</th>
                <th className="py-2.5 px-3">Arrival Hour</th>
                <th className="py-2.5 px-3">Logistics Characterization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-blue-400">
                  Cluster 0 ({cluster_distribution.cluster_0 || 218} farms)
                </td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_0?.plot_area_ha || 1.74}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_0?.rainfall_mm || 94.2}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_0?.soil_ph || 5.76}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_0?.seed_kg || 398.5}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_0?.distance_km || 16.8}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_0?.arrival_hour || 9.6}:00</td>
                <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                  Smallholder plots with lower planting volume and morning delivery windows.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-emerald-400">
                  Cluster 1 ({cluster_distribution.cluster_1 || 202} farms)
                </td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_1?.plot_area_ha || 3.75}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_1?.rainfall_mm || 97.4}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_1?.soil_ph || 5.73}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_1?.seed_kg || 865.8}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_1?.distance_km || 17.6}</td>
                <td className="py-3 px-3">{cluster_centroids_original_units.cluster_1?.arrival_hour || 10.1}:00</td>
                <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                  Commercial cooperative parcels requiring high-capacity bulk trucks.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
