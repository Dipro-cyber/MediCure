import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";

export default function StockLevelChart({ medicines }) {
  const data = medicines.slice(0, 10).map(m => ({
    name: m.name.split(" ")[0],
    current: m.currentStock,
    minimum: m.minimumStock,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        />
        <Bar dataKey="current" name="Current Stock" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.current < entry.minimum * 0.3 ? "#ea4335" : entry.current < entry.minimum ? "#fbbc04" : "#34a853"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
