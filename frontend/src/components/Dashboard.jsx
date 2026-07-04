import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Car, CheckCircle, Clock, Phone, Search, ShieldCheck, Sparkles, Users } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../apiConfig'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/stats`),
        axios.get(`${API_BASE_URL}/api/dashboard/upcoming-appointments`),
      ])

      setStats(statsRes.data)
      setUpcomingAppointments(appointmentsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const serviceHighlights = [
    {
      title: 'Browse Cars',
      text: 'Search available vehicles by price, year, mileage, and body style.',
      icon: Search,
      path: '/inventory',
    },
    {
      title: 'Schedule Fast',
      text: 'Book a test drive, inspection, or service visit in a few steps.',
      icon: Calendar,
      path: '/appointments/new',
    },
    {
      title: 'Get Follow-Up',
      text: 'Your lead, reminders, and appointment updates stay organized.',
      icon: Phone,
      path: '/customers/new',
    },
  ]

  const trustItems = [
    { label: 'Quality checked vehicles', icon: ShieldCheck },
    { label: 'Simple appointment flow', icon: Clock },
    { label: 'Personal follow-up', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative min-h-[calc(100vh-5rem)] bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(10, 24, 41, 0.88), rgba(10, 24, 41, 0.62), rgba(10, 24, 41, 0.2)), url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1800&h=1100&fit=crop')",
        }}
      >
        <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col justify-center px-4 py-12">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Car shopping and appointments in one place
            </div>
            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-6xl">
              Find the right car, then book your visit.
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-blue-50 md:text-xl">
              Browse vehicles, pick a test drive time, and let the appointment team keep every customer conversation organized.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/inventory"
                className="inline-flex items-center justify-center rounded-lg bg-carvana-orange px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                Search Cars
                <Search className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/appointments/new"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-bold text-carvana-dark shadow-lg transition-colors hover:bg-gray-100"
              >
                Book Appointment
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 gap-4 px-4 py-6 md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-3 text-carvana-blue shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-gray-800">{item.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Start With What You Need</h2>
            <p className="mt-2 text-gray-600">A dealership workflow built around the next customer action.</p>
          </div>
          <Link to="/inventory" className="inline-flex items-center font-bold text-carvana-blue hover:text-blue-700">
            View inventory
            <Car className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {serviceHighlights.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                to={item.path}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-carvana-blue hover:shadow-md"
              >
                <div className="mb-5 inline-flex rounded-lg bg-blue-50 p-3 text-carvana-blue">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Appointment Desk</h2>
            <p className="mt-2 text-gray-600">
              Keep test drives, service visits, and customer follow-ups moving from one clean dashboard.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Customers</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.total_customers || 0}</p>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Today</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.today_appointments || 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Upcoming Appointments</h3>
              <Link to="/appointments" className="text-sm font-bold text-carvana-blue hover:text-blue-700">
                Manage
              </Link>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 p-5 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                No upcoming appointments yet.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 4).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.service_type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
