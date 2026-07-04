import React, { useState, useEffect } from 'react'
import { Users, Calendar, Phone, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../apiConfig'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes, leadsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/stats`),
        axios.get(`${API_BASE_URL}/api/dashboard/upcoming-appointments`),
        axios.get(`${API_BASE_URL}/api/dashboard/recent-leads`)
      ])
      
      setStats(statsRes.data)
      setUpcomingAppointments(appointmentsRes.data)
      setRecentLeads(leadsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }
  
  const statCards = [
    { title: 'Total Customers', value: stats?.total_customers || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Leads', value: stats?.total_leads || 0, icon: Phone, color: 'bg-green-500' },
    { title: 'New Leads', value: stats?.new_leads || 0, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Today\'s Appointments', value: stats?.today_appointments || 0, icon: Calendar, color: 'bg-orange-500' },
  ]
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <p className="font-medium text-gray-800">{appointment.service_type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Leads</h2>
          {recentLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent leads</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <p className="font-medium text-gray-800">{lead.reason_for_contact}</p>
                  <p className="text-sm text-gray-600">{lead.service_requested || 'No service specified'}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    lead.status === 'New Lead' ? 'bg-blue-100 text-blue-800' : 
                    lead.status === 'Follow-Up' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
