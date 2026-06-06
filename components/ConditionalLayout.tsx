'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import ScrollProgressBar from './ScrollProgressBar'
import ScrollToTop from './ScrollToTop'
import Breadcrumbs from './Breadcrumbs'
import { DoadorProvider } from '@/contexts/DoadorContext'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Rotas que não devem mostrar header e footer
  const hideLayout = pathname.startsWith('/admin')

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <DoadorProvider>
      <ScrollProgressBar />
      <Header />
      <Breadcrumbs />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </DoadorProvider>
  )
}
