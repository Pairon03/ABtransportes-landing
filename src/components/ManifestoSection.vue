<template>
  <section class="wrap-x manifesto">
    <div class="manifesto__inner">
      <span class="eyebrow">Precisou transportar?</span>
      <p class="manifesto__text">
        A gente resolve. <em>Do início ao fim,</em> com responsabilidade e você informado em cada etapa.
      </p>
      <span class="manifesto__rule" aria-hidden="true"></span>
    </div>
  </section>
</template>

<style scoped>
.manifesto {
  padding-top: clamp(72px, 10vw, 152px); padding-bottom: clamp(72px, 10vw, 152px);
  background: var(--ink); color: var(--bone);
}
.manifesto__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; align-items: center; text-align: center; }
.eyebrow { color: var(--rose-2); letter-spacing: 5px; }
.manifesto__text {
  font-family: var(--serif); font-weight: 300; font-size: clamp(36px, 5.2vw, 80px);
  line-height: 1.08; letter-spacing: -0.5px;
}
.manifesto__text em { color: var(--rose); }
.manifesto__rule { width: 1px; height: 72px; background: #4A433D; }
</style>
