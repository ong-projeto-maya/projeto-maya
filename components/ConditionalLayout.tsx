'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import Breadcrumbs from './Breadcrumbs'

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
    <>
      <Header />
      <Breadcrumbs />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
