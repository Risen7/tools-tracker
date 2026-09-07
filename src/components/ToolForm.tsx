// src/components/ToolForm.tsx
import React, { useState } from "react";
import { Tool } from "../types/tool";

interface Props {
  onSave: (tool: Tool) => void;
  initial?: Partial<Tool>;
}

const ToolForm: React.FC<Props> = ({ onSave, initial = {} }) => {
  const [name, setName] = useState(initial.name ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [serial, setSerial] = useState(initial.serial ?? "");
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
      notes: notes.trim() || undefined,
      createdAt: initial.createdAt ?? now,
      updatedAt: now,
    };
    onSave(tool);
  };

  return (
    <form onSubmit={handleSubmit} className="tool-form">
      <input required placeholder="Tool name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <input placeholder="Serial number" value={serial} onChange={e => setSerial(e.target.value)} />
      <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
};

export default ToolForm;
