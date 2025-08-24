import AboutSection from '@/components/sections/home/AboutSection'
import CTA from '@/components/sections/home/CTA'
import Featured from '@/components/sections/home/Featured'
import Features from '@/components/sections/home/Features'
import Hero from '@/components/sections/home/Hero'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Featured />
      <AboutSection />
      <CTA />
    </>
  )
}
