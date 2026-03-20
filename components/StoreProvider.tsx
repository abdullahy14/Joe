'use client';

import { useEffect, useState } from 'react';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="boot-screen">Loading esports control room…</div>;
  }

  return <>{children}</>;
}
