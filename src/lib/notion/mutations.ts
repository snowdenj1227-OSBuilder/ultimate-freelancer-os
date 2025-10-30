import { notion, DATABASES } from "./client";

export async function createInvoice(data: {
  invoiceNumber: string;
  clientId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  notes?: string;
}) {
  return await notion.pages.create({
    parent: { database_id: DATABASES.INVOICES },
    properties: {
      "Invoice Number": {
        title: [{ text: { content: data.invoiceNumber } }],
      },
      Client: {
        relation: [{ id: data.clientId }],
      },
      Amount: {
        number: data.amount,
      },
      "Issue Date": {
        date: { start: data.issueDate },
      },
      "Due Date": {
        date: { start: data.dueDate },
      },
      Status: {
        select: { name: data.status },
      },
      Notes: {
        rich_text: [{ text: { content: data.notes || "" } }],
      },
    },
  });
}

export async function createTimeEntry(data: {
  date: string;
  projectId?: string;
  taskId?: string;
  durationHours: number;
  billable: boolean;
  hourlyRate: number;
  entryType: string;
  notes?: string;
}) {
  return await notion.pages.create({
    parent: { database_id: DATABASES.TIME_LOG },
    properties: {
      Date: {
        date: { start: data.date },
      },
      Project: data.projectId
        ? {
            relation: [{ id: data.projectId }],
          }
        : undefined,
      Task: data.taskId
        ? {
            relation: [{ id: data.taskId }],
          }
        : undefined,
      "Duration (hours)": {
        number: data.durationHours,
      },
      Billable: {
        checkbox: data.billable,
      },
      "Hourly Rate": {
        number: data.hourlyRate,
      },
      "Entry Type": {
        select: { name: data.entryType },
      },
      Notes: {
        rich_text: [{ text: { content: data.notes || "" } }],
      },
    },
  });
}

export async function createExpense(data: {
  name: string;
  category: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  projectId?: string;
  taxDeductible: boolean;
  notes?: string;
}) {
  return await notion.pages.create({
    parent: { database_id: DATABASES.EXPENSES },
    properties: {
      "Expense Name": {
        title: [{ text: { content: data.name } }],
      },
      Category: {
        select: { name: data.category },
      },
      Amount: {
        number: data.amount,
      },
      Date: {
        date: { start: data.date },
      },
      "Receipt URL": data.receiptUrl
        ? {
            url: data.receiptUrl,
          }
        : undefined,
      Project: data.projectId
        ? {
            relation: [{ id: data.projectId }],
          }
        : undefined,
      "Tax Deductible": {
        checkbox: data.taxDeductible,
      },
      Notes: {
        rich_text: [{ text: { content: data.notes || "" } }],
      },
    },
  });
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: string,
  stripeSessionId?: string
) {
  const properties: any = {
    Status: {
      select: { name: status },
    },
  };

  if (stripeSessionId) {
    properties["Stripe Session ID"] = {
      rich_text: [{ text: { content: stripeSessionId } }],
    };
  }

  return await notion.pages.update({
    page_id: invoiceId,
    properties,
  });
}