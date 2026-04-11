export const COLORS = {
  primary: "#1a73e8",
  success: "#34a853",
  danger:  "#ea4335",
  warning: "#fbbc04",
  purple:  "#9c27b0",
  teal:    "#00897b",
};

export const STATUS_COLORS = {
  Critical: "bg-red-100 text-red-700 border border-red-200",
  Low:      "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Adequate: "bg-green-100 text-green-700 border border-green-200",
  Surplus:  "bg-blue-100 text-blue-700 border border-blue-200",
};

export const ORDER_STATUS_COLORS = {
  Pending:    "bg-gray-100 text-gray-600",
  Processing: "bg-blue-100 text-blue-700",
  Shipped:    "bg-purple-100 text-purple-700",
  Delivered:  "bg-green-100 text-green-700",
};

export const PRIORITY_COLORS = {
  Emergency: "bg-red-500 text-white",
  High:      "bg-orange-400 text-white",
  Normal:    "bg-blue-400 text-white",
};

export const CATEGORIES = [
  "All", "Antibiotics", "Pain Relief", "Vaccines", "Supplements",
  "Diabetes", "Cardiac", "Gastro", "Respiratory", "Anti-malarial",
  "Oral Rehydration",
];

export const GEMINI_MODEL = "gemini-2.0-flash";
