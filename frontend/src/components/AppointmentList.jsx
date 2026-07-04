import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../apiConfig'

function AppointmentList() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    fetchAppointments()
  }, [filter])
  
  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const res = await axios.get(`${API_BASE_URL}/api/appointments`, { params })
      setAppointments(res.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/appointments/${appointmentId}`, { status: newStatus })
      fetchAppointments()
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }
  
  const deleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/appointments/${appointmentId}`)
        fetchAppointments()
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }
  
  const statusColors = {
    'Scheduled': 'bg-green-100 text-green-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Missed': 'bg-yellow-100 text-yellow-800',
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Missed">Missed</option>
        </select>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No appointments found
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reminders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.service_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.appointment_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appointment.status]}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-1">
                      {appointment.confirmation_sent && (
                        <span className="text-green-600" title="Confirmation sent">✓</span>
                      )}
                      {appointment.reminder_24h_sent && (
                        <span className="text-blue-600" title="24h reminder sent">✓</span>
                      )}
                      {appointment.reminder_2h_sent && (
                        <span className="text-purple-600" title="2h reminder sent">✓</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Missed">Missed</option>
                    </select>
                    <button
                      onClick={() => deleteAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AppointmentList
