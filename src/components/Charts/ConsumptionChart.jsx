import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { COLORS } from "../../utils/constants";

export default function ConsumptionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="paracetamol"  name="Paracetamol"   stroke={COLORS.primary}  strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="ors"           name="ORS Sachets"   stroke={COLORS.success}  strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="antibiotics"   name="Antibiotics"   stroke={COLORS.warning}  strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="antimalarial"  name="Anti-malarial" stroke={COLORS.danger}   strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="vaccines"      name="Vaccines"      stroke={COLORS.purple}   strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
