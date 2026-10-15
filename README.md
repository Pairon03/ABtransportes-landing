# AB Transportes — Landing page

Landing page da **AB Transportes**, empresa de coleta e entrega com moto, carro e caminhão. Feita em **Vue 3 + Vite**, com GSAP e Lenis para as animações.

Uma página, um objetivo: levar o visitante a pedir orçamento pelo WhatsApp. Ordem: topo vivo → faixa de asfalto → como funciona → frota → orçamento → chamada final.

> Sua entrega, do ponto A ao ponto B, com rapidez, segurança e confiança.

## Rodar no seu computador

Precisa do Node.js 18 ou mais novo.

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão final na pasta dist/
npm run preview  # testa a versão final
```

## Publicar no GitHub Pages

A cada push na `main`, o workflow `.github/workflows/deploy.yml` gera o build e publica no branch `gh-pages`.

Só falta ativar uma vez:

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
3. Em **Branch**, escolha **gh-pages** e a pasta **/ (root)**. Clique em **Save**.

Em 1 ou 2 minutos o site fica em `https://pairon03.github.io/ABtransportes-landing/`.

## Estrutura

```
src/
├── App.vue                        ordem das seções; liga a rolagem suave
├── config.js                      WhatsApp, Instagram e geração dos links
├── brand.js                       onde a logo entra em cada foto (4 cantos, com perspectiva)
├── assets/main.css                cores, fontes, botões e base (variáveis no :root)
├── composables/
│   ├── motion.js                  GSAP + ScrollTrigger + Lenis (rolagem suave), respeita "reduzir movimento"
│   ├── roadScene.js               shader WebGL do topo: a pista corre, o caminhão fica parado
│   ├── useBrandedImage.js         desenha a logo por cima das fotos (canvas, em perspectiva)
│   └── masks.js                   CPF/CNPJ, CEP (ViaCEP) e horários
└── components/
    ├── TheHeader.vue              cabeçalho fixo: logo, seções e WhatsApp
    ├── HeroLive.vue               topo "vivo" + manchete com os pinos A e B ligados por uma rota
    ├── RoadBand.vue               faixa de asfalto com as promessas pintadas no chão
    ├── JourneyRoute.vue           como funciona: estrada, marcador tipo GPS e relógio do dia
    ├── JourneyVisual.vue          conversa, foto da coleta e foto da entrega de cada parada
    ├── LiveMap.vue                mapa ilustrativo do acompanhamento em tempo real
    ├── FleetConfigurator.vue      escolha a carga e o veículo certo entra no galpão
    ├── QuoteWizard.vue            orçamento em etapas ("ordem de coleta"), termina no WhatsApp
    ├── FinalCta.vue               chamada final com a traseira do caminhão
    ├── TheFooter.vue              rodapé (Instagram e crédito)
    ├── WhatsAppFloat.vue          botão flutuante de WhatsApp
    ├── BrandedImg.vue             <img> que recebe a logo automaticamente
    └── AppIcon.vue                ícones de traço (prop "name")
```

## Topo "vivo" (WebGL)

A foto `public/img/v3/hero-base.webp` vira um travelling: a pista corre ao longo das retas
que convergem no ponto de fuga e o caminhão fica parado, como numa filmagem feita de outro carro.
São quatro imagens geradas a partir da mesma foto:

| Arquivo | O que é |
| --- | --- |
| `hero-base.webp` | a foto (a logo é aplicada nela pelo `brand.js`) |
| `hero-plate.webp` | a pista sem o caminhão, preenchida ao longo das faixas |
| `hero-alpha.webp` | o recorte do caminhão (branco = caminhão) |
| `hero-light.webp` | sombra e reflexo dos faróis presos ao caminhão |

O ponto de fuga e a velocidade ficam em `HeroLive.vue` (`VP` e `speed`). Sem WebGL, ou com
"reduzir movimento" ligado no sistema, a página mostra a foto parada.

## Animações

- **Topo**: a manchete entra, os pinos A e B caem e a rota se desenha entre eles (GSAP).
- **Faixa de asfalto**: anda conforme a rolagem.
- **Como funciona**: o marcador fica no meio da tela, como num GPS; cada parada acende quando ele chega e o relógio avança no mesmo dia.
- **Frota e orçamento**: só se movem em resposta a um clique.
- Quem ativou "reduzir movimento" no sistema vê tudo parado no estado final.

## Fontes

Barlow (texto) e Barlow Condensed (títulos), servidas pelo próprio site via `@fontsource`.

## Paleta

| Nome | Cor | Uso |
| --- | --- | --- |
| Asfalto | `#2A2C30` | fundo principal |
| Noite | `#1C1D20` | topo, viagem e rodapé |
| Vermelho AB | `#E3141B` | botões, rota e destaques |
| Vinho | `#8A0B10` | sombra dos botões |
| Tinta | `#F4F2EC` | texto e "pintura de faixa" |

## Personalizar

- **WhatsApp:** `PHONE` e `PHONE_LABEL` em `src/config.js`.
- **Campos do orçamento:** array `steps` no topo de `QuoteWizard.vue`. A revisão e a mensagem se montam a partir de `summary`.
- **Fotos:** arquivos em `public/img/v3/`. As atuais foram geradas por IA e são ilustrativas. Troque por fotos reais da frota quando tiver (a foto do topo precisa das quatro camadas descritas acima).

## Logo nos veículos

A logo que aparece nos caminhões, na van, no baú da moto e na etiqueta da caixa **não está gravada nas fotos**:
a página desenha o arquivo `public/brand/logo.webp` por cima de cada foto, no lugar e no ângulo de cada veículo.

- **Trocar a logo:** substitua `public/brand/logo.webp` (selo redondo, quadrado, fundo transparente) e as versões menores `logo-160.webp`, `favicon.png` e `apple-touch-icon.png`. Todas as fotos mudam juntas. Se a logo nova não for quadrada, ajuste `LOGO_SIZE` em `src/brand.js`.
- **Mudar a posição ou incluir uma foto nova:** edite `src/brand.js`. Cada posição tem os quatro cantos da área da logo
  (`quad`: superior esquerdo, superior direito, inferior direito, inferior esquerdo), em pixels da foto original.
  Com quatro cantos a logo acompanha a perspectiva do baú, da porta ou da etiqueta.
- Para a logo aparecer em outra imagem da página, use `<BrandedImg path="img/arquivo.webp" />` no lugar de `<img>`.
