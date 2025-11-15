import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços
export const servicosAPI = {
  getAll: () => api.get('/servicos'),
  getById: (id) => api.get(`/servicos/${id}`),
  create: (data) => api.post('/servicos', data),
  update: (id, data) => api.put(`/servicos/${id}`, data),
  delete: (id) => api.delete(`/servicos/${id}`),
};

// Ações
export const acoesAPI = {
  getAll: (params) => api.get('/acoes', { params }),
  getByServico: (servicoId) => api.get(`/acoes/servico/${servicoId}`),
  create: (data) => api.post('/acoes', data),
  update: (id, data) => api.put(`/acoes/${id}`, data),
  delete: (id) => api.delete(`/acoes/${id}`),
};

// Reuniões
export const reunioesAPI = {
  getAll: (params) => api.get('/reunioes', { params }),
  getByServico: (servicoId) => api.get(`/reunioes/servico/${servicoId}`),
  create: (data) => api.post('/reunioes', data),
  update: (id, data) => api.put(`/reunioes/${id}`, data),
  delete: (id) => api.delete(`/reunioes/${id}`),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;
