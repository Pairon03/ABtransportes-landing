# Ponta a Ponta Brasil Express — Landing page

Landing page ultrapremium da **Ponta a Ponta Brasil Express**, empresa de coleta e entrega (moto, carro e caminhão), feita em **Vue 3 + Vite**.

> Sua entrega, do ponto A ao ponto B, com rapidez, segurança e confiança.

## Rodar no seu computador

Precisa do Node.js 18 ou mais novo.

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão final na pasta dist/
npm run preview  # testa a versão final
```

## Estrutura

```
src/
├── App.vue                     monta a página na ordem das seções
├── config.js                   número do WhatsApp e geração dos links
├── assets/main.css             cores, fontes e estilos globais (variáveis no :root)
└── components/
    ├── TheHeader.vue           menu, logotipo e telefone
    ├── HeroRoute.vue           topo com a rota A → B animada
    ├── ManifestoSection.vue    faixa escura "Precisou transportar?"
    ├── ServicePillars.vue      os 4 compromissos (lista em data)
    ├── ProcessSteps.vue        as 3 etapas (lista em data)
    ├── TransparencySection.vue bloco de transparência
    ├── QuoteConcierge.vue      formulário de orçamento + prévia ao vivo
    ├── FinalCta.vue            chamada final com o telefone
    ├── TheFooter.vue           rodapé
    └── ArrowIcon.vue           ícone de seta dos botões
```

## Formulário de orçamento

`QuoteConcierge.vue` usa `reactive` para os campos e `computed` para:

- montar a prévia "Sua solicitação" enquanto o cliente digita;
- calcular o progresso (campos preenchidos / total);
- gerar o link `wa.me` com a mensagem já formatada.

Para adicionar ou remover um campo, edite o array `sections` no topo do componente. A prévia, o progresso e a mensagem se ajustam sozinhos (se o campo novo deve aparecer na mensagem, inclua-o também em `rows`).

## Publicar no GitHub Pages

O repositório já tem o workflow `.github/workflows/deploy.yml`, que gera o build e publica a cada push na `main`.

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Rode o workflow de novo (aba **Actions → Publicar no GitHub Pages → Run workflow**) ou faça um novo push.

O site fica em `https://pairon03.github.io/ponta-a-ponta-landing/`.

## Personalizar

- **WhatsApp:** `PHONE` e `PHONE_LABEL` em `src/config.js` (o número grande do `FinalCta.vue` também está escrito no template).
- **Cores e fontes:** variáveis no topo de `src/assets/main.css`.
- **Textos:** direto em cada componente.
