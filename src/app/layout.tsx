import type { Metadata } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.changelogdev.com'),
  title: 'Changelog.dev — Beautiful hosted changelogs',
  description:
    'Connect GitHub, AI drafts changelog entries, your customers stay informed.',
  openGraph: {
    title: 'Changelog.dev',
    description: 'Beautiful hosted changelogs your customers actually read',
    type: 'website',
    url: 'https://www.changelogdev.com',
    images: [
      {
        url: 'https://www.changelogdev.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Changelog.dev — Beautiful hosted changelogs your customers actually read',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog.dev',
    description: 'Beautiful hosted changelogs your customers actually read',
    images: ['https://www.changelogdev.com/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-geist-sans)] antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  )
}
