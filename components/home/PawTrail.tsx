/**
 * Dois cachorros atravessam o hero e as pegadas somem atrás deles.
 *
 * Substitui as sete patinhas soltas que estavam espalhadas pelo hero. A Ana
 * pediu para tirá-las; isto é a alternativa que o Eduardo sugeriu: em vez de
 * enfeite parado, o rastro de quem acabou de passar.
 *
 * ———————————————————————————————————————————————————————————————————————
 * O que cada rodada de retorno corrigiu, porque nada disso é óbvio de olhar:
 *
 * 1. DIREÇÃO. Na primeira versão os dedos apontavam para cima enquanto a
 *    trilha avançava para a direita — lia como bicho andando de lado. Numa
 *    pegada real os dedos apontam para onde o animal vai, então o giro base é
 *    90°, com variação por pegada para não ficar carimbado.
 *
 * 2. O ZIGUE-ZAGUE. As pegadas subiam e desciam 10% da altura a cada passo, o
 *    que parecia cambaleio. Cachorro andando deixa DUAS linhas de pegada, uma
 *    de cada lado do corpo, separadas por poucos centímetros. A alternância
 *    entre os dois lados é de ~2%.
 *
 * 3. O RITMO. Passo de 0,42s era trote constante. Agora cada cão tem uma
 *    sequência de trechos — passeio, trote, corrida, parada para farejar — e
 *    o intervalo entre as patas muda junto.
 *
 * 4. A FORÇA DA MARCA. A opacidade não é mais fixa: ela sai da velocidade.
 *    Cão passeando mal marca o chão (9%); correndo, crava (até 20%). É o
 *    mesmo motivo de uma pegada na areia ficar mais funda quando se corre.
 *
 * 5. OS CAMINHOS. Não são mais duas linhas paralelas. Cada um tem seus
 *    pontos de passagem, eles se cruzam no meio do caminho e no fim o
 *    segundo entra atrás do primeiro.
 * ———————————————————————————————————————————————————————————————————————
 *
 * O sorteio é com semente fixa: muda de pegada para pegada, mas é sempre o
 * mesmo resultado em toda renderização. Com `Math.random()` o rastro mudaria a
 * cada request e deixaria de ser reproduzível — e aqui o que se quer é a
 * aparência de acaso, não acaso de verdade.
 *
 * É CSS puro: nenhum JavaScript roda por quadro, e com `prefers-reduced-motion`
 * as pegadas ficam paradas e bem discretas.
 *
 * Para tirar as pegadas de vez, basta remover <PawTrail /> do Hero.
 */

/** Sorteio determinístico (mulberry32). Mesma semente, mesmo rastro, sempre. */
function sorteio(semente: number) {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Andar = 'passeio' | 'trote' | 'corrida' | 'parada'

/**
 * Como cada andar se comporta. O passo em x e o intervalo em segundos andam
 * juntos: quem corre cobre mais chão por pata E põe a pata mais rápido. A
 * opacidade vem junto porque é o peso da passada no chão.
 */
const ANDARES: Record<Andar, { passoX: [number, number]; intervalo: [number, number]; pico: [number, number] }> = {
  passeio: { passoX: [5.5, 7.0], intervalo: [0.80, 1.00], pico: [0.09, 0.11] },
  trote:   { passoX: [8.0, 9.5], intervalo: [0.48, 0.62], pico: [0.12, 0.15] },
  corrida: { passoX: [11.0, 13.0], intervalo: [0.26, 0.34], pico: [0.17, 0.20] },
  // parada: o cão para para farejar. Não deixa pegada nova; só gasta tempo,
  // e é o que faz o rastro não ter cadência de metrônomo.
  parada:  { passoX: [0.3, 1.0], intervalo: [1.3, 2.0], pico: [0.09, 0.10] },
}

type Cao = {
  desenho: 'limpa' | 'mao'
  semente: number
  xInicio: number
  /** pontos de passagem verticais, em % da altura — é o que faz o caminho torto */
  caminho: number[]
  /** separação entre a linha de patas da esquerda e a da direita, em % */
  afastamento: number
  tamanho: [number, number]
  /** sequência de andares, na ordem */
  roteiro: Andar[]
  /** atraso antes de este cão entrar em cena */
  atraso: number
}

const CAES: Cao[] = [
  {
    // Entra embaixo à esquerda passeando, acelera no meio e sobe.
    desenho: 'limpa',
    semente: 20261110,
    xInicio: -1,
    caminho: [88, 80, 70, 63, 54, 50],
    afastamento: 2,
    tamanho: [22, 31],
    roteiro: ['passeio', 'passeio', 'passeio', 'trote', 'trote', 'corrida', 'corrida', 'corrida', 'trote', 'passeio'],
    atraso: 0,
  },
  {
    // Entra em cima, desce e cruza o caminho do primeiro no meio; depois sobe
    // de novo e termina atrás dele. Menor e com o traço à mão, para ler como
    // outro bicho.
    desenho: 'mao',
    semente: 777,
    xInicio: 2,
    caminho: [52, 60, 72, 82, 76, 64],
    afastamento: 1.7,
    tamanho: [16, 24],
    roteiro: ['trote', 'trote', 'parada', 'passeio', 'passeio', 'trote', 'corrida', 'corrida', 'trote'],
    atraso: 2.4,
  },
]

/** Posição vertical num ponto da caminhada, interpolando entre os pontos de passagem. */
function alturaEm(caminho: number[], t: number) {
  const n = caminho.length - 1
  const pos = Math.min(Math.max(t, 0), 1) * n
  const i = Math.min(Math.floor(pos), n - 1)
  const f = pos - i
  // suavização: o caminho vira de leve em vez de quebrar em cada ponto
  const s = f * f * (3 - 2 * f)
  return caminho[i] + (caminho[i + 1] - caminho[i]) * s
}

function pegadasDe(c: Cao) {
  const rnd = sorteio(c.semente)
  const entre = ([a, b]: [number, number]) => a + rnd() * (b - a)

  let x = c.xInicio
  let tempo = c.atraso
  const saida: {
    x: number; y: number; giro: number; espelha: number
    tamanho: number; atraso: number; pico: number
  }[] = []

  c.roteiro.forEach((andar, i) => {
    const m = ANDARES[andar]
    x += entre(m.passoX)
    tempo += entre(m.intervalo)

    // parada não deixa pegada nova: o cão está parado farejando
    if (andar === 'parada') return

    const t = c.roteiro.length > 1 ? i / (c.roteiro.length - 1) : 0
    const ladoDireito = saida.length % 2 === 1

    saida.push({
      x,
      y:
        alturaEm(c.caminho, t) +
        (ladoDireito ? -c.afastamento : c.afastamento) +
        (rnd() - 0.5) * 1.6, // tremidinha: pata não cai no milímetro
      // os dedos apontam para a frente, com folga de uns graus para cada lado
      giro: 90 + (ladoDireito ? 5 : -5) + (rnd() - 0.5) * 14,
      espelha: ladoDireito ? 1 : -1,
      tamanho: Math.round(c.tamanho[0] + (c.tamanho[1] - c.tamanho[0]) * t),
      atraso: tempo,
      pico: Number(entre(m.pico).toFixed(3)),
    })
  })

  return saida
}

function Pata({ tamanho, desenho }: { tamanho: number; desenho: 'limpa' | 'mao' }) {
  // Pegada de cão: coxim plantar grande e quatro dedos, os dois do meio mais à
  // frente. No viewBox os dedos ficam em cima — o giro de 90° é o que põe eles
  // apontando para a direção da caminhada.
  const comum = {
    width: tamanho,
    height: tamanho * 1.12,
    viewBox: '0 0 100 112',
    fill: 'currentColor',
    'aria-hidden': true as const,
    focusable: 'false' as const,
  }

  if (desenho === 'mao') {
    // Mesma proporção, contorno irregular de propósito: a página 14 do
    // brandbook descreve os traços do projeto como "feitos à mão,
    // propositalmente imperfeitos".
    return (
      <svg {...comum}>
        <path d="M50 108.5c-9.9.4-19.4-2.8-24.8-9.4-4.4-5.3-4.3-12.1-1.6-18.3 2.4-5.6 6.4-10.3 11.9-13 4.9-2.4 10.4-2.9 15.6-2.6 6 .3 12 1.9 16.6 5.9 4.9 4.2 8.2 10.2 9.3 16.6 1 5.9-.8 12-5.6 15.7-5.6 4.3-13.3 5.3-21.4 5.1Z" />
        <path d="M18.6 65.3c-5.4.3-9.6-4.6-10.8-10.4-1.2-6 .3-12.9 4.5-17 3.9-3.8 9.8-3.4 13.2.8 3.6 4.5 4.4 11.3 2.8 17-1.5 5.4-5.1 9.3-9.7 9.6Z" />
        <path d="M38.2 41.3c-5.3-.2-8.6-5.5-9.2-11.6-.6-6.4 1.5-13.6 6.3-17 4.4-3.1 9.9-1.4 12.5 3.5 2.7 5.2 2.3 12.2-.2 17.6-2.3 5-5.6 7.7-9.4 7.5Z" />
        <path d="M62.4 41c-3.9.3-7.4-2.4-9.6-7.3-2.5-5.4-2.9-12.5-.1-17.6 2.7-4.8 8.2-6.3 12.5-3.1 4.7 3.5 6.7 10.7 6 17.1-.7 6-4 10.5-8.8 10.9Z" />
        <path d="M81.8 65.6c-4.7-.2-8.4-4.1-10-9.5-1.7-5.7-.9-12.6 2.6-17.2 3.4-4.4 9.3-4.8 13.3-1 4.3 4.1 5.8 11.1 4.5 17.1-1.2 5.9-5.4 10.8-10.4 10.6Z" />
      </svg>
    )
  }

  return (
    <svg {...comum}>
      <path d="M50.4 108c-13.8 0-24.6-6.1-27.5-15.9-2.6-8.7 1.6-17 7.6-23.6 4.7-5.2 10.6-9 19.6-9.1 9.3-.1 15.6 3.8 20.4 9.2 6 6.7 10 15 7.3 23.6C74.8 102 64.1 108 50.4 108Z" />
      <ellipse cx="17.5" cy="50.5" rx="11.6" ry="14.8" transform="rotate(-26 17.5 50.5)" />
      <ellipse cx="37.5" cy="25.5" rx="11.2" ry="15.4" transform="rotate(-9 37.5 25.5)" />
      <ellipse cx="62.5" cy="25" rx="11.2" ry="15.4" transform="rotate(9 62.5 25)" />
      <ellipse cx="82.5" cy="51.5" rx="11.6" ry="14.8" transform="rotate(26 82.5 51.5)" />
    </svg>
  )
}

export default function PawTrail() {
  return (
    <div
      className="paw-trail pointer-events-none absolute inset-0 z-0 overflow-hidden text-maya-cream"
      aria-hidden="true"
    >
      {CAES.map((cao, c) =>
        pegadasDe(cao).map((p, i) => (
          <span
            key={`${c}-${i}`}
            className="paw-trail__pegada absolute block"
            style={
              {
                left: `${p.x.toFixed(2)}%`,
                top: `${p.y.toFixed(2)}%`,
                // Giro, espelhamento e pico vão como variáveis porque o
                // `transform` e a `opacity` são da animação. Escritos direto
                // aqui, o keyframe sobrescreveria os três.
                '--giro': `${p.giro.toFixed(1)}deg`,
                '--esp': p.espelha,
                '--pico': p.pico,
                animationDelay: `${p.atraso.toFixed(2)}s`,
              } as React.CSSProperties
            }
          >
            <Pata tamanho={p.tamanho} desenho={cao.desenho} />
          </span>
        ))
      )}
    </div>
  )
}
