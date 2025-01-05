'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const router = useRouter();

  // useEffect(() => {
  //   console.log("RootLayout");
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     router.push("/login");
  //   }
  // }, []);

  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
