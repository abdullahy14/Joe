import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';
import { StoreProvider } from '@/components/StoreProvider';

export const metadata = {
  title: 'Esports Nexus',
  description: 'Offline esports platform prototype built with Next.js and Zustand.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <LayoutShell>{children}</LayoutShell>
        </StoreProvider>
      </body>
    </html>
  );
}
