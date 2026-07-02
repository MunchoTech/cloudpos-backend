import api from './api'

export const productService = {
  async getAll()                  { return (await api.get('/products')).data },
  async getById(id)               { return (await api.get(`/products/${id}`)).data },
  async create(data)              { return (await api.post('/products', data)).data },
  async update(id, data)          { return (await api.put(`/products/${id}`, data)).data },
  async remove(id)                { return (await api.delete(`/products/${id}`)).data },
  async search(name)              { return (await api.get(`/products/search?name=${name}`)).data },
  async getLowStock()             { return (await api.get('/products/low-stock')).data },
  async adjustStock(id, quantity) { return (await api.patch(`/products/${id}/stock?quantity=${quantity}`)).data },
}
