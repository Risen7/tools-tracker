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
  return (
    <div className="tool-card">
      <h3>{tool.name}</h3>
      <div>{tool.category} {tool.serial && `• ${tool.serial}`}</div>
      <div>Status: <strong>{tool.status}</strong></div>
      {tool.assignedTo && <div>Assigned to: {tool.assignedTo}</div>}
      <div className="actions">
        <button onClick={() => onEdit(tool)}>Edit</button>
        <button onClick={() => onDelete(tool.id)}>Delete</button>
        {tool.status === "available" ? (
          <button onClick={() => onAssign(tool)}>Assign</button>
        ) : (
          <button onClick={() => onReturn(tool.id)}>Return</button>
        )}
      </div>
    </div>
  );
};

export default ToolCard;
