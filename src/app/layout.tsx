import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ultimate Freelancer OS',
  description: 'Complete operating system for freelancers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-50 dark:bg-neutral-900">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 transition-all duration-300">
            <div className="min-h-screen">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}