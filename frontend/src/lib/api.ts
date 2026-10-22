import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
})

// Attach token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
    return Promise.reject(err)
  }
)

export const stackApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login', { email, password }),
  logout: () => api.post('/api/v1/auth/logout'),
  getMe: () => api.get('/api/v1/auth/me'),

  // Dashboard
  getDashboard: () => api.get('/api/v1/dashboard'),

  // Accounts
  getAccounts: () => api.get('/api/v1/accounts'),

  // Cashflow
  getCashflow: (period = '12m') => api.get(`/api/v1/cashflow?period=${period}`),

  // Obligations
  getObligations: (status?: string) =>
    api.get(`/api/v1/obligations${status ? `?status=${status}` : ''}`),

  // Payments
  getPayments: (page = 1, status?: string) =>
    api.get(`/api/v1/payments?page=${page}${status ? `&status=${status}` : ''}`),

  // Loans
  getLoans: () => api.get('/api/v1/loans'),
  getRepayments: () => api.get('/api/v1/repayments'),

  // Portfolio
  getPortfolioHealth: () => api.get('/api/v1/portfolio/health'),

  // Recommendations
  getRecommendations: () => api.get('/api/v1/recommendations'),

  // Businesses
  getBusinesses: () => api.get('/api/v1/businesses'),

  // Agents
  analyzeTreasury: (data: Record<string, unknown>) =>
    api.post('/api/v1/treasury/analyze', data),
  assessLending: (data: Record<string, unknown>) =>
    api.post('/api/v1/lending/assess', data),
  simulateScenario: (data: Record<string, unknown>) =>
    api.post('/api/v1/scenarios/simulate', data),

  // Approvals
  getApprovals: () => api.get('/api/v1/approvals'),
  createApproval: (data: Record<string, unknown>) =>
    api.post('/api/v1/approvals', data),
  approveRequest: (id: string, notes?: string) =>
    api.post(`/api/v1/approvals/${id}/approve`, { notes }),
  rejectRequest: (id: string, notes?: string) =>
    api.post(`/api/v1/approvals/${id}/reject`, { notes }),

  // Audit
  getAuditLog: (page = 1) => api.get(`/api/v1/audit?page=${page}`),

  // Assistant
  chat: (message: string, history: Array<{ role: string; content: string }>) =>
    api.post('/api/v1/assistant/chat', { message, history }),

  // Health
  getHealth: () => api.get('/api/v1/health'),
}
