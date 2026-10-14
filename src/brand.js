// Logo aplicada sobre as fotos dos veículos.
//
// O arquivo public/brand/logo.svg é desenhado por cima de cada foto, no lugar e no
// ângulo definidos abaixo. Trocou o arquivo da logo? Todas as fotos mudam juntas.
//
// Cada posição usa três cantos da área da logo, em pixels da foto original:
//   tl = canto superior esquerdo, tr = canto superior direito, bl = canto inferior esquerdo.
// "blend: 'multiply'" faz a logo parecer impressa (pega as sombras da superfície branca).
export const LOGO = 'brand/logo.svg'
export const LOGO_SIZE = { w: 360, h: 120 }

export const PLACEMENTS = {
  'img/hero-estrada.webp': [
    { tl: [768, 322], tr: [928, 290], bl: [768, 375], blend: 'multiply' },
  ],
  'img/hero-doca.webp': [
    { tl: [975, 302], tr: [1058, 316], bl: [975, 330], blend: 'multiply' },
  ],
  'img/hero-cidade.webp': [
    { tl: [1140, 362], tr: [1262, 362], bl: [1140, 403], blend: 'multiply' },
  ],
  'img/moto.webp': [
    { tl: [938, 415], tr: [1080, 415], bl: [938, 462], blend: 'multiply' },
  ],
  'img/caminhao.webp': [
    { tl: [28, 300], tr: [276, 282], bl: [28, 382], blend: 'multiply' },
  ],
  'img/coleta.webp': [
    { tl: [268, 532], tr: [556, 556], bl: [266, 598], blend: 'multiply' },
  ],
}
