export function calculateProfitMargin(revenue: number, expenses: number): number {
  if (revenue === 0) return 0;
  return ((revenue - expenses) / revenue) * 100;
}

export function calculateUtilizationRate(billableHours: number, totalHours: number): number {
  if (totalHours === 0) return 0;
  return (billableHours / totalHours) * 100;
}

export function calculateHourlyRate(totalEarned: number, hoursWorked: number): number {
  if (hoursWorked === 0) return 0;
  return totalEarned / hoursWorked;
}

export function calculateDaysSinceDate(date: string | Date): number {
  const today = new Date();
  const pastDate = new Date(date);
  const diffTime = Math.abs(today.getTime() - pastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}