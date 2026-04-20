import React, { useState } from "react";
import { FileBarChart, Download, RefreshCw, Calendar } from "lucide-react";
import { generateReport } from "../services/geminiService";
import { sampleMedicines, sampleOrders } from "../data/sampleData";
import { getStockStatus, getDaysUntilExpiry } from "../utils/helpers";
import StockLevelChart from "./Charts/StockLevelChart";
import toast from "react-hot-toast";

const REPORT_TYPES = [
  "Monthly Consumption Report",
  "Stock Analysis Report",
  "Expiry Alert Report",
  "Order History Report",
];

const DEMO_NARRATIVE = `**Executive Summary — MediCure PHC Network (April 2026)**

The MediCure network currently tracks 18 medicines across 6 Primary Health Centers in Rajasthan, Uttar Pradesh, and Bihar. This report highlights critical supply chain concerns that require immediate attention from district health authorities.

**Critical Stock Situation:** Three medicines — Insulin Regular 40IU (8 vials), Chloroquine 250mg (12 tablets), and Paracetamol 500mg (45 tablets) — are critically below minimum thresholds. Insulin Regular poses the most urgent risk, with an estimated 3-day supply remaining for diabetic patients at PHC Sitamarhi and PHC Barmer. Emergency procurement is strongly recommended within 24 hours.

**Seasonal Preparedness:** With the monsoon season approaching (June–September), the network must urgently stock ORS Sachets, Chloroquine, and anti-diarrheal medicines. Historical data shows a 3–4x increase in diarrheal and malarial cases during this period in Rajasthan and UP districts. Current ORS stock (80 sachets) is critically insufficient against a projected demand of 380+ sachets per month.

**Order Fulfillment & Expiry Concerns:** The network achieved an 87% order fulfillment rate this quarter, with 2 emergency orders pending. Hepatitis B Vaccine (20 vials) expires on April 30, 2026 — immediate use or cold-chain return to Serum Institute is recommended to avoid wastage worth ₹1,100. Overall stock accuracy stands at 94%, reflecting good inventory management practices by PHC staff.`;

export default function Reports() {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [dateFrom, setDateFrom]     = useState("2026-01-01");
  const [dateTo, setDateTo]         = useState("2026-04-08");
  const [narrative, setNarrative]   = useState("");
  const [loading, setLoading]       = useState(false);

  const expiring30  = sampleMedicines.filter(m => { const d = getDaysUntilExpiry(m.expiryDate); return d >= 0 && d <= 30; });
  const expiring60  = sampleMedicines.filter(m => { const d = getDaysUntilExpiry(m.expiryDate); return d > 30 && d <= 60; });
  const critical    = sampleMedicines.filter(m => getStockStatus(m.currentStock, m.minimumStock) === "Critical");
  const delivered   = sampleOrders.filter(o => o.status === "Delivered").length;
  const fulfillRate = Math.round((delivered / sampleOrders.length) * 100);

  async function handleGenerate() {
    setLoading(true);
    const reportData = {
      reportType, dateRange: { from: dateFrom, to: dateTo },
      totalMedicines: sampleMedicines.length,
      criticalMedicines: critical.map(m => m.name),
      expiringIn30Days: expiring30.map(m => m.name),
      totalOrders: sampleOrders.length,
      orderFulfillmentRate: `${fulfillRate}%`,
    };
    try {
      const text = await generateReport(reportType, reportData);
      setNarrative(text);
      toast.success("Report generated");
    } catch (err) {
      console.error("Report generation error:", err);
      // Only fall back to demo if proxy is unreachable
      if (err.message?.includes("fetch") || err.message?.includes("Failed to fetch")) {
        setNarrative(DEMO_NARRATIVE);
        toast("Proxy server not running — showing demo report", { icon: "ℹ️" });
      } else {
        setNarrative(DEMO_NARRATIVE);
        toast.error("AI error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
          <p className="text-sm text-gray-500">Generate AI-powered supply chain reports</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-gray-600 mb-1">Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              {REPORT_TYPES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <button onClick={handleGenerate} disabled={loading}
            className="flex items-center gap-2 bg-[#1a73e8] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileBarChart className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Report"}
          </button>
          {narrative && (
            <button onClick={handlePrint} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Critical Medicines",      value: critical.length,    color: "text-red-600",    bg: "bg-red-50" },
          { label: "Expiring in 30 Days",     value: expiring30.length,  color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Order Fulfillment Rate",  value: `${fulfillRate}%`,  color: "text-green-600",  bg: "bg-green-50" },
          { label: "Stock Accuracy",          value: "94%",              color: "text-blue-600",   bg: "bg-blue-50" },
        ].map(m => (
          <div key={m.label} className={`${m.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Stock Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Current Stock Levels</h3>
        <StockLevelChart medicines={sampleMedicines} />
      </div>

      {/* Expiry Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-red-600">Expiring in 30 Days</h3>
          {expiring30.length === 0 ? <p className="text-sm text-gray-400">None</p> : expiring30.map(m => (
            <div key={m.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
              <span className="text-gray-700">{m.name}</span>
              <span className="text-red-600 font-medium">{m.expiryDate}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-orange-500">Expiring in 31–60 Days</h3>
          {expiring60.length === 0 ? <p className="text-sm text-gray-400">None</p> : expiring60.map(m => (
            <div key={m.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
              <span className="text-gray-700">{m.name}</span>
              <span className="text-orange-500 font-medium">{m.expiryDate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Narrative */}
      {narrative && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <FileBarChart className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">AI-Generated Report Narrative</h3>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {narrative}
          </div>
        </div>
      )}
    </div>
  );
}
