import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../apiConfig'
import { Calendar, Clock, User, Car, CheckCircle, ArrowRight } from 'lucide-react'

function AppointmentForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedVehicle = location.state?.vehicle || ''
  const selectedServiceType = location.state?.serviceType || ''
  const [customers, setCustomers] = useState([])
  const [leads, setLeads] = useState([])
  const [formData, setFormData] = useState({
    customer_id: '',
    lead_id: '',
    service_type: selectedServiceType,
    appointment_date: '',
    appointment_time: '',
    notes: selectedVehicle ? `Vehicle of interest: ${selectedVehicle}` : '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  
  useEffect(() => {
    fetchCustomers()
    fetchLeads()
  }, [])
  
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/customers`)
      setCustomers(res.data)
    } catch (err) {
      console.error('Error fetching customers:', err)
    }
  }
  
  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/leads`)
      setLeads(res.data.filter(lead => lead.status !== 'Closed'))
    } catch (err) {
      console.error('Error fetching leads:', err)
    }
  }
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const payload = {
        ...formData,
        customer_id: parseInt(formData.customer_id),
        lead_id: formData.lead_id ? parseInt(formData.lead_id) : null,
      }
      await axios.post(`${API_BASE_URL}/api/appointments`, payload)
      navigate('/')
    } catch (err) {
      setError('Failed to create appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const serviceTypes = [
    'Test Drive',
    'Vehicle Inspection',
    'Oil Change',
    'Tire Service',
    'Brake Service',
    'General Maintenance',
    'Consultation',
    'Other'
  ]
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book Your Test Drive</h1>
          <p className="text-gray-600 text-lg">
            {selectedVehicle || 'Schedule your appointment in just a few simple steps'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-carvana-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-carvana-blue' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-carvana-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 2 ? <CheckCircle className="w-6 h-6" /> : '2'}
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-carvana-blue' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600">
            3
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-carvana-blue" />
                  <h2 className="text-2xl font-bold text-gray-800">Select Customer</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer *
                  </label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-carvana-blue focus:ring-2 focus:ring-carvana-blue/20 transition-all"
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name} - {customer.phone_number}
                      </option>
                    ))}
                  </select>
                </div>

                <Link
                  to="/customers/new"
                  className="inline-flex text-sm font-semibold text-carvana-blue hover:text-blue-700"
                >
                  Create a new customer first
                </Link>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Associated Lead (Optional)
                  </label>
                  <select
                    name="lead_id"
                    value={formData.lead_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-carvana-blue focus:ring-2 focus:ring-carvana-blue/20 transition-all"
                  >
                    <option value="">No lead</option>
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.reason_for_contact}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Service Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Car className="w-6 h-6 text-carvana-blue" />
                  <h2 className="text-2xl font-bold text-gray-800">Select Service</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-carvana-blue focus:ring-2 focus:ring-carvana-blue/20 transition-all"
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Any additional details about your appointment..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-carvana-blue focus:ring-2 focus:ring-carvana-blue/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-carvana-blue" />
                  <h2 className="text-2xl font-bold text-gray-800">Choose Date & Time</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      name="appointment_date"
                      value={formData.appointment_date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-carvana-blue focus:ring-2 focus:ring-carvana-blue/20 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Appointment Time *
                    </label>
                    <input
                      type="time"
                      name="appointment_time"
                      value={formData.appointment_time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-carvana-blue focus:ring-2 focus:ring-carvana-blue/20 transition-all"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mt-6">
                  <h3 className="font-bold text-gray-800 mb-4">Appointment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Service:</span> <span className="font-semibold">{formData.service_type}</span></p>
                    <p><span className="text-gray-600">Date:</span> <span className="font-semibold">{formData.appointment_date}</span></p>
                    <p><span className="text-gray-600">Time:</span> <span className="font-semibold">{formData.appointment_time}</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !formData.customer_id}
                  className="ml-auto px-8 py-3 bg-carvana-blue text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-8 py-3 bg-carvana-orange text-white rounded-xl font-semibold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? 'Scheduling...' : 'Confirm Appointment'}
                  <CheckCircle className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AppointmentForm
