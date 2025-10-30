import { notion, DATABASES } from "./client";
import { Invoice, Client, TimeEntry, Expense, Project, Setting } from "./types";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export async function getInvoices(): Promise<Invoice[]> {
  const response = await notion.databases.query({
    database_id: DATABASES.INVOICES,
  });

  return response.results.map((page: any) => ({
    id: page.id,
    invoiceNumber: page.properties["Invoice Number"]?.title?.[0]?.plain_text || "",
    clientId: page.properties["Client"]?.relation?.[0]?.id || "",
    clientName: page.properties["Client"]?.relation?.[0]?.id || "",
    amount: page.properties["Amount"]?.number || 0,
    issueDate: page.properties["Issue Date"]?.date?.start || "",
    dueDate: page.properties["Due Date"]?.date?.start || "",
    paidDate: page.properties["Paid Date"]?.date?.start,
    status: page.properties["Status"]?.select?.name || "Draft",
    notes: page.properties["Notes"]?.rich_text?.[0]?.plain_text,
    stripeSessionId: page.properties["Stripe Session ID"]?.rich_text?.[0]?.plain_text,
    pdfUrl: page.properties["PDF URL"]?.url,
  }));
}

export async function getClients(): Promise<Client[]> {
  const response = await notion.databases.query({
    database_id: DATABASES.CLIENTS,
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties["Client Name"]?.title?.[0]?.plain_text || "",
    email: page.properties["Email"]?.email || "",
    phone: page.properties["Phone"]?.phone_number,
    company: page.properties["Company"]?.rich_text?.[0]?.plain_text,
    address: page.properties["Address"]?.rich_text?.[0]?.plain_text,
    website: page.properties["Website"]?.url,
    relationship: page.properties["Relationship"]?.select?.name || "Active",
    lifetimeRevenue: page.properties["Lifetime Revenue"]?.rollup?.number || 0,
    onTimePaymentPercent: page.properties["On-Time Payment %"]?.formula?.number,
    totalProjects: page.properties["Total Projects"]?.rollup?.number,
    notes: page.properties["Notes"]?.rich_text?.[0]?.plain_text,
    createdDate: page.properties["Created Date"]?.date?.start || new Date().toISOString(),
  }));
}

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const response = await notion.databases.query({
    database_id: DATABASES.TIME_LOG,
  });

  return response.results.map((page: any) => ({
    id: page.id,
    date: page.properties["Date"]?.date?.start || "",
    projectId: page.properties["Project"]?.relation?.[0]?.id,
    taskId: page.properties["Task"]?.relation?.[0]?.id,
    durationHours: page.properties["Duration (hours)"]?.number || 0,
    billable: page.properties["Billable"]?.checkbox || false,
    hourlyRate: page.properties["Hourly Rate"]?.number || 0,
    entryType: page.properties["Entry Type"]?.select?.name || "Manual",
    notes: page.properties["Notes"]?.rich_text?.[0]?.plain_text,
    amountEarned: page.properties["Amount Earned"]?.formula?.number || 0,
    createdDate: page.properties["Created Date"]?.date?.start || new Date().toISOString(),
  }));
}

export async function getExpenses(): Promise<Expense[]> {
  const response = await notion.databases.query({
    database_id: DATABASES.EXPENSES,
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties["Expense Name"]?.title?.[0]?.plain_text || "",
    category: page.properties["Category"]?.select?.name || "Other",
    amount: page.properties["Amount"]?.number || 0,
    date: page.properties["Date"]?.date?.start || "",
    receiptUrl: page.properties["Receipt URL"]?.url,
    projectId: page.properties["Project"]?.relation?.[0]?.id,
    taxDeductible: page.properties["Tax Deductible"]?.checkbox || false,
    notes: page.properties["Notes"]?.rich_text?.[0]?.plain_text,
    createdDate: page.properties["Created Date"]?.date?.start || new Date().toISOString(),
  }));
}

export async function getSettings(): Promise<Setting[]> {
  const response = await notion.databases.query({
    database_id: DATABASES.SETTINGS,
  });

  return response.results.map((page: any) => ({
    id: page.id,
    settingName: page.properties["Setting Name"]?.title?.[0]?.plain_text || "",
    settingKey: page.properties["Setting Key"]?.rich_text?.[0]?.plain_text || "",
    settingValue: page.properties["Setting Value"]?.rich_text?.[0]?.plain_text || "",
    type: page.properties["Type"]?.select?.name || "Other",
    description: page.properties["Description"]?.rich_text?.[0]?.plain_text,
  }));
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: invoiceId });
    const properties = (page as any).properties;

    return {
      id: page.id,
      invoiceNumber: properties["Invoice Number"]?.title?.[0]?.plain_text || "",
      clientId: properties["Client"]?.relation?.[0]?.id || "",
      clientName: properties["Client"]?.relation?.[0]?.id || "",
      amount: properties["Amount"]?.number || 0,
      issueDate: properties["Issue Date"]?.date?.start || "",
      dueDate: properties["Due Date"]?.date?.start || "",
      paidDate: properties["Paid Date"]?.date?.start,
      status: properties["Status"]?.select?.name || "Draft",
      notes: properties["Notes"]?.rich_text?.[0]?.plain_text,
      stripeSessionId: properties["Stripe Session ID"]?.rich_text?.[0]?.plain_text,
      pdfUrl: properties["PDF URL"]?.url,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}