import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, AlertTriangle, Building2, ShoppingCart,
  TrendingUp, Zap, MapPin, Wifi, WifiOff,
} from "lucide-react";
import ConsumptionChart from "./Charts/ConsumptionChart";
import AlertsPanel from "./AlertsPanel";
import { sampleMedicines, consumptionHistory, sampleAlerts, phcMapLocations, sampleOrders } from "../data/sampleData";
import { countCritical } from "../utils/helpers";
import toast from "react-hot-toast";

// Animated counter hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ label, value, icon: Icon, gradient, sub }) {
  const count = useCountUp(typeof value === "number" ? value : 0);
  return (
    <div className={`${gradient} rounded-2xl p-5 text-white shadow-lg card-hover animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-4xl font-bold mt-1" style={{ animation: "countUp 1s ease-out" }}>
            {typeof value === "number" ? count : value}
          </p>
          {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
        </div>
        <div className="bg-white/20 rounded-xl p-3">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Simple India SVG map with PHC dots
function IndiaMap({ locations }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="relative">
      <svg viewBox="0 0 400 420" className="w-full max-h-64" fill="none">
        {/* Simplified India outline */}
        <path
          d="M160,30 L200,25 L240,35 L270,50 L290,70 L310,90 L320,120 L315,150 L300,175 L310,200 L305,230 L290,255 L270,275 L255,300 L240,320 L225,340 L210,360 L200,380 L190,360 L175,340 L160,320 L145,300 L130,275 L115,255 L100,230 L95,200 L105,175 L90,150 L85,120 L95,90 L115,70 L135,50 Z"
          fill="#e8f0fe" stroke="#1a73e8" strokeWidth="1.5"
        />
        {/* Kashmir */}
        <path d="M160,30 L175,20 L195,15 L215,18 L230,28 L240,35 L200,25 Z" fill="#c5d8fb" stroke="#1a73e8" strokeWidth="1" />
        {/* Northeast */}
        <path d="M310,120 L330,110 L345,125 L340,145 L320,150 Z" fill="#e8f0fe" stroke="#1a73e8" strokeWidth="1" />
        {/* State borders (simplified) */}
        <line x1="160" y1="120" x2="310" y2="120" stroke="#1a73e8" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
        <line x1="140" y1="180" x2="305" y2="180" stroke="#1a73e8" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
        <line x1="120" y1="240" x2="295" y2="240" stroke="#1a73e8" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />

        {/* PHC location dots */}
        {locations.map(loc => (
          <g key={loc.id} onMouseEnter={() => setHovered(loc)} onMouseLeave={() => setHovered(null)}>
            <circle cx={loc.x} cy={loc.y} r="8" fill="#ea4335" opacity="0.2" className="animate-pulse" />
            <circle cx={loc.x} cy={loc.y} r="5" fill="#ea4335" stroke="white" strokeWidth="1.5" className="cursor-pointer" />
            <MapPin className="w-3 h-3" x={loc.x - 6} y={loc.y - 12} fill="#ea4335" />
          </g>
        ))}

        {/* Tooltip */}
        {hovered && (
          <g>
            <rect x={hovered.x - 40} y={hovered.y - 38} width="90" height="28" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
            <text x={hovered.x + 5} y={hovered.y - 28} textAnchor="middle" fontSize="9" fill="#1a73e8" fontWeight="600">{hovered.name}</text>
            <text x={hovered.x + 5} y={hovered.y - 18} textAnchor="middle" fontSize="8" fill="#64748b">{hovered.state}</text>
          </g>
        )}
      </svg>
      <p className="text-xs text-gray-400 text-center -mt-2">PHC Network — India</p>
    </div>
  );
}

export default function Dashboard({ demoMode }) {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [demoRunning, setDemoRunning] = useState(false);
  const demoRef = useRef(null);

  const critical = countCritical(sampleMedicines);
  const ordersThisMonth = sampleOrders.filter(o => o.orderDate.startsWith("2026-04")).length;

  function handleMarkRead(id) {
    setAlerts(prev =>
      id === "all"
        ? prev.map(a => ({ ...a, isRead: true }))
        : prev.map(a => a.id === id ? { ...a, isRead: true } : a)
    );
  }

  // Demo mode simulation
  useEffect(() => {
    if (!demoMode) return;
    setDemoRunning(true);
    const t1 = setTimeout(() => {
      toast.error("🚨 CRITICAL: Insulin Regular stock at 8 vials!", { duration: 5000 });
    }, 800);
    const t2 = setTimeout(() => {
      toast("🤖 AI is analyzing your inventory...", { icon: "⚡", duration: 3000 });
    }, 2500);
    const t3 = setTimeout(() => {
      toast.success("✅ AI Prediction complete — 6 medicines need reorder", { duration: 4000 });
      navigate("/predictions");
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [demoMode, navigate]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
          <Wifi className="w-3.5 h-3.5" />
          Live Data
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Medicines Tracked"  value={sampleMedicines.length} icon={Package}      gradient="gradient-primary" sub="Across all PHCs" />
        <StatCard label="Critical Alerts"    value={critical}               icon={AlertTriangle} gradient="gradient-critical" sub="Need immediate action" />
        <StatCard label="PHCs Connected"     value={6}                      icon={Building2}     gradient="gradient-success"  sub="3 states covered" />
        <StatCard label="Orders This Month"  value={ordersThisMonth}        icon={ShoppingCart}  gradient="gradient-warning"  sub="April 2026" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Consumption Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Medicine Consumption Trends</h3>
              <p className="text-xs text-gray-400">Last 6 months — all PHCs combined</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <ConsumptionChart data={consumptionHistory} />
        </div>

        {/* Alerts Panel */}
        <div className="xl:col-span-1 min-h-64">
          <AlertsPanel alerts={alerts} onMarkRead={handleMarkRead} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* India Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-800">PHC Network Map</h3>
          </div>
          <IndiaMap locations={phcMapLocations} />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-800">Quick Overview</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Medicines expiring in 30 days", value: "3", color: "text-red-600" },
              { label: "Pending orders",                value: "2", color: "text-orange-500" },
              { label: "Adequate stock medicines",      value: "8", color: "text-green-600" },
              { label: "AI predictions generated",     value: "Today", color: "text-blue-600" },
              { label: "Order fulfillment rate",        value: "87%", color: "text-green-600" },
              { label: "Stock accuracy",                value: "94%", color: "text-blue-600" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/predictions")}
            className="mt-4 w-full bg-gradient-to-r from-[#1a73e8] to-[#0d47a1] text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Run AI Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
