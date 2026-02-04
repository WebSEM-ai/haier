import React from 'react'

export const metadata = {
  title: 'Haier România — Admin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
