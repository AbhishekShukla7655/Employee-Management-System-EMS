import api from '../interceptors/axiosInstance'

// Auth
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout', { refreshToken: localStorage.getItem('ems-refresh-token') }),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
}

// Employees
export const employeeService = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  uploadImage: (id, formData) => api.post(`/employees/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getProfile: () => api.get('/employees/profile'),
  updateProfile: (data) => api.put('/employees/profile', data),
  getStats: () => api.get('/employees/stats'),
}

// Managers
export const managerService = {
  getAll: (params) => api.get('/managers', { params }),
  getById: (id) => api.get(`/managers/${id}`),
  create: (data) => api.post('/managers', data),
  update: (id, data) => api.put(`/managers/${id}`, data),
  delete: (id) => api.delete(`/managers/${id}`),
  getTeam: () => api.get('/managers/team'),
  getProfile: () => api.get('/managers/profile'),
}

// Tasks
export const taskService = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  getMyTasks: (params) => api.get('/tasks/my-tasks', { params }),
  getTeamTasks: (params) => api.get('/tasks/team', { params }),
}

// Attendance
export const attendanceService = {
  getAll: (params) => api.get('/attendance', { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  getMyAttendance: (params) => api.get('/attendance/my', { params }),
  getTeamAttendance: (params) => api.get('/attendance/team', { params }),
  checkIn: () => api.post('/attendance/check-in'),
  checkOut: () => api.post('/attendance/check-out'),
}

// Salary
export const salaryService = {
  getAll: (params) => api.get('/salary', { params }),
  getById: (id) => api.get(`/salary/${id}`),
  generate: (data) => api.post('/salary/generate', data),
  getMySalary: (params) => api.get('/salary/my', { params }),
  getSlip: (id) => api.get(`/salary/${id}/slip`, { responseType: 'blob' }),
  getSummary: () => api.get('/salary/summary'),
}

// Dashboard
export const dashboardService = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getManagerStats: () => api.get('/dashboard/manager'),
  getEmployeeStats: () => api.get('/dashboard/employee'),
}

// Users / Role management
export const userService = {
  getAll: (params) => api.get('/users', { params }),
  changeRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
}
