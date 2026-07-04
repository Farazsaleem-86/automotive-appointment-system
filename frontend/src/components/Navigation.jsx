import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, Phone, Car, Search } from 'lucide-react'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Inventory', icon: Car },
    { path: '/customers/new', label: 'New Customer', icon: Users },
    { path: '/appointments/new', label: 'Book Test Drive', icon: Calendar },
    { path: '/leads', label: 'Leads', icon: Phone },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
  ]
  
  return (
    <nav className="bg-white shadow-lg border-b-4 border-carvana-blue">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="bg-carvana-blue p-2 rounded-lg">
              <CarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-carvana-dark">AutoDealership</span>
              <p className="text-xs text-gray-500">Premium Car Sales & Service</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-carvana-blue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-carvana-blue'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/inventory"
              className="bg-carvana-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md"
            >
              <Search className="w-4 h-4 inline mr-2" />
              Search Cars
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function CarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  )
}

export default Navigation
