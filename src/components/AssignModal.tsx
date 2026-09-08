// src/components/AssignModal.tsx
import React, { useState, useEffect } from "react";
import { Tool } from "../types/tool";

interface Props {
  // The tool being assigned, or null when the dialog is closed.
  tool: Tool | null;
  // Close the assignment dialog.
  onClose: () => void;
  // Save the borrower name for the selected tool.
  onAssign: (id: string, assignedTo: string) => void;
}

// Displays a form for assigning a tool to a borrower.
const AssignModal: React.FC<Props> = ({ tool, onClose, onAssign }) => {
  // Store the borrower's name while the dialog is open.
  const [name, setName] = useState("");
  // Clear the previous borrower's name whenever a new tool is selected.
  useEffect(() => { if (tool) setName(""); }, [tool]);
  // Render nothing when no tool is selected.
  if (!tool) return null;

  // Submit the borrower name and close the dialog.
  const submit = (e: React.FormEvent) => {
    // Prevent a full-page form submission.
    e.preventDefault();
    // Pass the trimmed borrower name to App.
    onAssign(tool.id, name.trim());
    // Close the dialog after assignment.
    onClose();
  };

  // Render the borrower input and modal actions.
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
