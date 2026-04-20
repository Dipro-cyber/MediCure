// In production (Render), the proxy is on the same server.
// In development, it runs on localhost:3001.
const PROXY_URL = process.env.NODE_ENV === "production"
  ? "/api/gemini"
  : "http://localhost:3001/api/gemini";

async function generate(prompt) {
  const res = await fetch(PROXY_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.text;
}

function extractJSON(text) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw   = fenceMatch ? fenceMatch[1].trim() : text.trim();
  const start = raw.indexOf("{");
  const end   = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in response");
  return JSON.parse(raw.slice(start, end + 1));
}

// ─── Inventory Prediction ────────────────────────────────────────────────────
export async function runInventoryPrediction(medicines) {
  const critical = medicines.filter(m => m.currentStock < m.minimumStock);

  const prompt = `Medical supply analyst for Indian rural PHCs. April 2026.
Medicines below minimum stock:
${critical.map(m => `${m.name}: stock=${m.currentStock}, min=${m.minimumStock}, unit=${m.unit}`).join("\n")}

Reply with ONLY valid JSON, no markdown, no extra text:
{"predictions":[{"medicineName":"","daysUntilStockout":0,"confidence":0,"recommendedOrderQty":0,"reason":""}],"recommendations":[{"medicine":"","action":"","urgency":"High"}],"seasonal_alerts":[{"title":"","message":"","season":""}],"priority_order":[],"cost_tips":[]}

Fill real values. Monsoon June-Sep spikes ORS/malaria demand. Max 6 predictions, 3 alerts, 4 tips.`;

  const text = await generate(prompt);
  return extractJSON(text);
}

// ─── Chat Assistant ──────────────────────────────────────────────────────────
export async function chatWithAssistant(messages, inventoryContext) {
  const critical = inventoryContext?.filter(m => m.status === "Critical" || m.status === "Low") || [];
  const lastMsg  = messages[messages.length - 1]?.content || "";

  const prompt = `You are MediCure Assistant for rural Indian PHC staff. Be concise and helpful.
Critical medicines: ${critical.map(m => m.name).join(", ") || "none"}
User asks: ${lastMsg}
Reply in 3-5 sentences. Include Hindi terms when helpful.`;

  return generate(prompt);
}

// ─── Report Generation ───────────────────────────────────────────────────────
export async function generateReport(reportType, data) {
  const prompt = `Write a professional 3-paragraph ${reportType} for a rural Indian PHC network.
Date range: ${data.dateRange?.from} to ${data.dateRange?.to}.
Total medicines tracked: ${data.totalMedicines}.
Critical stock medicines: ${data.criticalMedicines?.join(", ")}.
Medicines expiring in 30 days: ${data.expiringIn30Days?.join(", ") || "none"}.
Total orders: ${data.totalOrders}. Order fulfillment rate: ${data.orderFulfillmentRate}.
Write for government health officials. Include specific numbers. Be concise and actionable.`;

  return generate(prompt);
}
