# AB Transportes — Landing page

Landing page da **AB Transportes**, empresa de coleta e entrega com moto, carro e caminhão. Feita em **Vue 3 + Vite**, sem dependências além do Vue.

Uma página, um objetivo: levar o visitante a pedir orçamento pelo WhatsApp. Ordem: topo com a rota animada → diferenciais → como funciona → orçamento → chamada final.

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

Em 1 ou 2 minutos o site fica em `https://pairon03.github.io/ponta-a-ponta-landing/`.

## Estrutura

```
src/
├── App.vue                    ordem das seções
├── config.js                  número do WhatsApp e geração dos links
├── assets/main.css            cores, fonte, botões e base (variáveis no :root)
├── composables/useInView.js   dispara animações quando a seção aparece na tela
└── components/
    ├── TheHeader.vue          cabeçalho fixo: logo e WhatsApp (ganha fundo ao rolar)
    ├── HeroRoute.vue          topo: título e botões
    ├── RouteAnimation.vue     rota animada de A até B com as etapas acendendo
    ├── PhotoProof.vue         diferenciais + fotos de coleta e entrega
    ├── HowItWorks.vue         as 3 etapas com a "estrada" que se desenha
    ├── QuoteWizard.vue        orçamento em etapas, termina no WhatsApp
    ├── FinalCta.vue           chamada final em laranja
    ├── TheFooter.vue          rodapé
    ├── WhatsAppFloat.vue      botão flutuante de WhatsApp
    └── AppIcon.vue            ícones de traço (prop "name")
```

## Animações

- **Rota do topo** (`RouteAnimation.vue`): o traço se desenha, o veículo percorre o caminho com `requestAnimationFrame` e `getPointAtLength`, e as etapas acendem conforme a posição. Ajuste os tempos nas constantes `DRAW`, `TRAVEL` e `HOLD`.
- **Fotos e etapas**: animam uma única vez, quando a seção entra na tela (`useInView`).
- **Orçamento**: cada etapa desliza no sentido do avanço e o veículo da barra acompanha.
- Quem ativou "reduzir movimento" no sistema vê tudo parado no estado final.

## Paleta

| Nome | Cor | Uso |
| --- | --- | --- |
| Cobalto | `#1F4FFF` | cor principal, links, faixa azul |
| Laranja colete | `#FF6A13` | botões de ação e destaques |
| Sol | `#FFD23F` | detalhes pontuais |
| Céu | `#EEF4FF` | fundos claros |
| Tinta | `#0F1E36` | textos |

## Personalizar

- **WhatsApp:** `PHONE` e `PHONE_LABEL` em `src/config.js`.
- **Campos do orçamento:** array `steps` no topo de `QuoteWizard.vue`. A revisão e a mensagem se montam a partir de `summary`.
- **Fotos:** arquivos em `public/img/`. As atuais foram geradas por IA e são ilustrativas. Troque por fotos reais da frota quando tiver.

## Logo nos veículos

A logo que aparece nos caminhões, na van, no baú da moto e na etiqueta da caixa **não está gravada nas fotos**:
a página desenha o arquivo `public/brand/logo.webp` por cima de cada foto, no lugar e no ângulo de cada veículo.

- **Trocar a logo:** substitua `public/brand/logo.webp` (selo redondo, quadrado, fundo transparente) e as versões menores `logo-160.webp`, `favicon.png` e `apple-touch-icon.png`. Todas as fotos mudam juntas. Se a logo nova não for quadrada, ajuste `LOGO_SIZE` em `src/brand.js`.
- **Mudar a posição ou incluir uma foto nova:** edite `src/brand.js`. Cada posição tem três cantos da área da logo
  (`tl` superior esquerdo, `tr` superior direito, `bl` inferior esquerdo), em pixels da foto original.
- Para a logo aparecer em outra imagem da página, use `<BrandedImg path="img/arquivo.webp" />` no lugar de `<img>`.
