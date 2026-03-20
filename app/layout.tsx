import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'Joe Esports Platform',
  description: 'Frontend-only esports operations prototype for local offline testing.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
