import React, { useState } from "react";
import { Tool } from "../types/tool";

interface Props {
  tool: Tool | null;
  onClose: () => void;
  onConfirm: (id: string, dateExpiry: string) => void;
}

const CalibrationModal: React.FC<Props> = ({ tool, onClose, onConfirm }) => {
  const [dateExpiry, setDateExpiry] = useState("");

  if (!tool) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(tool.id, dateExpiry);
    setDateExpiry("");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <h3 className="text-lg font-semibold mb-2">Calibration complete</h3>
        <p className="text-sm text-gray-600 mb-3">Set the new expiry date for {tool.name}.</p>
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">New expiry date</span>
            <input
              required
              type="date"
              value={dateExpiry}
              onChange={e => setDateExpiry(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
            <button type="submit" className="px-3 py-1 rounded bg-green-600 text-white">Save calibration</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalibrationModal;