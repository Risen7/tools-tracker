// src/components/ToolList.tsx
import React from "react";
import { Tool } from "../types/tool";
import ToolCard from "./ToolCard";

interface Props {
  tools: Tool[];
  onEdit: (t: Tool) => void;
  onDelete: (id: string) => void;
  onAssign: (t: Tool) => void;
  onReturn: (id: string) => void;
}

const ToolList: React.FC<Props> = ({ tools, onEdit, onDelete, onAssign, onReturn }) => {
  if (tools.length === 0) return <div>No tools yet</div>;
  return (
    <div className="tool-list">
      {tools.map(t => (
        <ToolCard key={t.id} tool={t} onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} onReturn={onReturn} />
      ))}
    </div>
  );
};

export default ToolList;
