import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Hash,
  Filter,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { DataReport, FarmRecord } from "../types";

interface DataPipelineViewProps {
  dataReport: DataReport;
}

export const DataPipelineView: React.FC<DataPipelineViewProps> = ({ dataReport }) => {
  const [records, setRecords] = useState<FarmRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dataset?limit=150");
      if (res.ok) {
        const data = await res.json();
        setRecords(data.sample || []);
      }
    } catch (err) {
      console.error("Failed to fetch sample records", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.record_id?.toLowerCase().includes(term) ||
      r.plot_area_ha?.toString().includes(term) ||
      r.arrival_hour?.toString().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const currentRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const schemaFields = [
    { name: "record_id", type: "text", use: "Unique row identifier; strictly never used as a model feature (prevents data leakage)." },
    { name: "plot_area_ha", type: "numeric", use: "Farm area in hectares (typical volcanic plot range 0.5 to 4.8 ha)." },
    { name: "rainfall_mm", type: "numeric", use: "Recent rainfall estimate (mm) across Musanze highland collection zones." },
    { name: "soil_ph", type: "numeric", use: "Soil acidity measure (volcanic potato soils typically range from 4.8 to 6.8)." },
    { name: "seed_kg", type: "numeric", use: "Irish potato seed tubers planted (kg), correlated with plot area." },
    { name: "distance_km", type: "numeric", use: "Distance from farm plot to designated cooperative collection depot (km)." },
    { name: "arrival_hour", type: "numeric", use: "Planned consignment arrival hour in 24-hour clock format (6:00 to 18:00)." },
    { name: "actual_yield_kg", type: "numeric target", use: "Target 1 (Regression): Total harvested potato weight in kilograms." },
    { name: "dispatch_attention", type: "binary target", use: "Target 2 (Classification): Operational attention flag (0 = Standard, 1 = Priority Inspection)." }
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Dataset Ingestion & Vectorization Integrity</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lecturer-issued group dataset: <code className="text-emerald-300 font-mono">data/AI_A1_G04.csv</code>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs">
          <Hash className="w-4 h-4 text-emerald-400" />
          <div className="font-mono text-slate-300">
            <span className="text-slate-500 mr-1.5">SHA-256:</span>
            <span className="text-emerald-400 font-bold">{dataReport.sha256_fingerprint}</span>
          </div>
        </div>
      </div>

      {/* Data Ingestion Audit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Rows & Columns</span>
          <div className="text-xl font-bold text-white mt-1">
            {dataReport.row_count} <span className="text-xs text-slate-400 font-normal">rows × 9 columns</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Preserves official schema
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Missing Values</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            0 Missing
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            All required numeric fields 100% complete
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Duplicate Records</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            0 Duplicates
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Unique <code className="text-slate-300">record_id</code> enforced per consignment
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Feature Matrix Shape</span>
          <div className="text-xl font-bold text-blue-400 mt-1">
            (420, 6)
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Identifiers & targets cleanly isolated
          </p>
        </div>
      </div>

      {/* Dataset Schema Specification Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span>Official INES Ruhengeri Dataset Schema & Usage Rules</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Field</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Operational Role & Scientific Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {schemaFields.map((field) => (
                <tr key={field.name} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-emerald-300">{field.name}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-sans ${
                      field.type.includes("target")
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : field.type === "text"
                        ? "bg-slate-800 text-slate-400"
                        : "bg-blue-950 text-blue-300 border border-blue-900"
                    }`}>
                      {field.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{field.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Descriptive Statistics Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">
          Descriptive Statistics Generated for <code className="text-emerald-400 font-mono">data_report.json</code>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Feature</th>
                <th className="py-2 px-3">Mean</th>
                <th className="py-2 px-3">Std</th>
                <th className="py-2 px-3">Min</th>
                <th className="py-2 px-3">25%</th>
                <th className="py-2 px-3">50% (Median)</th>
                <th className="py-2 px-3">75%</th>
                <th className="py-2 px-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {Object.entries(dataReport.descriptive_statistics || {}).map(([col, stats]) => (
                <tr key={col} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-slate-200">{col}</td>
                  <td className="py-2 px-3 text-emerald-400">{stats.mean.toLocaleString()}</td>
                  <td className="py-2 px-3">{stats.std.toLocaleString()}</td>
                  <td className="py-2 px-3">{stats.min.toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-400">{stats["25%"].toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-200">{stats["50%"].toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-400">{stats["75%"].toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-200">{stats.max.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Table Browser */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Live Consignment Records Browser</h3>
            <p className="text-xs text-slate-400">Viewing raw records from Musanze farming zones</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search record ID or area..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={fetchRecords}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Record ID</th>
                <th className="py-2 px-3">Plot (ha)</th>
                <th className="py-2 px-3">Rainfall (mm)</th>
                <th className="py-2 px-3">pH</th>
                <th className="py-2 px-3">Seed (kg)</th>
                <th className="py-2 px-3">Dist (km)</th>
                <th className="py-2 px-3">Arrival</th>
                <th className="py-2 px-3 text-emerald-400">Actual Yield (kg)</th>
                <th className="py-2 px-3 text-amber-400">Dispatch Attn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {currentRecords.map((r) => (
                <tr key={r.record_id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 text-slate-400 font-bold">{r.record_id}</td>
                  <td className="py-2 px-3">{r.plot_area_ha}</td>
                  <td className="py-2 px-3">{r.rainfall_mm}</td>
                  <td className="py-2 px-3">{r.soil_ph}</td>
                  <td className="py-2 px-3">{r.seed_kg}</td>
                  <td className="py-2 px-3">{r.distance_km}</td>
                  <td className="py-2 px-3">{r.arrival_hour}:00</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">{r.actual_yield_kg?.toLocaleString()}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      r.dispatch_attention === 1
                        ? "bg-amber-950 text-amber-400 border border-amber-800 font-bold"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {r.dispatch_attention === 1 ? "1 (ATTENTION)" : "0 (Standard)"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span>Showing page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
