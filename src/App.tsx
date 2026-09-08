import React, { useEffect, useMemo, useState } from "react";
import AssignModal from "./components/AssignModal";
import ToolForm from "./components/ToolForm";
import ToolList from "./components/ToolList";
import CalibrationModal from "./components/CalibrationModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { toolsToCSV } from "./utils/csv";
import { Tool } from "./types/tool";

// This key identifies the array of tools in the browser's local storage.
const STORAGE_KEY = "tools-tracker-v1";

// Returns true when an expiry date is today or earlier.
const hasReachedExpiry = (dateExpiry?: string) => {
  // Tools without an expiry date are not considered expired.
  if (!dateExpiry) return false;
  // Read the current local date.
  const today = new Date();
  // Format today as YYYY-MM-DD so it can be compared with an HTML date value.
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  // ISO-style dates sort correctly as strings in this format.
  return dateExpiry <= todayKey;
};

// Renders the complete tools tracking application.
const App: React.FC = () => {
  // Load and persist the inventory through the local-storage hook.
  const [tools, setTools] = useLocalStorage<Tool[]>(STORAGE_KEY, []);
  // Track which tool is being edited in the edit modal.
  const [editing, setEditing] = useState<Tool | null>(null);
  // Track which tool is being assigned in the assign modal.
  const [assigning, setAssigning] = useState<Tool | null>(null);
  // Track which tool is having its calibration completed.
  const [calibrating, setCalibrating] = useState<Tool | null>(null);
  // Store the inventory search text.
  const [query, setQuery] = useState("");
  // Store the selected status filter.
  const [filter, setFilter] = useState<"all" | Tool["status"]>("all");

  // Check existing tools whenever the app loads and mark expired tools for calibration.
  useEffect(() => {
    // Update local storage only when at least one tool actually changed.
    setTools(prev => {
      // Track whether the map operation changed any tool.
      let changed = false;
      // Recalculate the status for each existing tool.
      const updated = prev.map(tool => {
        // Expired tools must be calibrated before they can be used again.
        if (hasReachedExpiry(tool.dateExpiry) && tool.status !== "for calibration") {
          changed = true;
          // Preserve the tool data and update its status and modification time.
          return { ...tool, status: "for calibration" as const, updatedAt: new Date().toISOString() };
        }
        // Keep tools that do not need a status change untouched.
        return tool;
      });
      // Returning the old array avoids an unnecessary state update.
      return changed ? updated : prev;
    });
  }, [setTools]);

  // Add a new tool or replace an existing tool after form submission.
  const addOrUpdate = (tool: Tool) => {
    // Expired tools are immediately placed into calibration status.
    const toolToSave = hasReachedExpiry(tool.dateExpiry)
      ? { ...tool, status: "for calibration" as const }
      : tool;
    // Update the matching tool or add a new tool at the start of the list.
    setTools(prev => {
      // Find out whether this tool already exists.
      const exists = prev.find(item => item.id === toolToSave.id);
      // Merge edits into the existing record.
      if (exists) return prev.map(item => item.id === toolToSave.id ? { ...item, ...toolToSave } : item);
      // Add newly created tools before older tools.
      return [toolToSave, ...prev];
    });
    // Close the edit modal after saving.
    setEditing(null);
  };

  // Remove a tool from the inventory by its identifier.
  const deleteTool = (id: string) => {
    // Keep every tool except the one selected for deletion.
    setTools(prev => prev.filter(tool => tool.id !== id));
  };

  // Assign a tool to a borrower and record the issue time.
  const assignTool = (id: string, assignedTo: string) => {
    // Update only the selected tool.
    setTools(prev => prev.map(tool => tool.id === id
      // Expired tools remain in calibration instead of becoming usable.
      ? { ...tool, status: hasReachedExpiry(tool.dateExpiry) ? "for calibration" : "in-use", assignedTo, dateIssued: new Date().toISOString(), updatedAt: new Date().toISOString() }
      // Leave all other tools unchanged.
      : tool));
  };

  // Return a tool and clear its current borrower information.
  const returnTool = (id: string) => {
    // Update only the selected tool and recalculate its usable status.
    setTools(prev => prev.map(tool => tool.id === id
      ? { ...tool, status: hasReachedExpiry(tool.dateExpiry) ? "for calibration" : "available", assignedTo: undefined, dateIssued: undefined, updatedAt: new Date().toISOString() }
      : tool));
  };

  // Finish calibration by saving a new expiry date and making the tool available.
  const calibrationOk = (id: string, dateExpiry: string) => {
    // Update the calibrated tool while clearing old assignment details.
    setTools(prev => prev.map(tool => tool.id === id
      ? { ...tool, status: "available", dateExpiry, assignedTo: undefined, dateIssued: undefined, updatedAt: new Date().toISOString() }
      : tool));
  };

  // Build the visible inventory from the current search text and status filter.
  const filtered = useMemo(() => tools.filter(tool => {
    // Exclude tools that do not match the selected status.
    if (filter !== "all" && tool.status !== filter) return false;
    // When no search text exists, the status-filtered tool is visible.
    if (!query) return true;
    // Normalize the search text for case-insensitive matching.
    const normalizedQuery = query.toLowerCase();
    // Search the main text fields on each tool.
    return [tool.name, tool.category, tool.serial, tool.assignedTo, tool.notes]
      .some(field => (field ?? "").toLowerCase().includes(normalizedQuery));
  }), [tools, query, filter]);

  // Convert the inventory to CSV and download it from the browser.
  const exportCSV = () => {
    // Generate CSV text from the current inventory.
    const csv = toolsToCSV(tools);
    // Create a temporary downloadable file object.
    const blob = new Blob([csv], { type: "text/csv" });
    // Create a temporary browser URL for that file.
    const url = URL.createObjectURL(blob);
    // Create a hidden download link and trigger it.
    const link = document.createElement("a");
    link.href = url;
    link.download = `tools-${new Date().toISOString()}.csv`;
    link.click();
    // Release the temporary URL after starting the download.
    URL.revokeObjectURL(url);
  };

// Render the page layout, inventory controls, forms, cards, and modals.
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
          <ToolList tools={filtered} onEdit={t => setEditing(t)} onDelete={deleteTool} onAssign={t => setAssigning(t)} onReturn={returnTool} onCalibrationOk={t => setCalibrating(t)} />
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
    <CalibrationModal tool={calibrating} onClose={() => setCalibrating(null)} onConfirm={calibrationOk} />
  </div>
);

};

export default App;
