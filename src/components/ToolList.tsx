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
  onCalibrationOk: (tool: Tool) => void;
}

const ToolList: React.FC<Props> = ({ tools, onEdit, onDelete, onAssign, onReturn, onCalibrationOk }) => {
  if (tools.length === 0) return <div className="text-gray-500">No tools yet</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map(t => (
        <ToolCard key={t.id} tool={t} onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} onReturn={onReturn} onCalibrationOk={onCalibrationOk} />
      ))}
    </div>
  );
};

export default ToolList;
