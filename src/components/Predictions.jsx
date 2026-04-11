import React, { useState } from "react";
import { Brain, Zap, AlertTriangle, TrendingUp, DollarSign, RefreshCw, ChevronRight, CloudRain } from "lucide-react";
import { runInventoryPrediction } from "../services/geminiService";
import { sampleMedicines } from "../data/sampleData";
import PredictionChart from "./Charts/PredictionChart";
import toast from "react-hot-toast";

// Fallback demo data when Gemini API is unavailable
const DEMO_RESULT = {
  predictions: [
    { medicineName: "Insulin Regular 40IU",  daysUntilStockout: 3,  confidence: 97, recommendedOrderQty: 60,  reason: "Only 8 vials remaining, diabetic patients require daily doses" },
    { medicineName: "Chloroquine 250mg",     daysUntilStockout: 5,  confidence: 94, recommendedOrderQty: 500, reason: "Pre-monsoon season — malaria cases expected to spike 3x in June" },
    { medicineName: "Paracetamol 500mg",     daysUntilStockout: 7,  confidence: 91, recommendedOrderQty: 800, reason: "High daily consumption, current stock 45 vs minimum 200" },
    { medicineName: "Ciprofloxacin 500mg",   daysUntilStockout: 9,  confidence: 88, recommendedOrderQty: 300, reason: "Antibiotic demand rising with seasonal infections" },
    { medicineName: "Amoxicillin 250mg",     daysUntilStockout: 12, confidence: 85, recommendedOrderQty: 400, reason: "Stock at 20% of minimum — respiratory infections increasing" },
    { medicineName: "Salbutamol Inhaler",    daysUntilStockout: 15, confidence: 82, recommendedOrderQty: 50,  reason: "Dust season in Rajasthan increases asthma cases" },
  ],
  recommendations: [
    { medicine: "Insulin Regular 40IU",  action: "Emergency order required within 24 hours — contact Novo Nordisk directly", urgency: "High" },
    { medicine: "Chloroquine 250mg",     action: "Order 500 tablets before June 1 for monsoon preparedness", urgency: "High" },
    { medicine: "ORS Sachets",           action: "Stock up 600 sachets — diarrheal diseases peak in monsoon", urgency: "High" },
    { medicine: "Paracetamol 500mg",     action: "Bulk order recommended — negotiate with Sun Pharma for volume discount", urgency: "Medium" },
    { medicine: "Hepatitis B Vaccine",   action: "Use existing stock before April 30 expiry or arrange cold-chain return", urgency: "Medium" },
  ],
  seasonal_alerts: [
    { title: "Monsoon Season Alert", message: "June–September: Stock ORS, Chloroquine, Metronidazole, and anti-diarrheal medicines. Malaria and diarrhea cases typically increase 3–4x in rural Rajasthan and UP.", season: "Monsoon" },
    { title: "Summer Heat Advisory", message: "April–June: Increase ORS and electrolyte sachets. Heat stroke cases rise in Barmer and Jaisalmer districts.", season: "Summer" },
    { title: "Immunization Drive", message: "April–May: Ensure BCG, Polio, and Hepatitis B vaccines are adequately stocked for the national immunization schedule.", season: "Spring" },
  ],
  priority_order: ["Insulin Regular 40IU", "Chloroquine 250mg", "Paracetamol 500mg", "ORS Sachets", "Ciprofloxacin 500mg", "Amoxicillin 250mg"],
  cost_tips: [
    "Bulk order Paracetamol and ORS together from Sun Pharma — saves ~18% on logistics",
    "Coordinate with PHC Bahraich for joint Chloroquine order — volume discount available",
    "Return Hepatitis B Vaccine before expiry to Serum Institute for credit note",
    "Switch Ciprofloxacin supplier to Alkem Labs — ₹1.5/tablet cheaper with same quality",
    "Use Jan Aushadhi Kendra for generic alternatives — potential 40% cost saving on antibiotics",
  ],
};

function ConfidenceBadge({ value }) {
  // Handle both decimal (0.95) and percentage (95) formats from Gemini
  const pct = value > 1 ? Math.round(value) : Math.round(value * 100);
  const color = pct >= 90 ? "bg-red-100 text-red-700" : pct >= 75 ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700";
  return <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${color}`}>{pct}% confidence</span>;
}

function UrgencyBadge({ urgency }) {
  const map = { High: "bg-red-100 text-red-700", Medium: "bg-yellow-100 text-yellow-700", Low: "bg-green-100 text-green-700" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${map[urgency] || map.Low}`}>{urgency}</span>;
}

export default function Predictions() {
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [usedDemo, setUsedDemo] = useState(false);

  async function handleRunAnalysis() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runInventoryPrediction(sampleMedicines);
      setResult(data);
      setUsedDemo(false);
      toast.success("AI analysis complete");
    } catch (err) {
      console.error("Gemini error:", err);
      const errMsg = err?.message || "Unknown error";
      // Graceful fallback to demo data
      setResult(DEMO_RESULT);
      setUsedDemo(true);
      setError(`Gemini API error: ${errMsg} — showing demo predictions.`);
      toast("Showing demo predictions", { icon: "ℹ️" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Predictions</h2>
          <p className="text-sm text-gray-500">Powered by Google Gemini 2.5 Flash</p>
        </div>
        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-[#1a73e8] to-[#0d47a1] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-60"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {loading ? "AI is analyzing..." : "Run AI Analysis"}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <h3 className="font-semibold text-blue-800 text-lg">Gemini AI is analyzing your inventory...</h3>
          <p className="text-blue-600 text-sm mt-1">Checking stock levels, seasonal patterns, and demand forecasts</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Error / demo notice */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Brain className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-600 text-lg">No predictions yet</h3>
          <p className="text-gray-400 text-sm mt-1">Click "Run AI Analysis" to get Gemini-powered stockout predictions</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Seasonal Alerts */}
          {result.seasonal_alerts?.map((alert, i) => (
            <div key={i} className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-5 flex items-start gap-4 shadow-lg">
              <CloudRain className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-lg">{alert.title}</h4>
                <p className="text-blue-100 text-sm mt-1">{alert.message}</p>
              </div>
              <span className="ml-auto bg-white/20 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">{alert.season}</span>
            </div>
          ))}

          {/* Prediction Cards */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Stockout Predictions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {result.predictions?.map((p, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border p-5 card-hover ${p.daysUntilStockout <= 7 ? "border-red-200" : "border-gray-100"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 text-sm leading-tight">{p.medicineName}</h4>
                    <ConfidenceBadge value={p.confidence} />
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${p.daysUntilStockout <= 7 ? "text-red-600" : "text-orange-500"}`}>
                    {p.daysUntilStockout} days
                  </div>
                  <p className="text-xs text-gray-400 mb-3">until stockout</p>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{p.reason}</p>
                  <div className="bg-blue-50 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium">
                    Recommended order: {p.recommendedOrderQty} units
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Chart — built from real Gemini predictions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Recommended Order Qty vs Current Stock
            </h3>
            <p className="text-xs text-gray-400 mb-4">Based on Gemini AI analysis of your inventory</p>
            <PredictionChart
              data={result.predictions.map(p => {
                const med = sampleMedicines.find(m => m.name.toLowerCase().includes(p.medicineName.toLowerCase().split(" ")[0].toLowerCase()));
                return {
                  medicine: p.medicineName.split(" ").slice(0, 2).join(" "),
                  recommendedOrderQty: p.recommendedOrderQty,
                  currentStock: med?.currentStock ?? 0,
                };
              })}
            />
          </div>

          {/* Priority Order + Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Priority Reorder List
              </h3>
              <div className="space-y-2">
                {result.priority_order?.map((med, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-500" : i === 2 ? "bg-yellow-500" : "bg-blue-400"}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{med}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Cost Saving Tips
              </h3>
              <div className="space-y-3">
                {result.cost_tips?.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 font-bold flex-shrink-0">₹</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              {result.recommendations?.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <UrgencyBadge urgency={rec.urgency} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{rec.medicine}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{rec.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {usedDemo && (
            <p className="text-center text-xs text-gray-400">
              Demo data shown. Set <code className="bg-gray-100 px-1 rounded">REACT_APP_GEMINI_KEY</code> in <code className="bg-gray-100 px-1 rounded">.env</code> for live Gemini predictions.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
