/**
 * Links de doação mensal do PagBank.
 *
 * São assinaturas recorrentes já criadas na conta do Projeto Maya. Estavam
 * publicadas no Linktree da ONG (linktr.ee/projetomaya); cada link foi aberto e
 * conferido contra o valor que o PagBank cobra na tela de pagamento, em
 * 06/11/2026.
 *
 * Enquanto a integração com a API do PagBank não existir (falta o
 * PAGBANK_TOKEN, que está com a Ana), estes links são o caminho de doação.
 * O site manda o doador direto pro checkout do PagBank.
 *
 * ATENÇÃO — R$ 100 está fora da lista de propósito.
 * No Linktree, o botão de R$ 100 aponta para pag.ae/81Gi9f-up, que é o mesmo
 * link do de R$ 80 e cobra R$ 80. Não existe assinatura de R$ 100 criada.
 * Quando a Ana criar, é só acrescentar aqui.
 */

export interface LinkDoacaoMensal {
  /** Valor em reais, conferido na tela do PagBank. */
  valor: number
  /** URL curta do PagBank. */
  url: string
}

export const DOACOES_MENSAIS: readonly LinkDoacaoMensal[] = [
  { valor: 5, url: 'https://pag.ae/81GhTRfS8' },
  { valor: 10, url: 'https://pag.ae/81Gi3hcB8' },
  { valor: 30, url: 'https://pag.ae/81Gi3S818' },
  { valor: 50, url: 'https://pag.ae/81Gi4k_Kp' },
  { valor: 80, url: 'https://pag.ae/81Gi9f-up' },
  { valor: 150, url: 'https://pag.ae/81Gia47jp' },
  { valor: 300, url: 'https://pag.ae/81GiakDg4' },
] as const

export const linkMensalPara = (valor: number): string | undefined =>
  DOACOES_MENSAIS.find((l) => l.valor === valor)?.url

/**
 * Dados do PIX e da conta, como a ONG publica no próprio Instagram.
 * Fonte: post fixado "COMO DOAR?" do @projeto.maya.
 */
export const DADOS_PIX = {
  chave: 'projetomaya@outlook.com',
  tipoChave: 'E-mail',
  titular: 'Projeto Maya',
  cnpj: '42.686.223/0001-02',
  banco: 'Itaú Unibanco - 341',
  agencia: '1652',
  conta: '99858-2',
} as const
