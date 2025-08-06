import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchVehicles();
  }, []);
  
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/vehicles');
      setVehicles(response.data.vehicles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
      setLoading(false);
      toast.error('Failed to load vehicles');
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading vehicles...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  
  return (
    <div className="vehicles-list">
      <h1 className="text-3xl font-bold mb-6">Available Vehicles</h1>
      
      {vehicles.length === 0 ? (
        <p className="text-center py-10">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {vehicle.image_url ? (
                <img 
                  src={vehicle.image_url} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{vehicle.make} {vehicle.model}</h2>
                <p className="text-gray-600 mb-2">Year: {vehicle.year}</p>
                <p className="text-gray-600 mb-4">Type: {vehicle.type}</p>
                
                <Link 
                  to={`/vehicles/${vehicle.id}`}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclesList;