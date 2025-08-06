import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MechanicVehicles = () => {
  const { currentUser } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    price: '',
    description: '',
    condition: 'used',
    mileage: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    if (currentUser && currentUser.user_type === 'mechanic') {
      fetchVehicles();
    }
  }, [currentUser]);
  
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/vehicles');
      // Filter to only show vehicles posted by the current user
      const userVehicles = response.data.vehicles.filter(v => v.user_id === currentUser.id);
      setVehicles(userVehicles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
      setLoading(false);
      toast.error('Failed to load vehicles');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create vehicle
      const vehicleResponse = await axios.post('/vehicles', formData);
      
      if (vehicleResponse.data.success && selectedFiles.length > 0) {
        const vehicleId = vehicleResponse.data.vehicle.id;
        
        // Upload images
        for (let i = 0; i < selectedFiles.length; i++) {
          const formData = new FormData();
          formData.append('image', selectedFiles[i]);
          
          await axios.post(`/vehicles/${vehicleId}/images`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          });
          
          // If this is the first image, set it as primary
          if (i === 0) {
            await axios.post(`/vehicles/images/${vehicleId}/primary`);
          }
        }
      }
      
      resetForm();
      fetchVehicles();
      toast.success('Vehicle added successfully');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    }
  };
  
  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await axios.delete(`/vehicles/${vehicleId}`);
        
        if (response.data.success) {
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
          toast.success('Vehicle deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Failed to delete vehicle');
      }
    }
  };
  
  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      price: '',
      description: '',
      condition: 'used',
      mileage: ''
    });
    setSelectedFiles([]);
    setUploadProgress(0);
    setShowAddForm(false);
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading vehicles...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }
  
  if (!currentUser || currentUser.user_type !== 'mechanic') {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">This page is only accessible to mechanics.</p>
      </div>
    );
  }
  
  return (
    <div className="mechanic-vehicles">
      <h1 className="text-3xl font-bold mb-6">My Vehicles</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Manage vehicles you have listed for sale</p>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {showAddForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>
      
      {/* Add Vehicle Form */}
      {showAddForm && (
        <div className="add-vehicle-form bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a New Vehicle</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Mileage</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-xs text-gray-500 mt-1">You can select multiple images. The first image will be set as the primary image.</p>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              ></textarea>
            </div>
            
            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Vehicle
            </button>
          </form>
        </div>
      )}
      
      {/* Vehicles List */}
      {vehicles.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">You haven't listed any vehicles yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="vehicle-card bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                {vehicle.primaryImage ? (
                  <img 
                    src={vehicle.primaryImage.image_url} 
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2">
                  <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded">
                    ${parseFloat(vehicle.price).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {vehicle.color && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      {vehicle.color}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1)}
                  </span>
                  {vehicle.mileage && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      {vehicle.mileage} miles
                    </span>
                  )}
                </div>
                
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {vehicle.description || 'No description available'}
                </p>
                
                <div className="mt-4 flex justify-between">
                  <Link 
                    to={`/vehicles/${vehicle.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechanicVehicles;