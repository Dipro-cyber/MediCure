import React, { useState } from "react";
import { Key, Bell, Info } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
  const [geminiKey, setGeminiKey] = useState(process.env.REACT_APP_GEMINI_KEY || "");
  const [notifications, setNotifications] = useState({ critical: true, expiry: true, orders: false });

  function handleSave() {
    toast.success("Settings saved (restart app to apply API key)");
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-500">Configure MediCure for your PHC network</p>
      </div>

      {/* API Config */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">API Configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Google Gemini API Key</label>
            <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <p className="text-xs text-gray-400 mt-1">Set in .env as REACT_APP_GEMINI_KEY for production use</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-800">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "critical", label: "Critical stock alerts" },
            { key: "expiry",   label: "Medicine expiry warnings" },
            { key: "orders",   label: "Order status updates" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{item.label}</span>
              <button
                onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                className={`w-11 h-6 rounded-full transition-colors ${notifications[item.key] ? "bg-blue-500" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${notifications[item.key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-800">About MediCure</h3>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Version 1.0.0 — Google Solution Challenge 2026</p>
          <p>Smart Medicine Supply Chain for Rural Indian PHCs</p>
          <p>Built with React, Firebase, and Google Gemini AI</p>
        </div>
      </div>

      <button onClick={handleSave} className="bg-[#1a73e8] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
        Save Settings
      </button>
    </div>
  );
}
