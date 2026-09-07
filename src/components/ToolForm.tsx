// src/components/ToolForm.tsx
import React, { useState } from "react";
import { Tool } from "../types/tool";

interface Props { onSave: (tool: Tool) => void; initial?: Partial<Tool>; }

const ToolForm: React.FC<Props> = ({ onSave, initial = {} }) => {
  const [name, setName] = useState(initial.name ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [serial, setSerial] = useState(initial.serial ?? "");
  const [dateExpiry, setDateExpiry] = useState(initial.dateExpiry ?? "");
  const [notes, setNotes] = useState(initial.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const tool: Tool = {
      id: initial.id ?? String(Date.now()),
      name: name.trim(),
      category: category.trim(),
      serial: serial.trim() || undefined,
      status: initial.status ?? "available",
      dateExpiry: dateExpiry || undefined,
      notes: notes.trim() || undefined,
      createdAt: initial.createdAt ?? now,
      updatedAt: now,
    };
    onSave(tool);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Tool name</span>
        <input required value={name} onChange={e => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Torque Wrench" />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Category</span>
        <input value={category} onChange={e => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Hand Tools" />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={serial} onChange={e => setSerial(e.target.value)}
          className="rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Serial number" />
        <input value={""} readOnly className="rounded-md border-transparent bg-gray-50 p-2" aria-hidden />
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Expiration date</span>
        <input type="date" value={dateExpiry} onChange={e => setDateExpiry(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Notes</span>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          rows={3} placeholder="Optional notes" />
      </label>

      <div className="flex gap-2">
        <button type="submit" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Save
        </button>
        <button type="button" onClick={() => { setName(""); setCategory(""); setSerial(""); setDateExpiry(""); setNotes(""); }}
          className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
          Clear
        </button>
      </div>
    </form>
  );
};

export default ToolForm;
