// src/types/tool.ts
// The workflow states a tool can have.
export type ToolStatus = "available" | "in-use" | "repair" | "for calibration";

// The complete data shape stored for each tool.
export interface Tool {
  // Stable identifier used for updates and deletes.
  id: string;
  // User-facing tool name.
  name: string;
  // Group or classification for the tool.
  category: string;
  // Optional manufacturer or inventory serial number.
  serial?: string;
  // Current workflow status.
  status: ToolStatus;
  // Current borrower, when assigned.
  assignedTo?: string;
  // Time when the tool was issued.
  dateIssued?: string; // ISO string
  // Optional notes shown on the card.
  notes?: string;
  // Time when the tool was first created.
  createdAt: string;
  // Time when the record was last changed.
  updatedAt?: string;
  // Date after which the tool needs calibration.
  dateExpiry?: string;
}
