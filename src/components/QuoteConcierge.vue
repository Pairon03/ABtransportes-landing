<script setup>
import { computed, reactive } from 'vue'
import { GREETING, waLink } from '../config'
import ArrowIcon from './ArrowIcon.vue'

// Campos do formulário, agrupados como no layout
const sections = [
  {
    num: 'i.', title: 'Solicitante',
    fields: [
      { key: 'nome', label: 'Nome ou empresa', placeholder: 'Maria Silva ou Empresa X', autocomplete: 'organization' },
      { key: 'doc', label: 'CPF ou CNPJ', placeholder: 'Somente números', inputmode: 'numeric' },
    ],
  },
  {
    num: 'ii.', title: 'Ponto A · Coleta',
    fields: [
      { key: 'cCidade', label: 'Cidade', placeholder: 'Campinas' },
      { key: 'cCep', label: 'CEP', placeholder: '00000-000', inputmode: 'numeric', autocomplete: 'postal-code' },
      { key: 'cEnd', label: 'Endereço completo', placeholder: 'Rua, número, bairro', autocomplete: 'street-address' },
      { key: 'cHora', label: 'Horário disponível', placeholder: '8h às 12h' },
      { key: 'data', label: 'Data desejada', type: 'date' },
    ],
  },
  {
    num: 'iii.', title: 'Ponto B · Entrega',
    fields: [
      { key: 'eCidade', label: 'Cidade', placeholder: 'São Paulo' },
      { key: 'eCep', label: 'CEP', placeholder: '00000-000', inputmode: 'numeric' },
      { key: 'eEnd', label: 'Endereço completo', placeholder: 'Rua, número, bairro' },
    ],
  },
  {
    num: 'iv.', title: 'A carga',
    fields: [
      { key: 'peso', label: 'Peso (kg)', placeholder: '25', inputmode: 'decimal' },
      { key: 'dim', label: 'Dimensões C × L × A (cm)', placeholder: '60 × 40 × 40' },
      { key: 'vol', label: 'Volumes', placeholder: '3', inputmode: 'numeric' },
      { key: 'tipo', label: 'Tipo de material', placeholder: 'Documentos, eletrônicos…' },
    ],
  },
]

const choiceGroups = [
  { num: 'v.', key: 'modalidade', title: 'Modalidade', options: ['Veículo exclusivo', 'Carga fracionada'] },
  { num: 'vi.', key: 'fragil', title: 'Material frágil?', options: ['Sim', 'Não'] },
]

const fieldKeys = sections.flatMap((s) => s.fields.map((f) => f.key))
const form = reactive(Object.fromEntries(fieldKeys.map((k) => [k, ''])))
const choice = reactive({ modalidade: '', fragil: '' })

function toggle(key, value) {
  choice[key] = choice[key] === value ? '' : value
}

const v = (k) => (form[k] || '').trim()
const join = (parts) => parts.filter(Boolean).join(' · ')
const formatDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')

const rows = computed(() =>
  [
    ['Solicitante', join([v('nome'), v('doc')])],
    ['Coleta', join([v('cEnd'), v('cCidade'), v('cCep')])],
    ['Quando', join([formatDate(v('data')), v('cHora')])],
    ['Entrega', join([v('eEnd'), v('eCidade'), v('eCep')])],
    ['Carga', join([
      v('peso') && `${v('peso')} kg`,
      v('dim') && `${v('dim')} cm`,
      v('vol') && `${v('vol')} volume(s)`,
      v('tipo'),
    ])],
    ['Modalidade', choice.modalidade],
    ['Frágil', choice.fragil],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => ({ label, value })),
)

const total = fieldKeys.length + choiceGroups.length
const filled = computed(
  () => fieldKeys.filter((k) => v(k)).length + choiceGroups.filter((g) => choice[g.key]).length,
)
const progress = computed(() => Math.round((filled.value / total) * 100))

const quoteLink = computed(() => {
  const lines = [GREETING, '', ...rows.value.map((r) => `*${r.label}:* ${r.value}`)]
  return waLink(lines.join('\n'))
})
</script>

<template>
  <section id="concierge" class="wrap-x section concierge-section">
    <div class="container stack-xl">
      <div class="section-head">
        <h2 class="display-xl">Solicite seu <em>orçamento.</em></h2>
        <p class="body section-head__aside">
          Para calcular o valor do transporte com precisão, precisamos de algumas informações.
          Sua solicitação é montada ao lado e enviada pelo WhatsApp.
        </p>
      </div>

      <div class="concierge">
        <form class="form" aria-label="Solicitar orçamento" novalidate @submit.prevent>
          <fieldset v-for="section in sections" :key="section.num">
            <legend><span>{{ section.num }}</span>{{ section.title }}</legend>
            <div class="fields">
              <div v-for="f in section.fields" :key="f.key" class="field">
                <label :for="`campo-${f.key}`">{{ f.label }}</label>
                <input
                  :id="`campo-${f.key}`"
                  v-model="form[f.key]"
                  :name="f.key"
                  :type="f.type || 'text'"
                  :placeholder="f.placeholder"
                  :inputmode="f.inputmode"
                  :autocomplete="f.autocomplete"
                >
              </div>
            </div>
          </fieldset>

          <div class="choices">
            <fieldset v-for="group in choiceGroups" :key="group.key">
              <legend><span>{{ group.num }}</span>{{ group.title }}</legend>
              <div class="chips">
                <button
                  v-for="option in group.options"
                  :key="option"
                  type="button"
                  class="chip"
                  :aria-pressed="choice[group.key] === option"
                  @click="toggle(group.key, option)"
                >
                  {{ option }}
                </button>
              </div>
            </fieldset>
          </div>
        </form>

        <aside class="preview" aria-label="Prévia da sua solicitação">
          <div class="preview__head">
            <span class="preview__title">Sua solicitação</span>
            <span class="preview__count" aria-live="polite">{{ filled }} / {{ total }}</span>
          </div>

          <p v-if="rows.length === 0" class="preview__empty">
            Preencha os campos. Cada detalhe aparece aqui, pronto para seguir pelo WhatsApp.
          </p>
          <dl v-else class="preview__list">
            <div v-for="row in rows" :key="row.label">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>

          <div class="preview__bar" aria-hidden="true">
            <div :style="{ width: `${progress}%` }"></div>
          </div>

          <a class="btn btn--bone" :href="quoteLink" target="_blank" rel="noopener">
            Enviar pelo WhatsApp <ArrowIcon />
          </a>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.concierge-section { background: var(--paper); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.section-head__aside { flex: 1 1 340px; min-width: 0; }
.concierge { display: flex; flex-wrap: wrap; gap: 56px clamp(40px, 6vw, 96px); align-items: flex-start; }

.form { flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 56px; }
fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
legend {
  padding: 0; margin-bottom: 4px; display: flex; align-items: baseline; gap: 16px;
  font-family: var(--serif); font-weight: 400; font-size: 30px;
}
legend span { font-style: italic; font-size: 20px; color: var(--wine); }
.fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0 40px; }
.field { display: flex; flex-direction: column; gap: 2px; padding-top: 22px; }
.field label { font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); }
.field input {
  font-family: var(--serif); font-size: 22px; font-weight: 400; color: var(--ink);
  background: transparent; border: 0; border-bottom: 1px solid var(--line-2); border-radius: 0;
  padding: 8px 0 10px; min-height: 48px; width: 100%; transition: border-color .25s ease;
}
.field input::placeholder { color: #8C8378; }
.field input:focus { outline: none; border-bottom-color: var(--wine); }

.choices { display: flex; flex-wrap: wrap; gap: 40px 64px; }
.choices legend { margin-bottom: 18px; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip {
  font-family: var(--sans); font-size: 12px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase;
  padding: 16px 22px; min-height: 52px; border-radius: 0; border: 1px solid var(--line-2);
  background: transparent; color: var(--ink); cursor: pointer;
  transition: background-color .25s ease, color .25s ease, border-color .25s ease;
}
.chip:hover { border-color: var(--ink); }
.chip[aria-pressed='true'] { background: var(--ink); border-color: var(--ink); color: var(--bone); }

.preview {
  flex: 1 1 340px; min-width: 0; position: sticky; top: 24px;
  background: var(--ink); color: var(--bone); padding: clamp(28px, 3vw, 44px);
  display: flex; flex-direction: column; gap: 28px;
}
.preview__head {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  border-bottom: 1px solid var(--dark-line); padding-bottom: 20px;
}
.preview__title { font-family: var(--serif); font-size: 28px; }
.preview__count { font-size: 11px; font-weight: 500; letter-spacing: 3px; color: var(--rose-2); }
.preview__empty { font-family: var(--serif); font-style: italic; font-size: 22px; line-height: 1.45; color: var(--dark-muted); }
.preview__list { display: flex; flex-direction: column; gap: 16px; }
.preview__list dt { font-size: 10px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--dark-muted); }
.preview__list dd { font-family: var(--serif); font-size: 21px; line-height: 1.3; overflow-wrap: anywhere; margin-top: 4px; }
.preview__bar { height: 1px; background: var(--dark-line); position: relative; }
.preview__bar div { position: absolute; left: 0; top: 0; height: 1px; background: var(--rose); transition: width .4s ease; }

@media (max-width: 720px) {
  .preview { position: static; }
}
</style>
