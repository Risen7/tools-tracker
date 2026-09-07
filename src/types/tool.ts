// src/types/tool.ts
export type ToolStatus = "available" | "in-use" | "repair";

export interface Tool {
  id: string;
  name: string;
  category: string;
  serial?: string;
  status: ToolStatus;
  assignedTo?: string;
  dateIssued?: string; // ISO string
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
