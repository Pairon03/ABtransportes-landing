// Máscaras e consulta de CEP usadas no formulário de orçamento.

export const onlyDigits = (v) => String(v || '').replace(/\D/g, '')

// CPF (11 dígitos) ou CNPJ (14 dígitos). Nunca passa de 14 números.
export function maskCpfCnpj(value) {
  const d = onlyDigits(value).slice(0, 14)
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export function maskCep(value) {
  const d = onlyDigits(value).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

// Consulta pública do ViaCEP. Retorna null se o CEP não existir.
export async function fetchCep(cep) {
  const d = onlyDigits(cep)
  const res = await fetch(`https://viacep.com.br/ws/${d}/json/`)
  if (!res.ok) throw new Error('Falha na consulta do CEP')
  const data = await res.json()
  if (data.erro) return null
  return {
    rua: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade && data.uf ? `${data.localidade}/${data.uf}` : (data.localidade || ''),
  }
}

// Horários das 24 horas, de 30 em 30 minutos (00:00, 00:30 … 23:30)
export const HOURS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  return `${String(h).padStart(2, '0')}:${i % 2 ? '30' : '00'}`
})
