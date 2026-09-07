// src/components/AssignModal.tsx
import React, { useState } from "react";
import { Tool } from "../types/tool";

interface Props {
  tool: Tool | null;
  onClose: () => void;
  onAssign: (id: string, assignedTo: string) => void;
}

const AssignModal: React.FC<Props> = ({ tool, onClose, onAssign }) => {
  const [name, setName] = useState("");
  if (!tool) return null;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(tool.id, name.trim());
    onClose();
  };
  return (
    <div className="modal">
      <form onSubmit={submit} className="modal-content">
        <h3>Assign {tool.name}</h3>
        <input required placeholder="Borrower name" value={name} onChange={e => setName(e.target.value)} />
        <div className="modal-actions">
          <button type="submit">Assign</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AssignModal;
