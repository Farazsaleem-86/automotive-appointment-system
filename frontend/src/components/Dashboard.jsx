import React, { useState, useEffect } from 'react'
import { Users, Calendar, Phone, TrendingUp, Car, Clock, CheckCircle, AlertCircle } from 'lucide-react'
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-carvana-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  const statCards = [
    { title: 'Total Customers', value: stats?.total_customers || 0, icon: Users, color: 'bg-carvana-blue', trend: '+12%' },
    { title: 'Total Leads', value: stats?.total_leads || 0, icon: Phone, color: 'bg-green-500', trend: '+8%' },
    { title: 'New Leads', value: stats?.new_leads || 0, icon: TrendingUp, color: 'bg-purple-500', trend: '+15%' },
    { title: 'Today\'s Appointments', value: stats?.today_appointments || 0, icon: Calendar, color: 'bg-carvana-orange', trend: '+5%' },
  ]
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your dealership today</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-500 text-sm font-semibold">{card.trend}</span>
                </div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
            )
          })}
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-carvana-blue to-blue-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl p-4 text-left transition-colors">
              <Car className="w-8 h-8 mb-2" />
              <p className="font-semibold">View Inventory</p>
              <p className="text-sm text-blue-100">Browse available cars</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl p-4 text-left transition-colors">
              <Calendar className="w-8 h-8 mb-2" />
              <p className="font-semibold">Book Test Drive</p>
              <p className="text-sm text-blue-100">Schedule new appointment</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl p-4 text-left transition-colors">
              <Users className="w-8 h-8 mb-2" />
              <p className="font-semibold">Add Customer</p>
              <p className="text-sm text-blue-100">Register new lead</p>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
              <Clock className="w-5 h-5 text-carvana-blue" />
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:border-carvana-blue hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="font-semibold text-gray-800">{appointment.service_type}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.appointment_time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Leads */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Leads</h2>
              <AlertCircle className="w-5 h-5 text-carvana-orange" />
            </div>
            {recentLeads.length === 0 ? (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent leads</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-xl p-4 hover:border-carvana-blue hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">{lead.reason_for_contact}</p>
                        <p className="text-sm text-gray-600">{lead.service_requested || 'No service specified'}</p>
                        {lead.vehicle_of_interest && (
                          <p className="text-sm text-carvana-blue mt-1">Interested in: {lead.vehicle_of_interest}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'New Lead' ? 'bg-blue-100 text-blue-800' : 
                        lead.status === 'Follow-Up' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'Appointment Scheduled' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
