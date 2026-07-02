export const formatKwacha = (amount) =>
  `K ${Number(amount || 0).toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-ZM', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-ZM', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const todayISO = () => new Date().toISOString().split('T')[0]

export const PAYMENT_METHODS = ['CASH', 'CARD', 'MOBILE_MONEY']
