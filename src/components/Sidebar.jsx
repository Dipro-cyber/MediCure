import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, Brain, ShoppingCart,
  FileBarChart, Settings, Activity, X,
} from "lucide-react";

const navItems = [
  { to: "/",           icon: LayoutDashboard, label: "Dashboard"   },
  { to: "/inventory",  icon: Package,         label: "Inventory"   },
  { to: "/predictions",icon: Brain,           label: "Predictions" },
  { to: "/orders",     icon: ShoppingCart,    label: "Orders"      },
  { to: "/reports",    icon: FileBarChart,    label: "Reports"     },
  { to: "/settings",   icon: Settings,        label: "Settings"    },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0d47a1] to-[#1a73e8]
          text-white z-30 flex flex-col shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto animate-slide-in
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
              <Activity className="w-5 h-5 text-[#1a73e8]" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">MediRoute</h1>
              <p className="text-xs text-blue-200">Supply Chain AI</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive
                   ? "bg-white text-[#1a73e8] shadow-md"
                   : "text-blue-100 hover:bg-white/15 hover:text-white"
                 }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              DR
            </div>
            <div>
              <p className="text-sm font-medium">Dr. Admin</p>
              <p className="text-xs text-blue-200">PHC Coordinator</p>
            </div>
          </div>
          <p className="text-xs text-blue-300 mt-3 text-center">
            Google Solution Challenge 2026
          </p>
        </div>
      </aside>
    </>
  );
}
