import React, { useEffect, useMemo, useState } from "react";
import AssignModal from "./components/AssignModal";
import ToolForm from "./components/ToolForm";
import ToolList from "./components/ToolList";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { toolsToCSV } from "./utils/csv";
import { Tool } from "./types/tool";

const STORAGE_KEY = "tools-tracker-v1";

const hasReachedExpiry = (dateExpiry?: string) => {
  if (!dateExpiry) return false;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return dateExpiry <= todayKey;
};

const App: React.FC = () => {
  const [tools, setTools] = useLocalStorage<Tool[]>(STORAGE_KEY, []);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [assigning, setAssigning] = useState<Tool | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Tool["status"]>("all");

  useEffect(() => {
    setTools(prev => {
      let changed = false;
      const updated = prev.map(tool => {
        if (hasReachedExpiry(tool.dateExpiry) && tool.status !== "for calibration") {
          changed = true;
          return { ...tool, status: "for calibration" as const, updatedAt: new Date().toISOString() };
        }
        return tool;
      });
      return changed ? updated : prev;
    });
  }, [setTools]);

  const addOrUpdate = (tool: Tool) => {
    const toolToSave = hasReachedExpiry(tool.dateExpiry)
      ? { ...tool, status: "for calibration" as const }
      : tool;
    setTools(prev => {
      const exists = prev.find(item => item.id === toolToSave.id);
      if (exists) return prev.map(item => item.id === toolToSave.id ? { ...item, ...toolToSave } : item);
      return [toolToSave, ...prev];
    });
    setEditing(null);
  };

  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  };

  const assignTool = (id: string, assignedTo: string) => {
    setTools(prev => prev.map(tool => tool.id === id
      ? { ...tool, status: hasReachedExpiry(tool.dateExpiry) ? "for calibration" : "in-use", assignedTo, dateIssued: new Date().toISOString(), updatedAt: new Date().toISOString() }
      : tool));
  };

  const returnTool = (id: string) => {
    setTools(prev => prev.map(tool => tool.id === id
      ? { ...tool, status: hasReachedExpiry(tool.dateExpiry) ? "for calibration" : "available", assignedTo: undefined, dateIssued: undefined, updatedAt: new Date().toISOString() }
      : tool));
  };

  const filtered = useMemo(() => tools.filter(tool => {
    if (filter !== "all" && tool.status !== filter) return false;
    if (!query) return true;
    const normalizedQuery = query.toLowerCase();
    return [tool.name, tool.category, tool.serial, tool.assignedTo, tool.notes]
      .some(field => (field ?? "").toLowerCase().includes(normalizedQuery));
  }), [tools, query, filter]);

  const exportCSV = () => {
    const csv = toolsToCSV(tools);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tools-${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tools Tracking System</h1>
        <div className="flex gap-2 items-center">
          <input className="rounded-md border-gray-300 p-2 w-48 md:w-64" placeholder="Search tools" value={query} onChange={e => setQuery(e.target.value)} />
          <select className="rounded-md border-gray-300 p-2" value={filter} onChange={e => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="repair">Repair</option>
            <option value="for calibration">For Calibration</option>
          </select>
          <button onClick={exportCSV} className="px-3 py-2 bg-gray-800 text-white rounded-md">Export CSV</button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1">
          <h2 className="text-lg font-medium mb-3">Add Tool</h2>
          <ToolForm onSave={addOrUpdate} />
        </aside>

        <section className="md:col-span-2">
          <h2 className="text-lg font-medium mb-3">Inventory</h2>
          <ToolList tools={filtered} onEdit={t => setEditing(t)} onDelete={deleteTool} onAssign={t => setAssigning(t)} onReturn={returnTool} />
        </section>
      </main>
    </div>

    {editing && (
      <div className="modal-backdrop">
        <div className="modal-panel">
          <h3 className="text-lg font-semibold mb-2">Edit Tool</h3>
          <ToolForm initial={editing} onSave={addOrUpdate} />
          <div className="mt-3 text-right">
            <button onClick={() => setEditing(null)} className="px-3 py-1 rounded border">Close</button>
          </div>
        </div>
      </div>
    )}

    <AssignModal tool={assigning} onClose={() => setAssigning(null)} onAssign={assignTool} />
  </div>
);

};

export default App;
