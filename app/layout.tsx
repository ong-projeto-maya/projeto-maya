import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  // Without this, the relative image paths below (/logo.png) are resolved
  // against http://localhost:3000, so the WhatsApp and Facebook link previews
  // point at an image nobody can load. Next warns about it on every build.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://projetomaya.org'),
  title: 'Projeto Maya - Do resgate, à adoção',
  description: 'ONG dedicada ao resgate e adoção responsável de animais. Venha fazer parte dessa causa!',
  keywords: 'adoção, animais, ong, cachorros, gatos, resgate, adoção responsável, animais abandonados, doação',
  authors: [{ name: 'Projeto Maya' }],
  creator: 'Projeto Maya',
  publisher: 'Projeto Maya',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://projetomaya.org',
    title: 'Projeto Maya - Do resgate, à adoção',
    description: 'ONG dedicada ao resgate e adoção responsável de animais. Cada doação transforma vidas.',
    siteName: 'Projeto Maya',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Projeto Maya - ONG de Adoção de Animais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projeto Maya - Do resgate, à adoção',
    description: 'ONG dedicada ao resgate e adoção responsável de animais. Cada doação transforma vidas.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/*
          Inicialização do modo escuro — JS puro, sem entrada do usuário.

          O modo escuro vale apenas em /admin e /doador, onde as telas foram
          de fato construídas para ele (mais de cem regras `dark:` por página).
          O site público nunca teve nenhuma: ligar o escuro ali deixava o
          cabeçalho preto e o resto claro, com texto marrom sobre fundo quase
          preto (1,57:1). A marca também é de luz quente — tons terrosos e
          fundo sólido claro atrás do animal.

          Por isso a classe só entra nessas rotas, e nem a preferência do
          sistema operacional a aplica no site público.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var p = window.location.pathname;
                  var permite = p.indexOf('/admin') === 0 || p.indexOf('/doador') === 0;
                  if (!permite) {
                    document.documentElement.classList.remove('dark');
                    return;
                  }

                  var stored = localStorage.getItem('maya_dark_mode');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored !== null ? stored === 'true' : prefersDark;

                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Error initializing dark mode:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-maya-cream dark:bg-gray-900 text-maya-brown dark:text-gray-100 transition-colors duration-200">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
