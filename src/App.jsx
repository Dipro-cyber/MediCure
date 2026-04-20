import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Menu, Zap } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Predictions from "./components/Predictions";
import Orders from "./components/Orders";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import ChatAssistant from "./components/ChatAssistant";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [demoMode, setDemoMode]       = useState(false);
  const [chatMsg, setChatMsg]         = useState(null);

  function activateDemo() {
    setDemoMode(true);
    setTimeout(() => setChatMsg("Which medicines are critically low?"), 6000);
    setTimeout(() => setDemoMode(false), 100); // reset so effect re-fires if clicked again
    setTimeout(() => setDemoMode(true), 50);
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400">MediCure — Smart Supply Chain</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Demo Mode Button */}
              <button
                onClick={activateDemo}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-md animate-pulse"
              >
                <Zap className="w-3.5 h-3.5" />
                Demo Mode
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] flex items-center justify-center text-white text-xs font-bold">
                DR
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto scrollbar-thin">
            <Routes>
              <Route path="/"            element={<Dashboard demoMode={demoMode} />} />
              <Route path="/inventory"   element={<Inventory />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/orders"      element={<Orders />} />
              <Route path="/reports"     element={<Reports />} />
              <Route path="/settings"    element={<Settings />} />
            </Routes>
          </main>
        </div>

        {/* Floating Chat */}
        <ChatAssistant initialMessage={chatMsg} />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: "12px", fontSize: "13px" },
            success: { iconTheme: { primary: "#34a853", secondary: "white" } },
            error:   { iconTheme: { primary: "#ea4335", secondary: "white" } },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
