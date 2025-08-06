import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);
  
  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/vehicles/${id}`);
      setVehicle(response.data.vehicle);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setError('Failed to load vehicle details');
      setLoading(false);
      toast.error('Failed to load vehicle details');
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading vehicle details...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!vehicle) return <div className="text-center py-10">Vehicle not found</div>;
  
  return (
    <div className="vehicle-detail">
      <Link to="/vehicles" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        &larr; Back to Vehicles
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {vehicle.image_url ? (
              <img 
                src={vehicle.image_url} 
                alt={`${vehicle.make} ${vehicle.model}`} 
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{vehicle.make} {vehicle.model}</h1>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2"><span className="font-semibold">Year:</span> {vehicle.year}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Type:</span> {vehicle.type}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">License Plate:</span> {vehicle.license_plate}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Color:</span> {vehicle.color}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{vehicle.description || 'No description available.'}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Owner Information</h2>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Name:</span> {vehicle.owner?.name || 'N/A'}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Contact:</span> {vehicle.owner?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;