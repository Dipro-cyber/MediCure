import { differenceInDays, parseISO, format } from "date-fns";

export function getStockStatus(current, minimum) {
  const ratio = current / minimum;
  if (ratio <= 0.25) return "Critical";
  if (ratio <= 0.6)  return "Low";
  if (ratio <= 1.5)  return "Adequate";
  return "Surplus";
}

export function getDaysUntilExpiry(expiryDate) {
  return differenceInDays(parseISO(expiryDate), new Date());
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try { return format(parseISO(dateStr), "dd MMM yyyy"); }
  catch { return dateStr; }
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

export function generateOrderId() {
  const year = new Date().getFullYear();
  const num  = Math.floor(Math.random() * 900) + 100;
  return `ORD-${year}-${num}`;
}

export function getRowBg(status) {
  switch (status) {
    case "Critical": return "bg-red-50 hover:bg-red-100";
    case "Low":      return "bg-yellow-50 hover:bg-yellow-100";
    default:         return "hover:bg-gray-50";
  }
}

export function countCritical(medicines) {
  return medicines.filter(m => getStockStatus(m.currentStock, m.minimumStock) === "Critical").length;
}
