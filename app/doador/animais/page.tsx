'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PawPrint, ArrowLeft, Heart, CheckCircle, Calendar, HeartPulse, Activity, UtensilsCrossed, Home, Sparkles } from 'lucide-react'
import { useDoador } from '@/hooks/useDoador'
import { animals } from '@/data/animals'

export default function AnimaisAjudadosPage() {
  const { doador, isLoading } = useDoador()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !doador) {
      router.push('/doador/login')
    }
  }, [doador, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-maya-olive mx-auto mb-4"></div>
          <p className="text-maya-brown dark:text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!doador) {
    return null
  }

  // Mock - pegar os primeiros N animais baseado no número que ajudou
  const animalsHelped = animals.slice(0, Math.min(doador.animalsHelped, animals.length))

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/doador/dashboard"
            className="inline-flex items-center gap-2 text-maya-olive hover:text-maya-olive-light mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-display font-bold text-maya-brown dark:text-white mb-2">
            Animais que Ajudei
          </h1>
          <p className="text-maya-brown/70 dark:text-gray-300">
            Conheça os animais que suas doações transformaram
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-maya-olive to-maya-olive-light rounded-3xl p-8 mb-12 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">{doador.animalsHelped}</p>
              <p className="text-white/80">Animais Impactados</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">R$ {doador.totalDonated.toLocaleString('pt-BR')}</p>
              <p className="text-white/80">Total Doado</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">{doador.donationCount}</p>
              <p className="text-white/80">Doações Realizadas</p>
            </div>
          </div>
        </div>

        {animalsHelped.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-lg">
            <PawPrint className="w-20 h-20 text-maya-olive/30 mx-auto mb-6" />
            <h3 className="font-display font-bold text-3xl text-maya-brown dark:text-white mb-4">
              Continue Ajudando!
            </h3>
            <p className="text-maya-brown/70 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Suas doações já estão fazendo a diferença. Continue contribuindo para transformar mais vidas!
            </p>
            <Link href="/doacoes" className="btn-primary inline-flex items-center gap-2">
              <Heart size={20} className="fill-white" />
              Fazer Nova Doação
            </Link>
          </div>
        ) : (
          <>
            {/* Impact Timeline */}
            <div className="mb-12">
              <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-6">
                História de Impacto
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="space-y-6">
                  {[
                    { Icon: HeartPulse, title: 'Resgates', desc: `Ajudou a resgatar ${Math.ceil(doador.animalsHelped * 0.3)} animais das ruas` },
                    { Icon: Activity, title: 'Vacinação', desc: `Contribuiu para ${Math.ceil(doador.animalsHelped * 0.5)} animais serem vacinados` },
                    { Icon: UtensilsCrossed, title: 'Alimentação', desc: `Forneceu ${Math.ceil(doador.totalDonated / 50)} semanas de alimentação` },
                    { Icon: Home, title: 'Adoções', desc: `Apoiou ${Math.ceil(doador.animalsHelped * 0.2)} adoções bem-sucedidas` },
                  ].map((item, index) => {
                    const Icon = item.Icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-maya-olive/10 dark:bg-maya-olive/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-maya-olive" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-maya-brown dark:text-white mb-1">{item.title}</h3>
                          <p className="text-maya-brown/70 dark:text-gray-300 text-sm">{item.desc}</p>
                        </div>
                        <CheckCircle className="text-green-500 ml-auto flex-shrink-0" size={24} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Animals Grid */}
            <div>
              <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-6">
                Conheça Quem Você Ajudou
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {animalsHelped.map((animal) => (
                  <div key={animal.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group hover:scale-105 transition-transform duration-300">
                    {/* Image */}
                    <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={animal.image}
                        alt={animal.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {animal.isAdopted && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <CheckCircle size={16} />
                          Adotado
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <Link
                          href={`/adocao/${animal.id}`}
                          className="bg-white text-maya-olive px-6 py-2 rounded-xl font-semibold hover:bg-maya-beige transition-colors"
                        >
                          Ver Perfil
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-2">
                        {animal.name}
                      </h3>
                      <p className="text-maya-brown/60 dark:text-gray-400 text-sm mb-4">
                        {animal.age} • {animal.gender === 'male' ? 'Macho' : 'Fêmea'}
                      </p>
                      
                      {/* Impact Badge */}
                      <div className="bg-maya-olive/10 dark:bg-maya-olive/20 rounded-xl p-3 mb-4">
                        <p className="text-sm text-maya-olive dark:text-maya-olive-light font-medium">
                          <Sparkles size={14} className="inline" /> Sua doação ajudou no resgate e cuidado de {animal.name}
                        </p>
                      </div>

                      {/* Temperament */}
                      <div className="flex flex-wrap gap-2">
                        {animal.temperament.slice(0, 3).map((trait) => (
                          <span
                            key={trait}
                            className="text-xs bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white px-3 py-1 rounded-full"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 bg-gradient-to-br from-maya-blue to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
              <Heart className="w-16 h-16 mx-auto mb-6 fill-white" />
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                Continue Transformando Vidas!
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Há muitos outros animais esperando por ajuda. Sua próxima doação pode salvar mais vidas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/doacoes"
                  className="bg-white text-maya-blue px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Heart size={20} />
                  Fazer Nova Doação
                </Link>
                <Link
                  href="/adocao"
                  className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2 border-2 border-white/30"
                >
                  <PawPrint size={20} />
                  Ver Animais para Adoção
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
