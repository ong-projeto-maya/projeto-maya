/**
 * Canal de contato público da ONG.
 *
 * Era o WhatsApp. A própria equipe pediu para tirar: o número é pessoal e
 * começou a receber mensagem de desconhecido depois que foi publicado no site.
 * O contato oficial agora é o e-mail, que é o mesmo endereço da chave PIX.
 *
 * Os links de "compartilhar" continuam oferecendo WhatsApp — ali quem
 * compartilha é o visitante, no WhatsApp dele, e nenhum número da ONG aparece.
 */
export const EMAIL_CONTATO = 'projetomaya@outlook.com'

/** Monta um mailto já com assunto e, quando faz sentido, corpo pronto. */
export function mailto(assunto: string, corpo?: string) {
  const params = new URLSearchParams({ subject: assunto })
  if (corpo) params.set('body', corpo)
  // URLSearchParams escreve espaço como '+', que o cliente de e-mail mostra
  // literalmente na linha de assunto. %20 funciona nos dois casos.
  return `mailto:${EMAIL_CONTATO}?${params.toString().replace(/\+/g, '%20')}`
}
