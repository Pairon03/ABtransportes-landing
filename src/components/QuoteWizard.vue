<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { GREETING, waLink } from '../config'
import AppIcon from './AppIcon.vue'

// Orçamento em etapas. O veículo na barra avança conforme a pessoa preenche.
const steps = [
  {
    key: 'voce', icon: 'user', title: 'Quem está pedindo',
    fields: [
      { key: 'nome', label: 'Nome ou empresa', placeholder: 'Maria Silva ou Empresa X', autocomplete: 'organization' },
      { key: 'doc', label: 'CPF ou CNPJ', placeholder: 'Somente números', inputmode: 'numeric' },
    ],
  },
  {
    key: 'coleta', icon: 'pin', title: 'Onde coletamos',
    fields: [
      { key: 'cEnd', label: 'Endereço completo', placeholder: 'Rua, número e bairro', autocomplete: 'street-address', wide: true },
      { key: 'cCidade', label: 'Cidade', placeholder: 'Campinas' },
      { key: 'cCep', label: 'CEP', placeholder: '00000-000', inputmode: 'numeric', autocomplete: 'postal-code' },
      { key: 'data', label: 'Data da coleta', type: 'date' },
      { key: 'cHora', label: 'Horário disponível', placeholder: 'Das 8h às 12h' },
    ],
  },
  {
    key: 'entrega', icon: 'flag', title: 'Para onde vai',
    fields: [
      { key: 'eEnd', label: 'Endereço completo', placeholder: 'Rua, número e bairro', wide: true },
      { key: 'eCidade', label: 'Cidade', placeholder: 'São Paulo' },
      { key: 'eCep', label: 'CEP', placeholder: '00000-000', inputmode: 'numeric' },
    ],
  },
  {
    key: 'carga', icon: 'box', title: 'Sobre a carga',
    fields: [
      { key: 'peso', label: 'Peso (kg)', placeholder: '25', inputmode: 'decimal' },
      { key: 'vol', label: 'Quantidade de volumes', placeholder: '3', inputmode: 'numeric' },
      { key: 'dim', label: 'Dimensões em cm (C × L × A)', placeholder: '60 × 40 × 40' },
      { key: 'tipo', label: 'Tipo de material', placeholder: 'Documentos, eletrônicos…' },
    ],
    choices: [
      { key: 'modalidade', label: 'Modalidade', options: ['Veículo exclusivo', 'Carga fracionada'] },
      { key: 'fragil', label: 'O material é frágil?', options: ['Sim', 'Não'] },
    ],
  },
  { key: 'revisao', icon: 'check', title: 'Revise e envie' },
]

const allFields = steps.flatMap((s) => s.fields || [])
const form = reactive(Object.fromEntries(allFields.map((f) => [f.key, ''])))
const choice = reactive({ modalidade: '', fragil: '' })

const current = ref(0)
const direction = ref('next')
const panel = ref(null)
const step = computed(() => steps[current.value])
const isLast = computed(() => current.value === steps.length - 1)
const trackPct = computed(() => (current.value / (steps.length - 1)) * 100)

async function go(i) {
  if (i < 0 || i >= steps.length || i === current.value) return
  direction.value = i > current.value ? 'next' : 'prev'
  current.value = i
  await nextTick()
  const first = panel.value && panel.value.querySelector('input, button.chip, .review')
  if (first) first.focus({ preventScroll: true })
}

function toggle(key, value) {
  choice[key] = choice[key] === value ? '' : value
}

const v = (k) => (form[k] || '').trim()
const join = (parts) => parts.filter(Boolean).join(', ')
const formatDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')

const summary = computed(() =>
  [
    ['Solicitante', join([v('nome'), v('doc') && `CPF/CNPJ ${v('doc')}`])],
    ['Coleta', join([v('cEnd'), v('cCidade'), v('cCep') && `CEP ${v('cCep')}`])],
    ['Quando', join([formatDate(v('data')), v('cHora')])],
    ['Entrega', join([v('eEnd'), v('eCidade'), v('eCep') && `CEP ${v('eCep')}`])],
    ['Carga', join([
      v('peso') && `${v('peso')} kg`,
      v('vol') && `${v('vol')} volume(s)`,
      v('dim') && `${v('dim')} cm`,
      v('tipo'),
    ])],
    ['Modalidade', choice.modalidade],
    ['Frágil', choice.fragil],
  ].map(([label, value]) => ({ label, value })),
)
const filledCount = computed(() => summary.value.filter((r) => r.value).length)

const quoteLink = computed(() => {
  const lines = [GREETING, '']
  summary.value.filter((r) => r.value).forEach((r) => lines.push(`*${r.label}:* ${r.value}`))
  return waLink(lines.join('\n'))
})
</script>

<template>
  <section id="orcamento" class="section wrap quote">
    <div class="container quote__grid">
      <div class="quote__intro">
        <h2 class="h-lg">Peça seu orçamento agora.</h2>
        <p class="lead">
          Para calcular o valor com precisão, precisamos de algumas informações.
          No final, abrimos o WhatsApp com tudo preenchido. É só enviar.
        </p>
      </div>

      <div class="wizard">
        <!-- barra de progresso em forma de rota -->
        <div class="track" aria-hidden="true">
          <div class="track__line"><div class="track__done" :style="{ width: `${trackPct}%` }"></div></div>
          <div class="track__vehicle" :style="{ left: `${trackPct}%` }"><AppIcon name="moto" :size="20" /></div>
        </div>
        <ol class="tabs">
          <li v-for="(s, i) in steps" :key="s.key">
            <button
              type="button"
              class="tab"
              :class="{ 'tab--current': i === current, 'tab--done': i < current }"
              :aria-current="i === current ? 'step' : undefined"
              @click="go(i)"
            >
              <AppIcon :name="s.icon" :size="18" />
              <span class="tab__label">{{ s.title }}</span>
            </button>
          </li>
        </ol>

        <form class="panel" novalidate @submit.prevent="go(current + 1)">
          <div ref="panel" class="panel__viewport">
            <Transition :name="`slide-${direction}`" mode="out-in">
              <fieldset :key="step.key" class="panel__step">
                <legend class="h-md">{{ step.title }}</legend>

                <div v-if="step.fields" class="fields">
                  <div v-for="f in step.fields" :key="f.key" class="field" :class="{ 'field--wide': f.wide }">
                    <label :for="`q-${f.key}`">{{ f.label }}</label>
                    <input
                      :id="`q-${f.key}`"
                      v-model="form[f.key]"
                      :name="f.key"
                      :type="f.type || 'text'"
                      :placeholder="f.placeholder"
                      :inputmode="f.inputmode"
                      :autocomplete="f.autocomplete"
                    >
                  </div>
                </div>

                <div v-if="step.choices" class="choices">
                  <div v-for="c in step.choices" :key="c.key" class="choice" role="group" :aria-label="c.label">
                    <span class="choice__label">{{ c.label }}</span>
                    <div class="chips">
                      <button
                        v-for="opt in c.options"
                        :key="opt"
                        type="button"
                        class="chip"
                        :aria-pressed="choice[c.key] === opt"
                        @click="toggle(c.key, opt)"
                      >
                        <AppIcon v-if="choice[c.key] === opt" name="check" :size="16" />{{ opt }}
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="isLast" class="review" tabindex="-1">
                  <dl>
                    <div v-for="row in summary" :key="row.label" class="review__row">
                      <dt>{{ row.label }}</dt>
                      <dd :class="{ 'review__empty': !row.value }">{{ row.value || 'Não informado' }}</dd>
                    </div>
                  </dl>
                  <p v-if="filledCount < summary.length" class="review__hint">
                    Faltou alguma coisa? Volte às etapas anteriores, ou envie assim mesmo e complete na conversa.
                  </p>
                </div>
              </fieldset>
            </Transition>
          </div>

          <div class="panel__nav">
            <button v-if="current > 0" type="button" class="btn btn--ghost" @click="go(current - 1)">
              <AppIcon name="arrowLeft" :size="20" /> Voltar
            </button>
            <span class="panel__count">Etapa {{ current + 1 }} de {{ steps.length }}</span>
            <button v-if="!isLast" type="submit" class="btn btn--ink">
              Continuar <AppIcon name="arrowRight" :size="20" />
            </button>
            <a v-else class="btn btn--orange" :href="quoteLink" target="_blank" rel="noopener">
              <AppIcon name="chat" :size="20" /> Enviar pelo WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quote { background: linear-gradient(var(--paper), var(--sky)); }
.quote__grid { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr); gap: clamp(32px, 5vw, 72px); align-items: start; }
.quote__intro { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 110px; }

.wizard {
  background: #fff; border-radius: var(--r-lg); padding: clamp(20px, 3vw, 36px);
  box-shadow: 0 1px 0 var(--line), 0 40px 80px -40px rgba(31, 79, 255, 0.35);
}

/* rota de progresso */
.track { position: relative; height: 40px; margin: 0 18px 6px; }
.track__line { position: absolute; left: 0; right: 0; top: 18px; height: 4px; border-radius: 4px; background: var(--sky-2); overflow: hidden; }
.track__done { height: 100%; background: var(--cobalt); transition: width .6s var(--ease-out); }
.track__vehicle {
  position: absolute; top: 0; transform: translateX(-50%);
  display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
  background: var(--orange); color: var(--ink); box-shadow: 0 0 0 4px #fff;
  transition: left .6s var(--ease-out);
}

.tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin-bottom: 24px; }
.tab {
  width: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 10px 4px; border: 0; border-radius: 12px; background: transparent; cursor: pointer;
  font: inherit; font-size: 13px; line-height: 1.2; color: var(--ink-3); text-align: center;
}
.tab:hover { background: var(--sky); color: var(--ink); }
.tab--done { color: var(--cobalt); }
.tab--current { background: var(--sky); color: var(--ink); font-weight: 700; }

.panel__viewport { overflow: hidden; min-height: 300px; }
.panel__step { border: 0; margin: 0; padding: 0; min-width: 0; }
.panel__step legend { padding: 0; margin-bottom: 18px; }

.fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field--wide { grid-column: 1 / -1; }
.field label { font-size: 15px; font-weight: 600; color: var(--ink); }
.field input {
  font: inherit; font-size: 17px; color: var(--ink);
  background: var(--sky); border: 2px solid transparent; border-radius: 14px;
  padding: 12px 16px; min-height: 52px; width: 100%;
  transition: border-color .2s ease, background-color .2s ease;
}
.field input::placeholder { color: #7F8CA3; }
.field input:hover { border-color: var(--sky-2); }
.field input:focus { outline: none; border-color: var(--cobalt); background: #fff; }

.choices { display: grid; gap: 18px; margin-top: 22px; }
.choice__label { display: block; font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  font: inherit; font-size: 16px; font-weight: 600; min-height: 48px; padding: 0 20px;
  border-radius: 999px; border: 2px solid var(--line); background: #fff; color: var(--ink); cursor: pointer;
  transition: background-color .2s ease, border-color .2s ease, color .2s ease;
}
.chip:hover { border-color: var(--cobalt); }
.chip[aria-pressed='true'] { background: var(--cobalt); border-color: var(--cobalt); color: #fff; }

.review dl { display: grid; gap: 0; }
.review__row { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--line); }
.review dt { color: var(--ink-3); font-size: 15px; }
.review dd { font-weight: 600; overflow-wrap: anywhere; }
.review__empty { color: var(--ink-3); font-weight: 400 !important; }
.review__hint { margin-top: 16px; font-size: 15px; color: var(--ink-2); }
.review:focus { outline: none; }

.panel__nav { display: flex; align-items: center; gap: 12px; margin-top: 28px; padding-top: 22px; border-top: 1px solid var(--line); }
.panel__count { margin-right: auto; font-size: 14px; color: var(--ink-3); }
.panel__nav .btn--ghost + .panel__count { margin-left: 4px; }

/* transição entre etapas: desliza no sentido do avanço */
.slide-next-enter-active, .slide-next-leave-active,
.slide-prev-enter-active, .slide-prev-leave-active { transition: transform .32s var(--ease-out), opacity .24s ease; }
.slide-next-enter-from { transform: translateX(40px); opacity: 0; }
.slide-next-leave-to { transform: translateX(-40px); opacity: 0; }
.slide-prev-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-prev-leave-to { transform: translateX(40px); opacity: 0; }

@media (max-width: 980px) {
  .quote__grid { grid-template-columns: 1fr; }
  .quote__intro { position: static; }
}
@media (max-width: 600px) {
  .fields { grid-template-columns: 1fr; }
  .tab__label { display: none; }
  .tabs { margin-bottom: 18px; }
  .review__row { grid-template-columns: 1fr; gap: 2px; }
  .panel__nav { flex-wrap: wrap; }
  .panel__count { order: -1; flex: 1 1 100%; }
  .panel__nav .btn { flex: 1 1 auto; }
}
</style>
