// Dados da empresa usados em toda a página.
// Para trocar o número, altere só aqui (formato: 55 + DDD + número).
export const PHONE = '5519991148000'
export const PHONE_LABEL = '(19) 99114-8000'
export const GREETING = 'Olá! Gostaria de solicitar um orçamento de transporte.'

// Vídeo do topo (opcional). Coloque um .mp4 em public/video/ e informe o caminho,
// por exemplo 'video/frota.mp4'. Vazio = usa as cenas animadas com fotos.
export const HERO_VIDEO = ''

export function waLink(text = GREETING) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}
