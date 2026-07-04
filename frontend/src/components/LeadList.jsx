import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../apiConfig'

function LeadList() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    fetchLeads()
  }, [filter])
  
  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const res = await axios.get(`${API_BASE_URL}/api/leads`, { params })
      setLeads(res.data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/leads/${leadId}`, { status: newStatus })
      fetchLeads()
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }
  
  const statusColors = {
    'New Lead': 'bg-blue-100 text-blue-800',
    'Follow-Up': 'bg-yellow-100 text-yellow-800',
    'Appointment Scheduled': 'bg-green-100 text-green-800',
    'Rescheduled': 'bg-purple-100 text-purple-800',
    'Closed': 'bg-gray-100 text-gray-800',
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Leads</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="New Lead">New Lead</option>
          <option value="Follow-Up">Follow-Up</option>
          <option value="Appointment Scheduled">Appointment Scheduled</option>
          <option value="Rescheduled">Rescheduled</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No leads found
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.reason_for_contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {lead.service_requested || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Follow-Up">Follow-Up</option>
                      <option value="Appointment Scheduled">Appointment Scheduled</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Closed">Closed</option>
                    </select>
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

export default LeadList
