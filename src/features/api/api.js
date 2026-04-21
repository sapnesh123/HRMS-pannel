import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (credentials) => api.post('/auth/signup', credentials),
  createByAdmin: (userData) => api.post('/auth/admin/create', userData),
  checkVerified: () => api.get('/auth/checkverified'),
  logout: () => api.post('/auth/logout'),
};

export const employeeApi = {
  getAll: () => api.get('/employee/get'),
  create: (data) => api.post('/employee/create', data),
  update: (id, data) => api.patch(`/employee/update/${id}`, data),
  delete: (id) => api.delete(`/employee/delete/${id}`),
  getById: (id) => api.get(`/employee/show/${id}`),
};

export const attendanceApi = {
  punchIn: (data) => api.post('/attendance/punch-in', data),
  punchOut: (data) => api.post('/attendance/punch-out', data),
  getToday: () => api.get('/attendance/today'),
  getMy: () => api.get('/attendance/my'),
  getUserAttendance: (userId) => api.get(`/attendance/user/${userId}`),
  getById: (id) => api.get(`/attendance/${id}`),
};

export const overtimeApi = {
  request: (data) => api.post('/overtime/request', data),
  getMyRequests: () => api.get('/overtime/my-requests'),
  approve: (id) => api.patch(`/overtime/approve/${id}`),
  reject: (id) => api.patch(`/overtime/reject/${id}`),
};

export const dashboardApi = {
  getEmployee: () => api.get('/dashboard/employee'),
  getManager: () => api.get('/dashboard/manager'),
  getAdmin: () => api.get('/dashboard/admin'),
  getDailyReport: (date) => api.get('/dashboard/reports/daily', { params: { date } }),
  getDateRangeReport: (startDate, endDate) => api.get('/dashboard/reports/range', { params: { startDate, endDate } }),
  getOvertimeReport: () => api.get('/dashboard/reports/overtime'),
};

export const userApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/users/all?${query}`);
  },
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
  getTeamMembers: () => api.get('/users/team/members'),
};

export default api;