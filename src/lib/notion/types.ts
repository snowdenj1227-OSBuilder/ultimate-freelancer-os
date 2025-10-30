export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  notes?: string;
  stripeSessionId?: string;
  pdfUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  website?: string;
  relationship: "Active" | "Inactive" | "Prospect" | "Former";
  lifetimeRevenue: number;
  onTimePaymentPercent?: number;
  totalProjects?: number;
  notes?: string;
  createdDate: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  projectId?: string;
  taskId?: string;
  durationHours: number;
  billable: boolean;
  hourlyRate: number;
  entryType: "Timer" | "Manual" | "Imported";
  notes?: string;
  amountEarned: number;
  createdDate: string;
}

export interface Expense {
  id: string;
  name: string;
  category: "Software" | "Hardware" | "Travel" | "Meal" | "Other";
  amount: number;
  date: string;
  receiptUrl?: string;
  projectId?: string;
  taxDeductible: boolean;
  notes?: string;
  createdDate: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  startDate: string;
  endDate?: string;
  budget: number;
  totalSpent: number;
  totalTimeLogged: number;
  revenueGenerated: number;
  profit: number;
  profitMarginPercent?: number;
  description?: string;
  createdDate: string;
}

export interface Task {
  id: string;
  name: string;
  projectId: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  timeLogged?: number;
  description?: string;
  createdDate: string;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  status: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Won" | "Lost";
  stage: "Initial Interest" | "Discovery" | "Proposal" | "Negotiation" | "Closed";
  potentialValue: number;
  source: "Referral" | "Website" | "LinkedIn" | "Cold Outreach" | "Event";
  conversionDate?: string;
  notes?: string;
  createdDate: string;
}

export interface Setting {
  id: string;
  settingName: string;
  settingKey: string;
  settingValue: string;
  type: "Theme" | "Color" | "Font" | "Widget" | "Integration" | "Other";
  description?: string;
}