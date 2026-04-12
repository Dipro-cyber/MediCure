import React, { useState, useEffect } from "react";
import { Plus, X, Truck, CheckCircle, Clock, Package, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { sampleOrders, samplePHCs, sampleMedicines } from "../data/sampleData";
import { ORDER_STATUS_COLORS, PRIORITY_COLORS } from "../utils/constants";
import { formatDate, generateOrderId } from "../utils/helpers";
import { fetchOrders, addOrder, seedOrdersIfEmpty, firebaseReady } from "../services/firebaseService";
import toast from "react-hot-toast";

const TIMELINE_STEPS = ["Order Placed", "Approved", "Dispatched", "In Transit", "Delivered"];

function TimelineModal({ order, onClose }) {
  const completedSteps = order.timeline.filter(Boolean).length;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">Order Tracking</h3>
            <p className="text-xs text-gray-400">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">{order.phcName}</p>
            <p className="text-xs text-gray-400">{order.medicines.map(m => m.name).join(", ")}</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            {TIMELINE_STEPS.map((step, i) => {
              const done = i < completedSteps;
              const active = i === completedSteps - 1;
              return (
                <div key={step} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${done ? "bg-green-500" : "bg-gray-200"}`}>
                    {done ? <CheckCircle className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-medium ${done ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
                    {order.timeline[i] && <p className="text-xs text-gray-400">{formatDate(order.timeline[i])}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const emptyForm = { phcId: "phc1", medicines: [], priority: "Normal", expectedDelivery: "", notes: "" };

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders]         = useState(sampleOrders);
  const [usingFirebase, setUsingFirebase] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [trackOrder, setTrackOrder] = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [medQty, setMedQty]         = useState({});

  // Load orders from Firestore on mount
  useEffect(() => {
    if (!firebaseReady) return;
    (async () => {
      try {
        await seedOrdersIfEmpty(sampleOrders);
        const data = await fetchOrders();
        if (data && data.length > 0) {
          setOrders(data);
          setUsingFirebase(true);
        }
      } catch (e) {
        console.warn("Firestore orders load failed:", e.message);
      }
    })();
  }, []);

  // Pre-fill form if navigated from Inventory reorder button
  useEffect(() => {
    const med = location.state?.reorderMedicine;
    if (med) {
      const qty = med.minimumStock * 2;
      setForm(f => ({ ...f, medicines: [{ name: med.name, qty }] }));
      setMedQty({ [med.name]: qty });
      setShowForm(true);
      // Clear state so back navigation doesn't re-open
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  function toggleMed(name) {
    setForm(f => {
      const exists = f.medicines.find(m => m.name === name);
      return {
        ...f,
        medicines: exists
          ? f.medicines.filter(m => m.name !== name)
          : [...f.medicines, { name, qty: medQty[name] || 100 }],
      };
    });
  }

  async function handleSubmit() {
    if (!form.medicines.length) { toast.error("Select at least one medicine"); return; }
    const phc = samplePHCs.find(p => p.id === form.phcId);
    const newOrder = {
      id: generateOrderId(),
      phcId: form.phcId,
      phcName: phc?.name || "",
      medicines: form.medicines,
      status: "Pending",
      priority: form.priority,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDelivery: form.expectedDelivery,
      createdBy: "Dr. Admin",
      notes: form.notes,
      timeline: [new Date().toISOString().split("T")[0], null, null, null, null],
    };
    try {
      if (usingFirebase) {
        const ref = await addOrder(newOrder);
        setOrders(prev => [{ ...newOrder, id: ref.id }, ...prev]);
      } else {
        setOrders(prev => [newOrder, ...prev]);
      }
      toast.success(`Order ${newOrder.id} created`);
    } catch (e) {
      toast.error("Failed to save order: " + e.message);
    }
    setShowForm(false);
    setForm(emptyForm);
    setMedQty({});
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-sm text-gray-500">{orders.length} total orders</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1a73e8] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create New Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Order ID","PHC Name","Medicines","Order Date","Status","Priority","Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600 font-semibold whitespace-nowrap">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{order.phcName}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs">
                    <span className="truncate block">{order.medicines.map(m => `${m.name} (${m.qty})`).join(", ")}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLORS[order.priority]}`}>{order.priority}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => setTrackOrder(order)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                      <Truck className="w-3.5 h-3.5" /> Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-800">Create New Order</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">PHC Location</label>
                <select value={form.phcId} onChange={e => setForm(f => ({ ...f, phcId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {samplePHCs.map(p => <option key={p.id} value={p.id}>{p.name} — {p.district}, {p.state}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Select Medicines</label>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {sampleMedicines.map(m => {
                    const selected = form.medicines.find(x => x.name === m.name);
                    return (
                      <div key={m.id} className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${selected ? "bg-blue-50" : ""}`} onClick={() => toggleMed(m.name)}>
                        <input type="checkbox" readOnly checked={!!selected} className="rounded" />
                        <span className="text-sm flex-1">{m.name}</span>
                        {selected && (
                          <input type="number" value={medQty[m.name] || 100} min="1"
                            onClick={e => e.stopPropagation()}
                            onChange={e => { setMedQty(q => ({ ...q, [m.name]: +e.target.value })); setForm(f => ({ ...f, medicines: f.medicines.map(x => x.name === m.name ? { ...x, qty: +e.target.value } : x) })); }}
                            className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {["Emergency","High","Normal"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Expected Delivery</label>
                  <input type="date" value={form.expectedDelivery} onChange={e => setForm(f => ({ ...f, expectedDelivery: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 bg-[#1a73e8] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackOrder && <TimelineModal order={trackOrder} onClose={() => setTrackOrder(null)} />}
    </div>
  );
}
