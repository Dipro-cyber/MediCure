import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { chatWithAssistant } from "../services/geminiService";
import { sampleMedicines } from "../data/sampleData";
import { getStockStatus } from "../utils/helpers";

const SUGGESTED = [
  "Which medicines are critically low?",
  "When should I reorder Paracetamol?",
  "What medicines are needed in monsoon season?",
  "How do I report a medicine shortage?",
];

const DEMO_RESPONSES = {
  "which medicines are critically low": "🚨 **Critical Stock Alert (दवाई की कमी):**\n\n1. **Insulin Regular 40IU** — Only 8 vials (min: 30). Emergency order needed!\n2. **Chloroquine 250mg** — Only 12 tablets (min: 150). Pre-monsoon risk.\n3. **Paracetamol 500mg** — Only 45 tablets (min: 200). High daily use.\n4. **Ciprofloxacin 500mg** — Only 15 tablets (min: 100).\n\nPlease go to Orders page to create emergency reorder requests.",
  "when should i reorder paracetamol": "📋 **Paracetamol Reorder Guidance:**\n\nCurrent stock: 45 tablets | Minimum: 200 tablets\n\nYou should reorder **immediately** (आज ही)! At average consumption of ~35 tablets/day, you have roughly **1-2 days** of stock left.\n\n**Recommended order:** 800 tablets from Sun Pharma, Mumbai\n**Estimated cost:** ₹960 (800 × ₹1.20)\n\nTip: Order in bulk of 1000+ to get 10% discount.",
  "what medicines are needed in monsoon season": "🌧️ **Monsoon Season (June–September) Medicines:**\n\n**High Priority (बहुत जरूरी):**\n• ORS Sachets — diarrhea & dehydration\n• Chloroquine 250mg — malaria prevention\n• Metronidazole — waterborne infections\n• Zinc Tablets — diarrhea in children\n\n**Medium Priority:**\n• Paracetamol — fever management\n• Ciprofloxacin — bacterial infections\n• Antifungal creams — skin infections\n\nStock up at least 2 months before June!",
  "how do i report a medicine shortage": "📝 **Reporting Medicine Shortage (कमी की रिपोर्ट):**\n\n**Step 1:** Go to Orders page → Create New Order\n**Step 2:** Select 'Emergency' priority\n**Step 3:** Add the medicine and required quantity\n**Step 4:** Add notes explaining the shortage\n\n**Also contact:**\n• District Health Officer: 1800-XXX-XXXX\n• State Medical Stores: medstore@rajasthan.gov.in\n• CMHO Office for emergency procurement\n\nFor life-threatening shortages (like Insulin), call the emergency helpline immediately.",
};

function getDemo(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(DEMO_RESPONSES)) {
    if (lower.includes(key.split(" ")[0]) && lower.includes(key.split(" ")[1] || "")) return val;
  }
  return "I'm MediCure Assistant 🤖. I can help with inventory questions, medicine information, and reorder guidance. Please set your REACT_APP_GEMINI_KEY for full AI responses. Try asking about critical medicines or monsoon season stocks!";
}

export default function ChatAssistant({ initialMessage }) {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! 🙏 I'm MediCure Assistant. I can help with medicine inventory, reorder guidance, and supply chain questions. How can I help you today?" }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-open with pre-typed message in demo mode
  useEffect(() => {
    if (initialMessage) {
      setOpen(true);
      setInput(initialMessage);
    }
  }, [initialMessage]);

  const inventoryContext = sampleMedicines.map(m => ({
    name: m.name, currentStock: m.currentStock, minimumStock: m.minimumStock,
    status: getStockStatus(m.currentStock, m.minimumStock),
  }));

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const reply = await chatWithAssistant(newMessages, inventoryContext);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: getDemo(msg) }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Open chat assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">!</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-40 animate-fade-in" style={{ height: "480px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a73e8] to-[#0d47a1] text-white px-4 py-3 rounded-t-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">MediCure Assistant</p>
              <p className="text-xs text-blue-200">Powered by Gemini AI</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                  {m.role === "user" ? <User className="w-3.5 h-3.5 text-blue-600" /> : <Bot className="w-3.5 h-3.5 text-gray-600" />}
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-[#1a73e8] text-white rounded-tr-sm" : "bg-gray-100 text-gray-700 rounded-tl-sm"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTED.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors text-left">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask about medicines..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-9 h-9 bg-[#1a73e8] text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
