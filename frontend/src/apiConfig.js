// API Configuration
// Update this URL after deploying the backend to Render
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  customers: `${API_BASE_URL}/api/customers`,
  leads: `${API_BASE_URL}/api/leads`,
  appointments: `${API_BASE_URL}/api/appointments`,
  communications: `${API_BASE_URL}/api/communications`,
  dashboard: {
    stats: `${API_BASE_URL}/api/dashboard/stats`,
    upcomingAppointments: `${API_BASE_URL}/api/dashboard/upcoming-appointments`,
    recentLeads: `${API_BASE_URL}/api/dashboard/recent-leads`,
  },
  processInteraction: `${API_BASE_URL}/api/process-interaction`,
};
