import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Projeto Maya - ONG de Adoção de Animais',
    short_name: 'Projeto Maya',
    description: 'Do resgate, à adoção. ONG dedicada ao resgate e adoção responsável de animais.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5DC',
    theme_color: '#8FBC8F',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
