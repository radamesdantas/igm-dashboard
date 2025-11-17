import axios from 'axios';

// Em produção, usa a variável de ambiente VITE_API_URL
// Em desenvolvimento, usa proxy local (/api)
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: baseURL,
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

// Metas 2026
export const metasAPI = {
  getAll: (params) => api.get('/metas', { params }),
  getById: (id) => api.get(`/metas/${id}`),
  create: (data) => api.post('/metas', data),
  update: (id, data) => api.put(`/metas/${id}`, data),
  updateProgresso: (id, data) => api.patch(`/metas/${id}/progresso`, data),
  delete: (id) => api.delete(`/metas/${id}`),
  getStats: (ano = 2026) => api.get(`/metas/stats/${ano}`),

  // Submetas
  getSubmetas: (metaId) => api.get(`/metas/${metaId}/submetas`),
  createSubmeta: (metaId, data) => api.post(`/metas/${metaId}/submetas`, data),
  updateSubmeta: (metaId, id, data) => api.put(`/metas/${metaId}/submetas/${id}`, data),
  toggleSubmeta: (metaId, id) => api.patch(`/metas/${metaId}/submetas/${id}/toggle`),
  deleteSubmeta: (metaId, id) => api.delete(`/metas/${metaId}/submetas/${id}`),

  // Atualizações
  getAtualizacoes: (metaId) => api.get(`/metas/${metaId}/atualizacoes`),
};

export default api;
