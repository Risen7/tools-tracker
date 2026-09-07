// src/App.tsx
import React, { useMemo, useState } from "react";
import { Tool } from "./types/tool";
import { useLocalStorage } from "./hooks/useLocalStorage";
import ToolForm from "./components/ToolForm";
import ToolList from "./components/ToolList";
import AssignModal from "./components/AssignModal";
import { toolsToCSV } from "./utils/csv";

const STORAGE_KEY = "tools-tracker-v1";

const App: React.FC = () => {
  const [tools, setTools] = useLocalStorage<Tool[]>(STORAGE_KEY, []);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [assigning, setAssigning] = useState<Tool | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Tool["status"]>("all");

  const addOrUpdate = (tool: Tool) => {
    setTools(prev => {
      const exists = prev.find(t => t.id === tool.id);
      if (exists) return prev.map(t => (t.id === tool.id ? { ...t, ...tool } : t));
      return [tool, ...prev];
    });
    setEditing(null);
  };

  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
  };

  const assignTool = (id: string, assignedTo: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, status: "in-use", assignedTo, dateIssued: new Date().toISOString(), updatedAt: new Date().toISOString() } : t));
  };

  const returnTool = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, status: "available", assignedTo: undefined, dateIssued: undefined, updatedAt: new Date().toISOString() } : t));
  };

  const filtered = useMemo(() => {
    return tools.filter(t => {
      if (filter !== "all" && t.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return [t.name, t.category, t.serial, t.assignedTo, t.notes].some(field => (field ?? "").toLowerCase().includes(q));
    });
  }, [tools, query, filter]);

  const exportCSV = () => {
    const csv = toolsToCSV(tools);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tools-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <header>
        <h1>Tools Tracking System</h1>
        <div className="controls">
          <input placeholder="Search tools" value={query} onChange={e => setQuery(e.target.value)} />
          <select value={filter} onChange={e => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="repair">Repair</option>
          </select>
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      </header>

      <section className="left">
        <h2>Add Tool</h2>
        <ToolForm onSave={addOrUpdate} />
      </section>

      <section className="right">
        <h2>Inventory</h2>
        <ToolList
          tools={filtered}
          onEdit={(t) => setEditing(t)}
          onDelete={deleteTool}
          onAssign={(t) => setAssigning(t)}
          onReturn={returnTool}
        />
      </section>

      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Tool</h3>
            <ToolForm initial={editing} onSave={addOrUpdate} />
            <button onClick={() => setEditing(null)}>Close</button>
          </div>
        </div>
      )}

      <AssignModal tool={assigning} onClose={() => setAssigning(null)} onAssign={assignTool} />
    </div>
  );
};

export default App;
