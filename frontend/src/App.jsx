import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import CustomerForm from './components/CustomerForm'
import AppointmentForm from './components/AppointmentForm'
import LeadList from './components/LeadList'
import AppointmentList from './components/AppointmentList'
import Navigation from './components/Navigation'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/appointments" element={<AppointmentList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
