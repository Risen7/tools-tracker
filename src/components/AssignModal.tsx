// src/components/AssignModal.tsx
import React, { useState, useEffect } from "react";
import { Tool } from "../types/tool";

interface Props { tool: Tool | null; onClose: () => void; onAssign: (id: string, assignedTo: string) => void; }

const AssignModal: React.FC<Props> = ({ tool, onClose, onAssign }) => {
  const [name, setName] = useState("");
  useEffect(() => { if (tool) setName(""); }, [tool]);
  if (!tool) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(tool.id, name.trim());
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <h3 className="text-lg font-semibold mb-2">Assign {tool.name}</h3>
        <form onSubmit={submit} className="space-y-3">
          <input required value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Borrower name" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
            <button type="submit" className="px-3 py-1 rounded bg-indigo-600 text-white">Assign</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignModal;
