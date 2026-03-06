'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Award, Home as HomeIcon, Clock, Users, Activity, Dog, Cat, ClipboardList } from 'lucide-react'
import { animals } from '@/data/animals'

const questions = [
  {
    id: 'moradia',
    question: 'Onde você mora?',
    icon: HomeIcon,
    options: [
      { text: 'Apartamento pequeno', value: 'apt-small', score: { small: 3, medium: 1, large: 0 } },
      { text: 'Apartamento grande', value: 'apt-large', score: { small: 2, medium: 3, large: 1 } },
      { text: 'Casa com quintal pequeno', value: 'house-small', score: { small: 2, medium: 3, large: 2 } },
      { text: 'Casa com quintal grande', value: 'house-large', score: { small: 3, medium: 3, large: 3 } },
    ]
  },
  {
    id: 'tempo',
    question: 'Quanto tempo você tem disponível por dia?',
    icon: Clock,
    options: [
      { text: 'Menos de 1 hora', value: 'time-1', score: { cat: 3, calm: 3, energetic: 0 } },
      { text: '1-2 horas', value: 'time-2', score: { cat: 2, calm: 2, energetic: 1 } },
      { text: '2-4 horas', value: 'time-4', score: { cat: 1, calm: 2, energetic: 2 } },
      { text: 'Mais de 4 horas', value: 'time-more', score: { cat: 1, calm: 2, energetic: 3 } },
    ]
  },
  {
    id: 'energia',
    question: 'Qual seu nível de energia?',
    icon: Activity,
    options: [
      { text: 'Calmo/tranquilo', value: 'energy-low', score: { calm: 3, energetic: 0, senior: 3 } },
      { text: 'Moderadamente ativo', value: 'energy-med', score: { calm: 2, energetic: 2, senior: 1 } },
      { text: 'Muito ativo', value: 'energy-high', score: { calm: 0, energetic: 3, senior: 0 } },
      { text: 'Super atlético', value: 'energy-ultra', score: { calm: 0, energetic: 3, senior: 0, puppy: 2 } },
    ]
  },
  {
    id: 'experiencia',
    question: 'Tem experiência com pets?',
    icon: Award,
    options: [
      { text: 'Nunca tive', value: 'exp-none', score: { calm: 3, easy: 3 } },
      { text: 'Tive na infância', value: 'exp-child', score: { calm: 2, easy: 2 } },
      { text: 'Já tive vários', value: 'exp-some', score: { calm: 1, easy: 1, any: 3 } },
      { text: 'Sou expert', value: 'exp-expert', score: { any: 3, challenging: 3 } },
    ]
  },
  {
    id: 'familia',
    question: 'Tem crianças em casa?',
    icon: Users,
    options: [
      { text: 'Sim, crianças pequenas (0-6 anos)', value: 'kids-young', score: { calm: 3, gentle: 3 } },
      { text: 'Sim, crianças maiores (7+ anos)', value: 'kids-older', score: { playful: 3, friendly: 3 } },
      { text: 'Não', value: 'kids-none', score: { any: 2 } },
    ]
  }
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<typeof animals[0] | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  const calculateResult = (finalAnswers: Record<string, string>) => {
    // Simple matching algorithm based on pet characteristics
    const scores = animals.map(animal => {
      let score = 0

      // Check size preference
      const moradiaAnswer = finalAnswers['moradia']
      if (moradiaAnswer === 'apt-small' && animal.size === 'small') score += 3
      if (moradiaAnswer === 'house-large' && animal.size === 'large') score += 2

      // Check energy level
      const energiaAnswer = finalAnswers['energia']
      if (energiaAnswer === 'energy-low') {
        if (animal.temperament.some(t => t.toLowerCase().includes('calmo'))) score += 3
        if (!animal.isPuppy) score += 2
      }
      if (energiaAnswer === 'energy-high' || energiaAnswer === 'energy-ultra') {
        if (animal.temperament.some(t => t.toLowerCase().includes('brincalh') || t.toLowerCase().includes('enérgico'))) score += 3
        if (animal.isPuppy) score += 2
      }

      // Check time availability
      const tempoAnswer = finalAnswers['tempo']
      if (tempoAnswer === 'time-1' && animal.type === 'cat') score += 2
      if ((tempoAnswer === 'time-4' || tempoAnswer === 'time-more') && animal.type === 'dog') score += 2

      // Check experience
      const experienciaAnswer = finalAnswers['experiencia']
      if (experienciaAnswer === 'exp-none') {
        if (animal.temperament.some(t => t.toLowerCase().includes('dócil') || t.toLowerCase().includes('calm'))) score += 2
      }

      // Check family
      const familiaAnswer = finalAnswers['familia']
      if (familiaAnswer?.includes('kids')) {
        if (animal.temperament.some(t => t.toLowerCase().includes('carinhoso') || t.toLowerCase().includes('dócil'))) score += 3
      }

      return { animal, score }
    })

    const bestMatch = scores.sort((a, b) => b.score - a.score)[0].animal
    setResult(bestMatch)
    setShowResult(true)
  }

  const restart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
    setShowResult(false)
  }

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <Award className="w-16 h-16 text-maya-green mx-auto mb-4" />
              <h1 className="text-5xl font-display text-maya-brown dark:text-white mb-4">
                Seu Pet Ideal!
              </h1>
              <p className="text-xl text-maya-brown/70 dark:text-gray-300">
                Com base nas suas respostas, achamos o match perfeito!
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden">
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="font-display text-4xl text-maya-brown dark:text-white mb-4">
                Conheça {result.name}!
              </h2>

              <div className="flex justify-center gap-2 mb-4">
                <span className="text-sm bg-maya-green/10 dark:bg-maya-green/20 text-maya-green px-3 py-1 rounded-full inline-flex items-center gap-1">
                  {result.type === 'dog' ? (
                    <>
                      <Dog size={16} />
                      Cachorro
                    </>
                  ) : (
                    <>
                      <Cat size={16} />
                      Gato
                    </>
                  )}
                </span>
                <span className="text-sm bg-maya-blue/10 dark:bg-maya-blue/20 text-maya-blue px-3 py-1 rounded-full">
                  {result.age}
                </span>
                <span className="text-sm bg-maya-green/10 dark:bg-maya-green/20 text-maya-green px-3 py-1 rounded-full">
                  {result.size === 'small' ? 'Pequeno' : result.size === 'medium' ? 'Médio' : 'Grande'}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {result.temperament.map(trait => (
                  <span key={trait} className="text-xs bg-maya-beige dark:bg-gray-700 text-maya-brown dark:text-white px-3 py-1 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>

              <p className="text-maya-brown/80 dark:text-gray-300 leading-relaxed mb-8">
                {result.story}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/adocao/${result.id}`} className="btn-primary inline-flex items-center gap-2">
                  Ver Perfil Completo
                  <ChevronRight size={20} />
                </Link>
                <button onClick={restart} className="btn-outline">
                  Fazer Quiz Novamente
                </button>
              </div>
            </div>

            <p className="text-sm text-maya-brown/60 dark:text-gray-400">
              Lembre-se: este é apenas uma sugestão! Visite nosso abrigo e conheça todos os animais disponíveis.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const Icon = question.icon

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <ClipboardList className="w-16 h-16 text-maya-green mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display text-maya-brown dark:text-white mb-4">
              Qual Pet é Ideal Para Você?
            </h1>
            <p className="text-lg text-maya-brown/70 dark:text-gray-300">
              Responda algumas perguntas e descubra seu match perfeito!
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-maya-brown/60 dark:text-gray-400 mb-2">
              <span>Questão {currentQuestion + 1} de {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-maya-green h-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-maya-green/10 dark:bg-maya-green/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-maya-green" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display text-maya-brown dark:text-white">
                {question.question}
              </h2>
            </div>

            <div className="space-y-4">
              {question.options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="w-full p-6 bg-maya-beige dark:bg-gray-700 hover:bg-maya-green hover:text-white dark:hover:bg-maya-green text-left rounded-2xl transition-all duration-300 group font-semibold text-maya-brown dark:text-white hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Back Button */}
          {currentQuestion > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="text-maya-green hover:underline"
              >
                ← Voltar para questão anterior
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
