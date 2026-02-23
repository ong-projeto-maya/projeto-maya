'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Adoção',
    questions: [
      {
        q: 'Quais são os requisitos para adotar?',
        a: 'Você deve ser maior de 18 anos, ter um lar adequado para o pet, condições financeiras para mantê-lo e disposição para cuidar dele por toda a vida. Fazemos uma entrevista prévia e visita ao lar.'
      },
      {
        q: 'Quanto custa para adotar?',
        a: 'A adoção é gratuita! Nossos animais já vêm vacinados, vermifugados e castrados (quando apropriado pela idade). Você só precisa estar preparado para os custos de manutenção do pet (ração, veterinário, etc).'
      },
      {
        q: 'Posso conhecer o animal antes de adotar?',
        a: 'Sim! Incentivamos visitas para conhecer o pet antes da adoção. Entre em contato pelo WhatsApp para agendar.'
      },
      {
        q: 'Quanto tempo demora o processo de adoção?',
        a: 'Geralmente de 3 a 7 dias. Fazemos uma breve entrevista, visita ao lar e acompanhamento inicial para garantir que tudo dê certo.'
      },
      {
        q: 'Posso adotar se morar em apartamento?',
        a: 'Sim! Muitos dos nossos pets se adaptam bem a apartamentos. Vamos te ajudar a escolher um animal compatível com seu espaço.'
      },
    ]
  },
  {
    category: 'Doações',
    questions: [
      {
        q: 'Como posso fazer uma doação?',
        a: 'Acesse nossa página de doações e escolha entre doação única ou mensal. Aceitamos cartão de crédito via Stripe de forma segura.'
      },
      {
        q: 'Minha doação é segura?',
        a: 'Sim! Usamos o Stripe, uma das plataformas de pagamento mais seguras do mundo. Seus dados são criptografados e nunca armazenamos informações do seu cartão.'
      },
      {
        q: 'Posso cancelar minha doação mensal?',
        a: 'Sim, você pode cancelar a qualquer momento, sem burocracias. Basta entrar em contato conosco por email ou WhatsApp.'
      },
      {
        q: 'Para onde vai minha doação?',
        a: '100% das doações vão para cuidados com os animais: ração, veterinário, medicamentos, vacinas, castrações e manutenção do abrigo.'
      },
      {
        q: 'Posso apadrinhar um animal específico?',
        a: 'Sim! Entre em contato pelo WhatsApp informando qual animal você gostaria de apadrinhar. Você receberá atualizações regulares sobre seu afilhado.'
      },
    ]
  },
  {
    category: 'Voluntariado',
    questions: [
      {
        q: 'Como posso ser voluntário?',
        a: 'Entre em contato pelo WhatsApp! Temos diversas formas de ajudar: passear com os animais, ajudar em eventos, transporte, fotografia, marketing, etc.'
      },
      {
        q: 'Preciso ter experiência com animais?',
        a: 'Não necessariamente! Temos atividades para todos os perfis. Você pode ajudar de acordo com suas habilidades e disponibilidade.'
      },
      {
        q: 'Quanto tempo preciso dedicar?',
        a: 'Você escolhe! Aceitamos voluntários disponíveis uma vez por semana, quinzenalmente ou até pontualmente para eventos específicos.'
      },
    ]
  },
  {
    category: 'Cuidados',
    questions: [
      {
        q: 'Os animais já vêm vacinados?',
        a: 'Sim! Todos os nossos animais são vacinados, vermifugados e passam por avaliação veterinária antes da adoção.'
      },
      {
        q: 'Os animais são castrados?',
        a: 'Sim, quando apropriado pela idade. Filhotes muito novos são entregues com compromisso de castração futura, que acompanhamos.'
      },
      {
        q: 'E se o animal ficar doente após a adoção?',
        a: 'Oferecemos suporte e orientação! Temos parcerias com veterinários e estamos disponíveis para ajudar no que for necessário.'
      },
      {
        q: 'Fazem acompanhamento pós-adoção?',
        a: 'Sim! Fazemos visitas e mantemos contato nos primeiros meses para garantir que a adaptação está indo bem.'
      },
    ]
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleQuestion = (category: string, index: number) => {
    const key = `${category}-${index}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-maya-olive rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown dark:text-white mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Tire suas dúvidas sobre adoção, doações, voluntariado e muito mais
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((category) => (
            <div key={category.category} className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
              <h2 className="font-display font-bold text-3xl text-maya-brown dark:text-white mb-6">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const key = `${category.category}-${index}`
                  const isOpen = openIndex === key

                  return (
                    <div
                      key={index}
                      className="border-b border-maya-beige dark:border-gray-700 last:border-0 pb-4 last:pb-0"
                    >
                      <button
                        onClick={() => toggleQuestion(category.category, index)}
                        className="w-full flex items-center justify-between text-left py-4 group"
                      >
                        <span className="font-semibold text-lg text-maya-brown dark:text-white group-hover:text-maya-olive transition-colors pr-4">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-6 h-6 text-maya-olive flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-maya-brown/40 dark:text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="pb-4 text-maya-brown/80 dark:text-gray-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-maya-olive to-maya-olive-light text-white rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nossa equipe está pronta para ajudar! Entre em contato por WhatsApp ou email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20o%20Projeto%20Maya"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-maya-olive hover:bg-maya-beige font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
            >
              WhatsApp
            </a>
            <a
              href="mailto:contato@projetomaya.org"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border-2 border-white inline-block"
            >
              Email
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-maya-brown/60 dark:text-gray-400 mb-4">Ou explore:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/adocao" className="text-maya-olive hover:underline font-semibold">
              Ver Animais para Adoção
            </Link>
            <Link href="/doacoes" className="text-maya-olive hover:underline font-semibold">
              Fazer uma Doação
            </Link>
            <Link href="/#sobre" className="text-maya-olive hover:underline font-semibold">
              Sobre o Projeto
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
