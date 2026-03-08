import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCategories } from '@/lib/payload'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: 'ro_RO',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <html lang="ro">
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.YGC_WIDGET_ID = "1dacb1c9-697f-4bca-a611-9f160653aab9";
              (function() {
                var script = document.createElement('script');
                script.src = "https://widget.yourgpt.ai/script.js";
                script.id = 'yourgpt-chatbot';
                document.body.appendChild(script);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
