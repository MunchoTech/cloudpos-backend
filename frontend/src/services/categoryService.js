import api from './api'

export const categoryService = {
  async getAll()              { return (await api.get('/categories')).data },
  async getById(id)           { return (await api.get(`/categories/${id}`)).data },
  async create(data)          { return (await api.post('/categories', data)).data },
  async update(id, data)      { return (await api.put(`/categories/${id}`, data)).data },
  async remove(id)            { return (await api.delete(`/categories/${id}`)).data },
  async search(name)          { return (await api.get(`/categories/search?name=${name}`)).data },
  async getProducts(id)       { return (await api.get(`/categories/${id}/products`)).data },
}
