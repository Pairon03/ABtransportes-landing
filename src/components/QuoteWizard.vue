<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { GREETING, waLink } from '../config'
import { HOURS, fetchCep, maskCep, maskCpfCnpj, onlyDigits } from '../composables/masks'
import AppIcon from './AppIcon.vue'

// Orçamento em etapas. O veículo na barra avança conforme a pessoa preenche.
// Tipos de campo: text (padrão), date, cep (consulta o endereço), hours (início e fim).
const steps = [
  {
    key: 'voce', icon: 'user', title: 'Quem está pedindo',
    fields: [
      { key: 'nome', label: 'Nome ou empresa', placeholder: 'Maria Silva ou Empresa X', autocomplete: 'organization' },
      { key: 'doc', label: 'CPF ou CNPJ', placeholder: '000.000.000-00', inputmode: 'numeric', maxlength: 18 },
    ],
  },
  {
    key: 'coleta', icon: 'pin', title: 'Onde coletamos',
    fields: [
      { key: 'cCep', label: 'CEP', type: 'cep', prefix: 'c', placeholder: '00000-000', inputmode: 'numeric', autocomplete: 'postal-code' },
      { key: 'cNum', label: 'Número', placeholder: '123' },
      { key: 'cRua', label: 'Rua', placeholder: 'Preenchida pelo CEP', wide: true },
      { key: 'cBairro', label: 'Bairro', placeholder: 'Preenchido pelo CEP' },
      { key: 'cCidade', label: 'Cidade', placeholder: 'Preenchida pelo CEP' },
      { key: 'cCompl', label: 'Complemento (opcional)', placeholder: 'Sala, bloco, referência' },
      { key: 'data', label: 'Data da coleta', type: 'date' },
      { key: 'hora', label: 'Horário disponível', type: 'hours', wide: true },
    ],
  },
  {
    key: 'entrega', icon: 'flag', title: 'Para onde vai',
    fields: [
      { key: 'eCep', label: 'CEP', type: 'cep', prefix: 'e', placeholder: '00000-000', inputmode: 'numeric' },
      { key: 'eNum', label: 'Número', placeholder: '123' },
      { key: 'eRua', label: 'Rua', placeholder: 'Preenchida pelo CEP', wide: true },
      { key: 'eBairro', label: 'Bairro', placeholder: 'Preenchido pelo CEP' },
      { key: 'eCidade', label: 'Cidade', placeholder: 'Preenchida pelo CEP' },
      { key: 'eCompl', label: 'Complemento (opcional)', placeholder: 'Sala, bloco, referência', wide: true },
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

const textKeys = steps.flatMap((s) => (s.fields || []).filter((f) => f.type !== 'hours').map((f) => f.key))
const form = reactive({ ...Object.fromEntries(textKeys.map((k) => [k, ''])), horaIni: '', horaFim: '' })
const choice = reactive({ modalidade: '', fragil: '' })

// --- máscaras
watch(() => form.doc, (v) => { const m = maskCpfCnpj(v); if (m !== v) form.doc = m })

// --- CEP: ao completar 8 dígitos, consulta e preenche rua, bairro e cidade
const cepStatus = reactive({ c: '', e: '' })
const lastCep = { c: '', e: '' }
const cepMessages = {
  loading: 'Buscando endereço…',
  ok: 'Endereço preenchido. Confira e informe o número.',
  notfound: 'CEP não encontrado. Preencha o endereço manualmente.',
  error: 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.',
}

async function onCep(prefix) {
  const key = `${prefix}Cep`
  const masked = maskCep(form[key])
  if (masked !== form[key]) { form[key] = masked; return }
  const digits = onlyDigits(masked)
  if (digits.length !== 8) { cepStatus[prefix] = ''; lastCep[prefix] = ''; return }
  if (digits === lastCep[prefix]) return
  lastCep[prefix] = digits
  cepStatus[prefix] = 'loading'
  try {
    const addr = await fetchCep(digits)
    if (onlyDigits(form[key]) !== digits) return // a pessoa mudou o CEP no meio da consulta
    if (!addr) { cepStatus[prefix] = 'notfound'; return }
    form[`${prefix}Rua`] = addr.rua || form[`${prefix}Rua`]
    form[`${prefix}Bairro`] = addr.bairro || form[`${prefix}Bairro`]
    form[`${prefix}Cidade`] = addr.cidade || form[`${prefix}Cidade`]
    cepStatus[prefix] = 'ok'
    await nextTick()
    const num = document.getElementById(`q-${prefix}Num`)
    if (num && !form[`${prefix}Num`]) num.focus()
  } catch {
    cepStatus[prefix] = 'error'
  }
}
watch(() => form.cCep, () => onCep('c'))
watch(() => form.eCep, () => onCep('e'))

// --- horário: o fim só oferece horas depois do início
const endHours = computed(() => (form.horaIni ? HOURS.filter((h) => h > form.horaIni) : HOURS))
watch(() => form.horaIni, (ini) => { if (form.horaFim && ini && form.horaFim <= ini) form.horaFim = '' })

// --- navegação entre etapas
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
  const first = panel.value && panel.value.querySelector('input, select, button.chip, .review')
  if (first) first.focus({ preventScroll: true })
}

function toggle(key, value) {
  choice[key] = choice[key] === value ? '' : value
}

// --- resumo e mensagem do WhatsApp
const v = (k) => (form[k] || '').trim()
const join = (parts, sep = ', ') => parts.filter(Boolean).join(sep)
const formatDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
const address = (p) => join([
  join([v(`${p}Rua`), v(`${p}Num`)]),
  v(`${p}Compl`),
  v(`${p}Bairro`),
  v(`${p}Cidade`),
  v(`${p}Cep`) && `CEP ${v(`${p}Cep`)}`,
], ' - ')
const hoursText = computed(() => {
  if (form.horaIni && form.horaFim) return `das ${form.horaIni} às ${form.horaFim}`
  if (form.horaIni) return `a partir das ${form.horaIni}`
  if (form.horaFim) return `até as ${form.horaFim}`
  return ''
})

const summary = computed(() =>
  [
    ['Solicitante', join([v('nome'), v('doc') && `CPF/CNPJ ${v('doc')}`])],
    ['Coleta', address('c')],
    ['Quando', join([formatDate(v('data')), hoursText.value])],
    ['Entrega', address('e')],
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
                  <template v-for="f in step.fields" :key="f.key">
                    <!-- horário: duas caixas de seleção -->
                    <div v-if="f.type === 'hours'" class="field field--wide" role="group" :aria-label="f.label">
                      <span class="field__label">{{ f.label }}</span>
                      <div class="hours">
                        <label class="hours__item">
                          <span>Das</span>
                          <select id="q-horaIni" v-model="form.horaIni" aria-label="Horário inicial">
                            <option value="">Início</option>
                            <option v-for="h in HOURS" :key="h" :value="h">{{ h }}</option>
                          </select>
                        </label>
                        <label class="hours__item">
                          <span>até</span>
                          <select id="q-horaFim" v-model="form.horaFim" aria-label="Horário final">
                            <option value="">Fim</option>
                            <option v-for="h in endHours" :key="h" :value="h">{{ h }}</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div v-else class="field" :class="{ 'field--wide': f.wide, 'field--cep': f.type === 'cep' }">
                      <label :for="`q-${f.key}`">{{ f.label }}</label>
                      <input
                        :id="`q-${f.key}`"
                        v-model="form[f.key]"
                        :name="f.key"
                        :type="f.type === 'date' ? 'date' : 'text'"
                        :placeholder="f.placeholder"
                        :inputmode="f.inputmode"
                        :autocomplete="f.autocomplete"
                        :maxlength="f.type === 'cep' ? 9 : f.maxlength"
                        :aria-describedby="f.type === 'cep' ? `q-${f.key}-status` : undefined"
                      >
                      <p
                        v-if="f.type === 'cep'"
                        :id="`q-${f.key}-status`"
                        class="cep-status"
                        :class="`cep-status--${cepStatus[f.prefix]}`"
                        aria-live="polite"
                      >{{ cepMessages[cepStatus[f.prefix]] || 'Digite o CEP e preenchemos o endereço.' }}</p>
                    </div>
                  </template>
                </div>

                <div v-if="step.choices" class="choices">
                  <div v-for="c in step.choices" :key="c.key" class="choice" role="group" :aria-label="c.label">
                    <span class="field__label">{{ c.label }}</span>
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
  box-shadow: 0 1px 0 var(--line), 0 40px 80px -40px rgba(0, 0, 0, 0.25);
}

/* rota de progresso */
.track { position: relative; height: 40px; margin: 0 18px 6px; }
.track__line { position: absolute; left: 0; right: 0; top: 18px; height: 4px; border-radius: 4px; background: var(--sky-2); overflow: hidden; }
.track__done { height: 100%; background: var(--cobalt); transition: width .6s var(--ease-out); }
.track__vehicle {
  position: absolute; top: 0; transform: translateX(-50%);
  display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
  background: var(--orange); color: #fff; box-shadow: 0 0 0 4px #fff;
  transition: left .6s var(--ease-out);
}

.tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin-bottom: 24px; }
.tab {
  width: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 10px 4px; border: 0; border-radius: 12px; background: transparent; cursor: pointer;
  font: inherit; font-size: 13px; line-height: 1.2; color: var(--ink-3); text-align: center;
}
.tab:hover { background: var(--sky); color: var(--ink); }
.tab--done { color: var(--orange); }
.tab--current { background: var(--sky); color: var(--ink); font-weight: 700; }

.panel__viewport { overflow: hidden; min-height: 250px; }
.panel__step { border: 0; margin: 0; padding: 0; min-width: 0; }
.panel__step legend { padding: 0; margin-bottom: 18px; }

.fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.field--wide { grid-column: 1 / -1; }
.field label, .field__label { font-size: 15px; font-weight: 600; color: var(--ink); }
.field input, .hours select {
  font: inherit; font-size: 17px; color: var(--ink);
  background: var(--sky); border: 2px solid transparent; border-radius: 14px;
  padding: 12px 16px; min-height: 52px; width: 100%;
  transition: border-color .2s ease, background-color .2s ease;
}
.field input::placeholder { color: #85858C; }
.field input:hover, .hours select:hover { border-color: var(--sky-2); }
.field input:focus, .hours select:focus { outline: none; border-color: var(--cobalt); background: #fff; }

/* horário início e fim */
.hours { display: flex; gap: 12px; flex-wrap: wrap; }
.hours__item { flex: 1 1 160px; display: flex; align-items: center; gap: 10px; font-size: 15px; color: var(--ink-2); }
.hours__item span { flex: none; }
.hours select {
  appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 44px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
}

/* status da consulta de CEP */
.cep-status { font-size: 13px; line-height: 1.35; color: var(--ink-3); min-height: 1.35em; }
.cep-status--loading { color: var(--ink-2); }
.cep-status--ok { color: #1B7F3B; }
.cep-status--notfound, .cep-status--error { color: var(--orange-2); }

.choices { display: grid; gap: 18px; margin-top: 22px; }
.choice .field__label { display: block; margin-bottom: 8px; }
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
