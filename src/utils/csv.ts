// src/utils/csv.ts
import { Tool } from "../types/tool";

export function toolsToCSV(tools: Tool[]) {
  const headers = ["id","name","category","serial","status","assignedTo","dateIssued","dateExpiry","notes","createdAt","updatedAt"];
  const rows = tools.map(t => headers.map(h => JSON.stringify((t as any)[h] ?? "")).join(","));
  return [headers.join(","), ...rows].join("\n");
}
