"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { AppProvider } from '@/context/app-context';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>GreenBalcony - Smart Planting Assistant</title>
        <meta name="description" content="Transform your balcony into a thriving garden with AI-powered plant recommendations" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://unpkg.com/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Fira Sans Condensed', sans-serif" }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
