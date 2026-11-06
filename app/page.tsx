import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import Animals from '@/components/home/Animals'
import HowToHelp from '@/components/home/HowToHelp'
import CampaignsCTA from '@/components/home/CampaignsCTA'
import ScrollReveal from '@/components/ScrollReveal'

const WaveDivider = ({ from, to, flip }: { from: string; to: string; flip?: boolean }) => (
  <div className={`relative h-16 md:h-24 ${from} overflow-hidden`}>
    <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
      className={`absolute ${flip ? 'top-0' : 'bottom-0'} w-full h-full`}>
      <path d={flip
        ? "M0,60 C240,20 480,100 720,50 C960,0 1200,80 1440,40 L1440,0 L0,0 Z"
        : "M0,40 C240,80 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z"
      } fill={to} />
    </svg>
  </div>
)

export default function Home() {
  return (
    <div className="page-transition">
      <Hero />
      <ScrollReveal direction="up">
        <About />
      </ScrollReveal>
      {/* As ondas precisam casar com a cor das duas seções que elas separam.
          O fundo branco saiu em favor do creme (#F4EFE8), e a faixa de
          campanhas passou do azul-claro para o azul escurecido (#3D71A0). */}
      <WaveDivider from="bg-maya-cream" to="#D9D3D3" />
      <ScrollReveal direction="up">
        <Animals />
      </ScrollReveal>
      <WaveDivider from="bg-maya-beige" to="#F4EFE8" />
      <ScrollReveal direction="up">
        <HowToHelp />
      </ScrollReveal>
      <WaveDivider from="bg-maya-cream" to="#3D71A0" />
      <ScrollReveal direction="scale">
        <CampaignsCTA />
      </ScrollReveal>
    </div>
  )
}
