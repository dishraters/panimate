import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panimate - Transform Your Voice into Animated Greeting Cards',
  description: 'Create personalized animated greeting cards with your voice. The perfect gift for birthdays, Mother\'s Day, anniversaries and more.',
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
