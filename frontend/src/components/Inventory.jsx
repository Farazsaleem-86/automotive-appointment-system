import React, { useState } from 'react'
import { Car, DollarSign, Calendar, Fuel, Gauge, ArrowRight, Heart } from 'lucide-react'

function Inventory() {
  const [filters, setFilters] = useState({
    make: '',
    priceRange: '',
    year: '',
    mileage: ''
  })
  
  const [vehicles] = useState([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 28990,
      mileage: 12500,
      fuel: 'Hybrid',
      transmission: 'Automatic',
      color: 'Silver',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      features: ['Backup Camera', 'Bluetooth', 'Lane Assist', 'Apple CarPlay']
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Accord',
      year: 2022,
      price: 26500,
      mileage: 18500,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      color: 'Black',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
      features: ['Sunroof', 'Navigation', 'Heated Seats', 'Android Auto']
    },
    {
      id: 3,
      make: 'Ford',
      model: 'Mustang',
      year: 2023,
      price: 45990,
      mileage: 8200,
      fuel: 'Gasoline',
      transmission: 'Manual',
      color: 'Red',
      image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=400&h=300&fit=crop',
      features: ['Performance Package', 'Leather Interior', 'Bose Sound', 'Track Apps']
    },
    {
      id: 4,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 42990,
      mileage: 15600,
      fuel: 'Electric',
      transmission: 'Automatic',
      color: 'White',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      features: ['Autopilot', 'Premium Interior', 'Full Self-Driving', 'Supercharging']
    },
    {
      id: 5,
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 54990,
      mileage: 22100,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      color: 'Blue',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      features: ['M Sport Package', 'HUD', 'Harman Kardon', '360° Camera']
    },
    {
      id: 6,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2023,
      price: 48990,
      mileage: 11200,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      color: 'Silver',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop',
      features: ['MBUX System', 'Burmester Sound', 'Ventilated Seats', 'Ambient Lighting']
    }
  ])

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.make && vehicle.make !== filters.make) return false
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      if (vehicle.price < min || vehicle.price > max) return false
    }
    if (filters.year && vehicle.year !== parseInt(filters.year)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-carvana-blue to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Car</h1>
          <p className="text-xl text-blue-100 mb-8">Browse our premium inventory of quality vehicles</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-carvana-blue focus:border-transparent"
                value={filters.make}
                onChange={(e) => setFilters({...filters, make: e.target.value})}
              >
                <option value="">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="Tesla">Tesla</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes">Mercedes</option>
              </select>
              
              <select 
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-carvana-blue focus:border-transparent"
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              >
                <option value="">Any Price</option>
                <option value="0-25000">Under $25,000</option>
                <option value="25000-35000">$25,000 - $35,000</option>
                <option value="35000-50000">$35,000 - $50,000</option>
                <option value="50000-100000">$50,000+</option>
              </select>
              
              <select 
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-carvana-blue focus:border-transparent"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
              >
                <option value="">Any Year</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
              
              <button className="bg-carvana-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredVehicles.length} Vehicles Available
          </h2>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
            <option>Mileage: Low to High</option>
          </select>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
              {/* Image Section */}
              <div className="relative">
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
                <div className="absolute bottom-4 left-4 bg-carvana-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {vehicle.year}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-gray-500 text-sm">{vehicle.transmission} • {vehicle.color}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-carvana-blue">${vehicle.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4 my-4 py-4 border-y border-gray-200">
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-semibold text-gray-800">{vehicle.year}</p>
                  </div>
                  <div className="text-center">
                    <Gauge className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Mileage</p>
                    <p className="font-semibold text-gray-800">{vehicle.mileage.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <Fuel className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Fuel</p>
                    <p className="font-semibold text-gray-800">{vehicle.fuel}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      +{vehicle.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-carvana-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group-hover:bg-carvana-orange">
                  Book Test Drive
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-16">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Search({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export default Inventory
