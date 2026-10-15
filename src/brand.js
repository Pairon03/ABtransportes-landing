// Logo aplicada sobre as fotos dos veículos.
//
// O arquivo public/brand/logo.webp (selo da marca) é desenhado por cima de cada foto,
// no lugar e na perspectiva definidos abaixo. Trocou o arquivo da logo? Todas as fotos mudam juntas.
//
// Cada posição é um "quad": os 4 cantos da área da logo na foto original, em pixels,
// na ordem superior esquerdo, superior direito, inferior direito, inferior esquerdo.
// Com 4 cantos a logo acompanha a perspectiva da superfície (baú, porta, etiqueta).
// "blend: 'multiply'" faz a logo parecer impressa: ela pega as sombras e a luz da superfície.
export const LOGO = 'brand/logo.webp'
export const LOGO_SIZE = { w: 640, h: 640 }

export const PLACEMENTS = {
  // topo: baú do caminhão na estrada (foto ampliada 2376 × 1008)
  'img/v3/hero-base.webp': [
    { quad: [[1704.4, 281.4], [1859.7, 301.4], [1860.5, 568.9], [1704.7, 573.9]], blend: 'multiply' },
  ],
  // frota (fotos 1264 × 848)
  'img/v3/frota-caminhao.webp': [
    { quad: [[662, 284], [852, 284], [852, 474], [662, 474]], blend: 'multiply' },
  ],
  'img/v3/frota-carro.webp': [
    { quad: [[722, 346], [827, 346], [827, 451], [722, 451]], blend: 'multiply' },
  ],
  'img/v3/frota-moto.webp': [
    { quad: [[921, 262], [983, 256], [983, 318], [921, 324]], blend: 'multiply' },
  ],
  // portas traseiras do caminhão na chamada final (1376 × 768)
  'img/v3/traseira.webp': [
    { quad: [[593, 236], [783, 236], [783, 426], [593, 426]], blend: 'multiply' },
  ],
  // etiqueta da caixa na foto da coleta (928 × 1152)
  'img/v3/coleta.webp': [
    { quad: [[418.2, 589.2], [469.4, 579.0], [520.6, 626.4], [469.8, 638.1]], blend: 'multiply' },
  ],
}
