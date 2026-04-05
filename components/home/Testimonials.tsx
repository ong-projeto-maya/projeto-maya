'use client'

import { useState, useEffect } from 'react'
import { Heart, Star } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { createClient } from '@/lib/supabase'

interface Testimonial {
  id: number | string
  name: string
  animal: string
  text: string
  rating: number
}

const fallbackTestimonials: Testimonial[] = [
  { id: 1, name: 'Maria Silva', animal: 'Luna', text: 'Adotar a Luna foi a melhor decisão que tomamos! O Projeto Maya nos acompanhou em todo o processo e hoje temos uma família completa. Gratidão eterna!', rating: 5 },
  { id: 2, name: 'João Santos', animal: 'Thor', text: 'O trabalho da ONG é incrível! Resgataram o Thor das ruas e cuidaram dele com tanto carinho. Hoje ele é meu melhor amigo e companheiro de aventuras.', rating: 5 },
  { id: 3, name: 'Ana Oliveira', animal: 'Bob', text: 'Mesmo sendo um cãozinho mais velho, o Bob trouxe tanta alegria para nossa casa. O projeto nos ajudou a entender que amor não tem idade. Recomendo muito!', rating: 5 },
]

export default function Testimonials() {
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 })
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('depoimentos')
      .select('id, nome, animal, texto, avaliacao')
      .eq('aprovado', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setTestimonials(data.map(r => ({
            id: r.id,
            name: r.nome,
            animal: r.animal,
            text: r.texto,
            rating: r.avaliacao ?? 5,
          })))
        }
      })
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-maya-beige to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Histórias de Amor</h2>
          <p className="section-subtitle">
            Veja o que nossos adotantes têm a dizer sobre suas experiências
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className={`card card-hover-lift card-hover-glow scroll-hidden scroll-up ${gridVisible ? 'scroll-visible' : ''} stagger-${index + 1}`}>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-maya-green fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-maya-brown/80 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-maya-beige">
                <div className="w-12 h-12 bg-maya-green rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <div className="font-semibold text-maya-brown">{testimonial.name}</div>
                  <div className="text-sm text-maya-brown/60">Adotou {testimonial.animal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Message */}
        <div className="text-center mt-12">
          <p className="text-maya-brown/70 italic max-w-2xl mx-auto">
            "Cada adoção é uma história de amor que nos motiva a continuar. 
            Obrigado a todos que acreditam no nosso trabalho!"
          </p>
          <p className="text-maya-green font-semibold mt-4">— Equipe Projeto Maya</p>
        </div>
      </div>
    </section>
  )
}
