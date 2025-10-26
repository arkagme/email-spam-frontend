import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  checkHealth: () => api.get('/health'),
  generateTest: (userEmail) => api.post('/api/tests', { userEmail }),
  detectEmails: (testCode) => api.post(`/api/tests/${testCode}/detect`),
  getTestStatus: (testCode) => api.get(`/api/tests/${testCode}/status`),
  getTestResults: (testCode) => api.get(`/api/tests/${testCode}`),
  getReport: (testCode) => api.get(`/api/reports/${testCode}`),
  getReportSummary: (testCode) => api.get(`/api/reports/${testCode}/summary`),
  getReportPdf: (testCode) => api.get(`/api/reports/${testCode}`, {
    params: { format: 'pdf' },
    responseType: 'blob',
  }),
  sendReportEmail: (testCode, email) => 
    api.post(`/api/reports/${testCode}/send`, { email }),
  getTestHistory: (userEmail) => api.get(`/api/tests/history/${userEmail}`),
  getTestStatistics: (userEmail) => api.get(`/api/tests/statistics/${userEmail}`),
};

export default api;