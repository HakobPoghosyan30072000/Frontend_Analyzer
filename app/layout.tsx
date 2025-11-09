
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'React Analyzer',
  description: 'Analyze React components easily',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
