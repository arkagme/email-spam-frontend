import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  checkHealth: () => api.get('/health'),

  // Generate test code
  generateTest: (userEmail) => api.post('/api/tests', { userEmail }),

  // Trigger detection
  detectEmails: (testCode) => api.post(`/api/tests/${testCode}/detect`),

  // Get test status
  getTestStatus: (testCode) => api.get(`/api/tests/${testCode}/status`),

  // Get test results
  getTestResults: (testCode) => api.get(`/api/tests/${testCode}`),

  // Get report
  getReport: (testCode) => api.get(`/api/reports/${testCode}`),

  // Get report summary
  getReportSummary: (testCode) => api.get(`/api/reports/${testCode}/summary`),

  // Get PDF report
  getReportPdf: (testCode) => api.get(`/api/reports/${testCode}`, {
    params: { format: 'pdf' },
    responseType: 'blob',
  }),

  // Send report by email
  sendReportEmail: (testCode, email) => 
    api.post(`/api/reports/${testCode}/send`, { email }),

  // Get test history
  getTestHistory: (userEmail) => api.get(`/api/tests/history/${userEmail}`),

  // Get test statistics
  getTestStatistics: (userEmail) => api.get(`/api/tests/statistics/${userEmail}`),
};

export default api;