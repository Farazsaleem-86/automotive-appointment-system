import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import CustomerForm from './components/CustomerForm'
import AppointmentForm from './components/AppointmentForm'
import LeadList from './components/LeadList'
import AppointmentList from './components/AppointmentList'
import Inventory from './components/Inventory'
import Navigation from './components/Navigation'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
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
