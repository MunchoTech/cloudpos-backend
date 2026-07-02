import api from './api'

export const salesService = {
  async processSale(data)   { return (await api.post('/sales', data)).data },
  async getAll()            { return (await api.get('/sales')).data },
  async getById(id)         { return (await api.get(`/sales/${id}`)).data },
  async getToday()          { return (await api.get('/sales/today')).data },
}
