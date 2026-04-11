import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }}>
          {p.name}: <span className="font-bold">{p.value} units</span>
        </p>
      ))}
      {payload[0]?.value > payload[1]?.value && (
        <p className="text-red-500 font-semibold mt-1">
          ⚠ Deficit: {payload[0].value - payload[1].value} units
        </p>
      )}
    </div>
  );
};

export default function PredictionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 70 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="medicine"
          tick={{ fontSize: 10, fill: "#64748b" }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>}
        />
        <Bar dataKey="recommendedOrderQty" name="Recommended Order" fill="#1a73e8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="currentStock"        name="Current Stock"     fill="#34a853" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
