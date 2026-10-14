// Logo aplicada sobre as fotos dos veículos.
//
// O arquivo public/brand/logo.webp (selo redondo da JBLog Express) é desenhado por cima
// de cada foto, no lugar e no ângulo definidos abaixo. Trocou o arquivo da logo?
// Todas as fotos mudam juntas.
//
// Cada posição usa três cantos da área da logo, em pixels da foto original:
//   tl = canto superior esquerdo, tr = canto superior direito, bl = canto inferior esquerdo.
// "blend: 'multiply'" faz a logo parecer impressa (pega as sombras da superfície branca).
export const LOGO = 'brand/logo.webp'
export const LOGO_SIZE = { w: 640, h: 640 }

export const PLACEMENTS = {
  'img/hero-estrada.webp': [
    { tl: [800, 300], tr: [905, 279], bl: [800, 404], blend: 'multiply' },
  ],
  'img/hero-doca.webp': [
    { tl: [985, 298], tr: [1045, 307], bl: [985, 357], blend: 'multiply' },
  ],
  'img/hero-cidade.webp': [
    { tl: [1162, 350], tr: [1238, 350], bl: [1162, 426], blend: 'multiply' },
  ],
  'img/moto.webp': [
    { tl: [960, 402], tr: [1052, 402], bl: [960, 494], blend: 'multiply' },
  ],
  'img/caminhao.webp': [
    { tl: [55, 240], tr: [245, 226], bl: [55, 430], blend: 'multiply' },
  ],
  'img/coleta.webp': [
    { tl: [272, 524], tr: [362, 532], bl: [270, 612], blend: 'multiply' },
  ],
}
