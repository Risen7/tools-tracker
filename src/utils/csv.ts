// src/utils/csv.ts
import { Tool } from "../types/tool";

// Converts the inventory into CSV text for download or export.
export function toolsToCSV(tools: Tool[]) {
  // Define the columns and their order in the exported file.
  const headers = ["id","name","category","serial","status","assignedTo","dateIssued","dateExpiry","notes","createdAt","updatedAt"];
  // Convert each tool into a quoted CSV row, replacing missing values with blanks.
  const rows = tools.map(t => headers.map(h => JSON.stringify((t as any)[h] ?? "")).join(","));
  // Join the header and rows with line breaks.
  return [headers.join(","), ...rows].join("\n");
}
