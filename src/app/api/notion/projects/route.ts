import { NextRequest, NextResponse } from 'next/server';
import { notion, DATABASES } from '@/lib/notion/client';

export async function GET(request: NextRequest) {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.PROJECTS,
    });

    const projects = response.results.map((page: any) => ({
      id: page.id,
      name: page.properties["Project Name"]?.title?.[0]?.plain_text || "",
      clientId: page.properties["Client"]?.relation?.[0]?.id || "",
      status: page.properties["Status"]?.select?.name || "Planning",
      startDate: page.properties["Start Date"]?.date?.start || "",
      endDate: page.properties["End Date"]?.date?.start,
      budget: page.properties["Budget"]?.number || 0,
      totalSpent: page.properties["Total Spent"]?.rollup?.number || 0,
      revenueGenerated: page.properties["Revenue Generated"]?.rollup?.number || 0,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}