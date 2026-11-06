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
        // ———————————————————————————————————————————————————————————————
        // CORES DA MARCA — Brandbook Projeto Maya, nov. 2025, página 16.
        // Conferidas amostrando os pixels do PDF. Não alterar sem a Carolina.
        //
        // A proporção importa: o brandbook representa o peso de cada cor pelo
        // tamanho do retângulo. Bege e marrom são as principais; verde e azul
        // vêm em segundo; rosa, laranja e areia são faixas finas.
        // ———————————————————————————————————————————————————————————————
        'maya-brown': '#564334',      // Marrom — principal
        'maya-beige': '#D9D3D3',      // Bege — principal
        'maya-green': '#B2C09D',      // Verde — secundária (olho da Maya)
        'maya-blue': '#96B6D3',       // Azul — secundária (olho da Maya)
        'maya-rosa': '#E99797',       // Rosa — SÓ para urgência (regra do brandbook)
        'maya-orange': '#D5934F',     // Laranja — acento
        'maya-sand': '#978062',       // Areia — acento

        // ———————————————————————————————————————————————————————————————
        // TOKENS DE INTERFACE — não são cores da marca.
        //
        // As cores acima foram desenhadas para papel. Em tela, verde, azul,
        // laranja e rosa são claras demais para servirem de texto: nenhuma
        // passa de 2,6:1 sobre fundo claro. Estes tokens são as MESMAS matizes
        // escurecidas até 4,5:1 sobre o fundo da página (maya-cream), que é o
        // mínimo da norma WCAG AA.
        //
        // Regra: cor da marca em área grande (fundo, faixa, ilustração);
        // token escuro em texto, link, ícone e borda.
        // ———————————————————————————————————————————————————————————————
        'maya-cream': '#F4EFE8',        // Fundo da página (bege aquecido para tela)
        'maya-line': '#DFD5C8',         // Borda e divisor
        'maya-green-dark': '#607344',   // Texto/link verde    — 4,55 sobre creme
        'maya-blue-dark': '#3D71A0',    // Texto/link azul     — 4,51
        'maya-orange-dark': '#9B5F20',  // Texto/link laranja  — 4,53
        'maya-sand-dark': '#7F694C',    // Texto/link areia    — 4,56
        'maya-rosa-dark': '#D22626',    // Urgência            — 4,54
        'maya-orange-light': '#E3A96A', // Destaque sobre marrom — 4,51
        'maya-green-tint': '#E8EBE2',   // Fundo de seção, verde bem claro

        // Aliases mantidos para não quebrar telas antigas
        'maya-pink': '#E99797',         // = maya-rosa (o #DA5F75 anterior não é do brandbook)
        'maya-pink-light': '#E99797',
        'maya-beige-dark': '#978062',   // = maya-sand
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
