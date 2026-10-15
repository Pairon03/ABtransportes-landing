// Dados da empresa usados em toda a página.
// Para trocar o número, altere só aqui (formato: 55 + DDD + número).
export const PHONE = '5519991148000'
export const PHONE_LABEL = '(19) 99114-8000'
// Instagram da empresa (rodapé)
export const INSTAGRAM = 'https://www.instagram.com/jblog.express/'
export const INSTAGRAM_HANDLE = '@jblog.express'

export const GREETING = 'Olá! Gostaria de solicitar um orçamento de transporte.'

export function waLink(text = GREETING) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}
