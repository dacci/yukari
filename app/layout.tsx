import type { Metadata } from 'next';
import { ReactNode } from 'react';
import ThemeRegistry from '@/component/ThemeRegistry';

export const metadata: Metadata = {
  title: {
    default: 'Yukari',
    template: '%s | Yukari',
  },
  description: 'Yukari',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeRegistry options={{ key: 'mui', prepend: true }}>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
