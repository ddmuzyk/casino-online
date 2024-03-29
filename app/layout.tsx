import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Casino Online',
  description: 'You are ready',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
