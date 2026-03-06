import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import Animals from '@/components/home/Animals'
import HowToHelp from '@/components/home/HowToHelp'
import CampaignsCTA from '@/components/home/CampaignsCTA'
import Testimonials from '@/components/home/Testimonials'
import DoadorCTA from '@/components/home/DoadorCTA'
import CTAFinal from '@/components/home/CTAFinal'
import NewsletterSignup from '@/components/NewsletterSignup'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Animals />
      <HowToHelp />
      <CampaignsCTA />
      <Testimonials />
      <DoadorCTA />
      <NewsletterSignup />
      <CTAFinal />
    </>
  )
}
