import React from "react";
import { AlertTriangle, Info, CheckCircle, Bell } from "lucide-react";
import { formatDate } from "../utils/helpers";

const icons = {
  critical: <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />,
  warning:  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />,
  info:     <Info          className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />,
};

const bgMap = {
  critical: "bg-red-50 border-l-4 border-red-400",
  warning:  "bg-yellow-50 border-l-4 border-yellow-400",
  info:     "bg-blue-50 border-l-4 border-blue-400",
};

export default function AlertsPanel({ alerts, onMarkRead }) {
  const unread = alerts.filter(a => !a.isRead);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Recent Alerts</h3>
          {unread.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
              {unread.length}
            </span>
          )}
        </div>
        {unread.length > 0 && (
          <button
            onClick={() => onMarkRead && onMarkRead("all")}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-gray-50">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <CheckCircle className="w-10 h-10 mb-2" />
            <p className="text-sm">All clear — no alerts</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 ${bgMap[alert.severity] || "bg-gray-50"} ${!alert.isRead ? "opacity-100" : "opacity-60"} cursor-pointer transition-opacity`}
              onClick={() => onMarkRead && onMarkRead(alert.id)}
            >
              <div className="flex gap-2">
                {icons[alert.severity] || icons.info}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }) : ""}
                  </p>
                </div>
                {!alert.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
