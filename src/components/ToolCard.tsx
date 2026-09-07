// src/components/ToolCard.tsx
import React from "react";
import { Tool } from "../types/tool";

interface Props {
  tool: Tool;
  onEdit: (t: Tool) => void;
  onDelete: (id: string) => void;
  onAssign: (t: Tool) => void;
  onReturn: (id: string) => void;
}

const ToolCard: React.FC<Props> = ({ tool, onEdit, onDelete, onAssign, onReturn }) => {
  const statusColor = tool.status === "available" ? "bg-green-100 text-green-800" :
                      tool.status === "in-use" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{tool.name}</h3>
        <p className="text-sm text-gray-500">{tool.category}{tool.serial && ` • ${tool.serial}`}</p>
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
          ) : (
            <button onClick={() => onReturn(tool.id)} className="ml-2 inline-flex items-center px-2 py-1 bg-green-600 text-white text-sm rounded">Return</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
