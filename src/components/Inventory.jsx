import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, RefreshCw, X, Filter, Package, Cloud, CloudOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sampleMedicines } from "../data/sampleData";
import { getStockStatus, formatDate, getDaysUntilExpiry, getRowBg } from "../utils/helpers";
import { STATUS_COLORS, CATEGORIES } from "../utils/constants";
import { fetchMedicines, addMedicine, updateMedicine, seedMedicinesIfEmpty, firebaseReady } from "../services/firebaseService";
import toast from "react-hot-toast";

const emptyForm = {
  name: "", category: "Antibiotics", currentStock: "", minimumStock: "",
  unit: "Tablets", expiryDate: "", unitPrice: "", supplier: "",
};

export default function Inventory() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState(sampleMedicines);
  const [loading, setLoading]     = useState(firebaseReady);
  const [usingFirebase, setUsingFirebase] = useState(false);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(emptyForm);

  // Load from Firestore on mount, seed if empty, fall back to sample data
  useEffect(() => {
    if (!firebaseReady) return;
    (async () => {
      try {
        await seedMedicinesIfEmpty(sampleMedicines);
        const data = await fetchMedicines();
        if (data && data.length > 0) {
          setMedicines(data);
          setUsingFirebase(true);
        }
      } catch (e) {
        console.warn("Firestore load failed, using sample data:", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.category.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || m.category === catFilter;
    const status      = getStockStatus(m.currentStock, m.minimumStock);
    const matchStatus = statusFilter === "All" || status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  function openAdd() { setEditItem(null); setForm(emptyForm); setShowModal(true); }
  function openEdit(m) {
    setEditItem(m);
    setForm({ name: m.name, category: m.category, currentStock: m.currentStock,
              minimumStock: m.minimumStock, unit: m.unit, expiryDate: m.expiryDate,
              unitPrice: m.unitPrice, supplier: m.supplier });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.currentStock || !form.minimumStock) {
      toast.error("Please fill required fields"); return;
    }
    const payload = { ...form, currentStock: +form.currentStock, minimumStock: +form.minimumStock, unitPrice: +form.unitPrice, lastUpdated: new Date().toISOString().split("T")[0] };
    try {
      if (editItem) {
        if (usingFirebase) await updateMedicine(editItem.id, payload);
        setMedicines(prev => prev.map(m => m.id === editItem.id ? { ...m, ...payload } : m));
        toast.success("Medicine updated");
      } else {
        if (usingFirebase) {
          const ref = await addMedicine(payload);
          setMedicines(prev => [...prev, { ...payload, id: ref.id }]);
        } else {
          setMedicines(prev => [...prev, { ...payload, id: `med${Date.now()}` }]);
        }
        toast.success("Medicine added");
      }
    } catch (e) {
      toast.error("Save failed: " + e.message);
    }
    setShowModal(false);
  }

  function handleReorder(m) {
    // Navigate to Orders page with medicine pre-filled via URL state
    navigate("/orders", { state: { reorderMedicine: m } });
    toast.success(`Opening order form for ${m.name}`);
  }

  const expiryWarning = (date) => {
    const days = getDaysUntilExpiry(date);
    if (days < 0)  return "text-red-600 font-semibold";
    if (days < 30) return "text-orange-500 font-semibold";
    return "text-gray-600";
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Medicine Inventory</h2>
          <p className="text-sm text-gray-500">{medicines.length} medicines tracked across all PHCs</p>
        </div>
        <div className="flex items-center gap-3">
          {usingFirebase
            ? <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200"><Cloud className="w-3.5 h-3.5" />Firebase Synced</span>
            : <span className="flex items-center gap-1.5 text-xs bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-200"><CloudOff className="w-3.5 h-3.5" />Demo Mode</span>
          }
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#1a73e8] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            {["All","Critical","Low","Adequate","Surplus"].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
            <Filter className="w-3.5 h-3.5" />
            {filtered.length} results
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Medicine Name","Category","Current Stock","Min. Required","Expiry Date","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(m => {
                const status = getStockStatus(m.currentStock, m.minimumStock);
                return (
                  <tr key={m.id} className={`${getRowBg(status)} transition-colors`}>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{m.name}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.category}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      <span className={status === "Critical" ? "text-red-600" : status === "Low" ? "text-yellow-600" : "text-gray-700"}>
                        {m.currentStock} {m.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.minimumStock} {m.unit}</td>
                    <td className={`px-4 py-3 whitespace-nowrap ${expiryWarning(m.expiryDate)}`}>{formatDate(m.expiryDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>{status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {(status === "Critical" || status === "Low") && (
                          <button onClick={() => handleReorder(m)} className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors">
                            <RefreshCw className="w-3 h-3" /> Reorder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No medicines found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">{editItem ? "Edit Medicine" : "Add New Medicine"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: "Medicine Name *", key: "name", type: "text", full: true },
                { label: "Category",        key: "category", type: "select", options: CATEGORIES.slice(1) },
                { label: "Current Stock *", key: "currentStock", type: "number" },
                { label: "Minimum Stock *", key: "minimumStock", type: "number" },
                { label: "Unit",            key: "unit", type: "select", options: ["Tablets","Capsules","Vials","Sachets","Inhalers","Syrup","Injection"] },
                { label: "Expiry Date",     key: "expiryDate", type: "date" },
                { label: "Unit Price (₹)",  key: "unitPrice", type: "number" },
                { label: "Supplier",        key: "supplier", type: "text", full: true },
              ].map(field => (
                <div key={field.key} className={field.full ? "col-span-2" : ""}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                  {field.type === "select" ? (
                    <select value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                      {field.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-[#1a73e8] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                {editItem ? "Save Changes" : "Add Medicine"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
