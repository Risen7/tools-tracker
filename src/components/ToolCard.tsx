// src/components/ToolCard.tsx
import React from "react";
import { Tool } from "../types/tool";

interface Props {
  // The tool record displayed by this card.
  tool: Tool;
  // Open the edit form for this tool.
  onEdit: (t: Tool) => void;
  // Delete this tool from the inventory.
  onDelete: (id: string) => void;
  // Open the assignment dialog for this tool.
  onAssign: (t: Tool) => void;
  // Return this tool to the inventory.
  onReturn: (id: string) => void;
  // Open the calibration completion dialog.
  onCalibrationOk: (tool: Tool) => void;
}

// Displays one tool's details, status, expiry alert, and available actions.
const ToolCard: React.FC<Props> = ({ tool, onEdit, onDelete, onAssign, onReturn, onCalibrationOk }) => {
  // Choose a badge color based on the tool's current status.
  const statusColor = tool.status === "available" ? "bg-green-100 text-green-800" :
                      tool.status === "in-use" ? "bg-yellow-100 text-yellow-800" :
                      tool.status === "for calibration" ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800";
  // Get today's local date for the expiry comparison.
  const today = new Date();
  // Format today's date to match the stored YYYY-MM-DD value.
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  // Mark the card as expired when an expiry date exists and has been reached.
  const isExpired = Boolean(tool.dateExpiry && tool.dateExpiry <= todayKey);

  // Render the card and its conditional actions.
  return (
    <div className={`p-4 rounded-lg shadow-sm flex flex-col justify-between h-full border-l-4 ${isExpired ? "bg-red-50 border-red-500" : "bg-white border-transparent"}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{tool.name}</h3>
        <p className="text-sm text-gray-500">{tool.category}{tool.serial && ` • ${tool.serial}`}</p>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Borrower:</span> {tool.assignedTo || "Unassigned"}
        </p>
        <p className={`text-sm ${isExpired ? "font-semibold text-red-700" : "text-gray-600"}`}>
          <span className="font-medium">Expiration:</span> {tool.dateExpiry || "Not set"}
          {isExpired && <span className="ml-2 uppercase tracking-wide">Expired</span>}
        </p>
        {tool.notes && <p className="mt-2 text-sm text-gray-600">{tool.notes}</p>}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${statusColor}`}>
          {tool.status.replace("-", " ")}
        </span>

        <div className="flex gap-2">
          <button onClick={() => onEdit(tool)} className="text-indigo-600 hover:underline text-sm">Edit</button>
          <button onClick={() => onDelete(tool.id)} className="text-red-600 hover:underline text-sm">Delete</button>
          {tool.status === "available" ? (
            <button onClick={() => onAssign(tool)} className="ml-2 inline-flex items-center px-2 py-1 bg-indigo-600 text-white text-sm rounded">Assign</button>
          ) : tool.status === "for calibration" ? (
            <button onClick={() => onCalibrationOk(tool)} className="ml-2 inline-flex items-center px-2 py-1 bg-green-600 text-white text-sm rounded">Calibration OK</button>
          ) : (
            <button onClick={() => onReturn(tool.id)} className="ml-2 inline-flex items-center px-2 py-1 bg-green-600 text-white text-sm rounded">Return</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
