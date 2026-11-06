'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, DollarSign, Check, Lock, Copy, ExternalLink } from 'lucide-react'
import { DOACOES_MENSAIS, DADOS_PIX, linkMensalPara } from '@/lib/pagbank-links'

type DonationType = 'single' | 'monthly'

export default function DoacoesPage() {
  const [donationType, setDonationType] = useState<DonationType>('monthly')
  const [selectedAmount, setSelectedAmount] = useState<number>(30)
  const [copiado, setCopiado] = useState(false)

  // /doacoes?type=monthly vem dos cards da home. Lido aqui em vez de
  // useSearchParams pra não precisar de uma fronteira de Suspense.
  useEffect(() => {
    const tipo = new URLSearchParams(window.location.search).get('type')
    if (tipo === 'single' || tipo === 'monthly') setDonationType(tipo)
  }, [])

  const copiarChavePix = async () => {
    try {
      await navigator.clipboard.writeText(DADOS_PIX.chave)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Navegador bloqueou a área de transferência: a chave está visível na tela.
    }
  }

  const linkDoMes = linkMensalPara(selectedAmount)

  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-maya-green mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Faça uma Doação
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Sua contribuição transforma vidas! Cada doação nos ajuda a resgatar,
            cuidar e encontrar lares pra esses pets que merecem tanto amor.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Tipo de doação */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-4 text-center">
                Como você quer ajudar
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    donationType === 'monthly'
                      ? 'border-maya-blue bg-maya-blue/5 dark:bg-maya-blue/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-blue/30 dark:hover:border-maya-blue/50'
                  }`}
                >
                  {donationType === 'monthly' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-maya-blue rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <DollarSign className="w-8 h-8 text-maya-blue mx-auto mb-3" />
                  <div className="font-bold text-maya-brown dark:text-white mb-1">Doação Mensal</div>
                  <div className="text-sm text-maya-brown/60 dark:text-gray-300">No cartão, todo mês</div>
                </button>

                <button
                  onClick={() => setDonationType('single')}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    donationType === 'single'
                      ? 'border-maya-green bg-maya-green/5 dark:bg-maya-green/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-maya-green/30 dark:hover:border-maya-green/50'
                  }`}
                >
                  {donationType === 'single' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-maya-green rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Heart className="w-8 h-8 text-maya-green mx-auto mb-3" />
                  <div className="font-bold text-maya-brown dark:text-white mb-1">Doação Única</div>
                  <div className="text-sm text-maya-brown/60 dark:text-gray-300">Por PIX, o valor que quiser</div>
                </button>
              </div>
            </div>

            {donationType === 'monthly' ? (
              <>
                {/* Valores da assinatura */}
                <div className="mb-8">
                  <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-2 text-center">
                    Escolha o valor
                  </h2>
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-4 text-center">
                    Cobrado todo mês no cartão. Dá pra cancelar quando quiser.
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {DOACOES_MENSAIS.map(({ valor }) => (
                      <button
                        key={valor}
                        onClick={() => setSelectedAmount(valor)}
                        className={`p-4 rounded-xl border-2 font-bold transition-all ${
                          selectedAmount === valor
                            ? 'border-maya-brown bg-maya-brown text-white'
                            : 'border-gray-200 dark:border-gray-600 text-maya-brown dark:text-white hover:border-maya-brown/50'
                        }`}
                      >
                        R$ {valor}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Impacto */}
                <div className="bg-maya-beige dark:bg-gray-700 rounded-2xl p-6 mb-8">
                  <h3 className="font-bold text-maya-brown dark:text-white mb-3 text-center">
                    O que o seu apoio mensal cobre:
                  </h3>
                  <div className="space-y-2 text-sm text-maya-brown/80 dark:text-gray-300">
                    {selectedAmount >= 30 && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                        <span>Alimentação de um animal por uma semana</span>
                      </div>
                    )}
                    {selectedAmount >= 50 && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                        <span>Vacinas e vermífugos</span>
                      </div>
                    )}
                    {selectedAmount >= 80 && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                        <span>Consulta veterinária completa</span>
                      </div>
                    )}
                    {selectedAmount >= 300 && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-maya-green flex-shrink-0" />
                        <span>Uma cirurgia de castração</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ir para o PagBank */}
                <a
                  href={linkDoMes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 text-lg py-4"
                >
                  <ExternalLink size={22} />
                  Apoiar com R$ {selectedAmount} por mês
                </a>

                <p className="text-xs text-maya-brown/60 dark:text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Você vai para o PagBank, que processa o pagamento
                </p>
              </>
            ) : (
              <>
                {/* PIX */}
                <div className="mb-8">
                  <h2 className="font-display text-2xl text-maya-brown dark:text-white mb-2 text-center">
                    Doe por PIX
                  </h2>
                  <p className="text-sm text-maya-brown/60 dark:text-gray-400 mb-6 text-center">
                    Qualquer valor, direto na conta da ONG.
                  </p>

                  <div className="bg-maya-beige dark:bg-gray-700 rounded-2xl p-6">
                    <div className="text-xs font-bold uppercase tracking-wide text-maya-brown/60 dark:text-gray-400 mb-1">
                      Chave PIX ({DADOS_PIX.tipoChave})
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-lg text-maya-brown dark:text-white break-all">
                        {DADOS_PIX.chave}
                      </span>
                      <button
                        onClick={copiarChavePix}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-maya-brown text-maya-brown dark:text-white dark:border-gray-400 text-sm font-semibold hover:bg-maya-brown hover:text-white dark:hover:bg-gray-600 transition-colors"
                      >
                        <Copy size={14} />
                        {copiado ? 'Copiada!' : 'Copiar'}
                      </button>
                    </div>

                    <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-maya-brown/10 dark:border-gray-600 pt-5">
                      <div>
                        <dt className="text-maya-brown/60 dark:text-gray-400">Titular</dt>
                        <dd className="font-semibold text-maya-brown dark:text-white">{DADOS_PIX.titular}</dd>
                      </div>
                      <div>
                        <dt className="text-maya-brown/60 dark:text-gray-400">CNPJ</dt>
                        <dd className="font-semibold text-maya-brown dark:text-white">{DADOS_PIX.cnpj}</dd>
                      </div>
                      <div>
                        <dt className="text-maya-brown/60 dark:text-gray-400">Banco</dt>
                        <dd className="font-semibold text-maya-brown dark:text-white">{DADOS_PIX.banco}</dd>
                      </div>
                      <div>
                        <dt className="text-maya-brown/60 dark:text-gray-400">Agência e conta</dt>
                        <dd className="font-semibold text-maya-brown dark:text-white">
                          {DADOS_PIX.agencia} / {DADOS_PIX.conta}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <button
                  onClick={() => setDonationType('monthly')}
                  className="w-full text-center text-sm text-maya-brown/70 dark:text-gray-300 underline underline-offset-4 hover:text-maya-brown dark:hover:text-white"
                >
                  Prefere ajudar todo mês no cartão? Veja a doação mensal
                </button>
              </>
            )}

            {/* Área do doador */}
            <div className="mt-8 bg-maya-green/10 dark:bg-maya-green/20 rounded-2xl p-6 border-2 border-maya-green/30 dark:border-maya-green/40">
              <div className="text-center">
                <h3 className="font-bold text-maya-brown dark:text-white mb-2 flex items-center justify-center gap-2">
                  <Heart size={20} className="text-maya-green fill-maya-green" />
                  Já é um doador?
                </h3>
                <p className="text-sm text-maya-brown/70 dark:text-gray-300 mb-4">
                  Acesse sua conta para ver seu histórico de doações, baixar recibos e acompanhar seu impacto
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/doador/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-maya-brown text-white rounded-xl hover:bg-maya-brown/90 transition-colors font-semibold"
                  >
                    Acessar Área do Doador
                  </Link>
                  <Link
                    href="/doador/registro"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-maya-brown text-maya-brown dark:text-white dark:border-gray-400 rounded-xl hover:bg-maya-brown/10 dark:hover:bg-gray-700 transition-colors font-semibold"
                  >
                    Criar Conta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
