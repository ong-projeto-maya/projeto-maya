import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Projeto Maya - Brandbook Nov. 2025
        'maya-brown': '#564334',      // Marrom principal (substituiu #5D4037)
        'maya-green': '#B2C09D',      // Verde principal (substituiu olive)
        'maya-blue': '#96B6D3',       // Azul (atualizado)
        'maya-beige': '#D9D3D3',      // Bege principal (atualizado)
        'maya-orange': '#D5934F',     // Laranja (nova cor)
        'maya-sand': '#978062',       // Areia (nova cor)
        'maya-pink': '#DA5F75',       // Rosa urgência (nova cor)
        'maya-pink-light': '#E99797', // Rosa claro (nova cor)
        
        // Aliases para compatibilidade
        'maya-beige-dark': '#978062', // Alias para sand
      },
      fontFamily: {
        'display': ['Caprasimo', 'cursive'],      // Título - conforme brandbook
        'body': ['Nunito', 'sans-serif'],         // Corpo - conforme brandbook
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
export default config
