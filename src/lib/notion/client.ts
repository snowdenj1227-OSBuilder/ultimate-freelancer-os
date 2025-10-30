import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined");
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const DATABASES = {
  INVOICES: process.env.NOTION_DATABASE_INVOICES!,
  CLIENTS: process.env.NOTION_DATABASE_CLIENTS!,
  TIME_LOG: process.env.NOTION_DATABASE_TIME_LOG!,
  EXPENSES: process.env.NOTION_DATABASE_EXPENSES!,
  PROJECTS: process.env.NOTION_DATABASE_PROJECTS!,
  TASKS: process.env.NOTION_DATABASE_TASKS!,
  LEADS: process.env.NOTION_DATABASE_LEADS!,
  ACCOUNTS: process.env.NOTION_DATABASE_ACCOUNTS!,
  RECURRING: process.env.NOTION_DATABASE_RECURRING!,
  REPORTS: process.env.NOTION_DATABASE_REPORTS!,
  SETTINGS: process.env.NOTION_DATABASE_SETTINGS!,
  AUTOMATION_LOG: process.env.NOTION_DATABASE_AUTOMATION_LOG!,
  DASHBOARD: process.env.NOTION_DATABASE_DASHBOARD!,
};