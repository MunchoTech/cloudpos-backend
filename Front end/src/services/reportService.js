import api from './api'

export const reportService = {
  async getDaily(date)        { return (await api.get(`/reports/daily${date ? `?date=${date}` : ''}`)).data },
  async getWeekly(startDate)  { return (await api.get(`/reports/weekly${startDate ? `?startDate=${startDate}` : ''}`)).data },
  async getSummary()          { return (await api.get('/reports/summary')).data },
}
