import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MechanicServices = () => {
  const { currentUser } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    service_id: '',
    price: '',
    notes: ''
  });
  
  useEffect(() => {
    if (currentUser && currentUser.user_type === 'mechanic') {
      fetchServices();
    }
  }, [currentUser]);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Get mechanic's current services
      const userResponse = await axios.get('/user');
      setServices(userResponse.data.user.services || []);
      
      // Get all available services
      const servicesResponse = await axios.get('/services');
      setAvailableServices(servicesResponse.data.services || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
      setLoading(false);
      toast.error('Failed to load services');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/mechanic/services', formData);
      
      if (response.data.services) {
        setServices(response.data.services);
        setShowAddForm(false);
        resetForm();
        toast.success('Service added successfully');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };
  
  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/mechanic/services/${editingService.id}`, {
        price: formData.price,
        notes: formData.notes
      });
      
      if (response.data.services) {
        setServices(response.data.services);
        setEditingService(null);
        resetForm();
        toast.success('Service updated successfully');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };
  
  const handleRemoveService = async (serviceId) => {
    if (window.confirm('Are you sure you want to remove this service?')) {
      try {
        const response = await axios.delete(`/mechanic/services/${serviceId}`);
        
        if (response.data.services) {
          setServices(response.data.services);
          toast.success('Service removed successfully');
        }
      } catch (error) {
        console.error('Error removing service:', error);
        toast.error('Failed to remove service');
      }
    }
  };
  
  const startEditing = (service) => {
    setEditingService(service);
    setFormData({
      service_id: service.id,
      price: service.pivot.price || '',
      notes: service.pivot.notes || ''
    });
  };
  
  const resetForm = () => {
    setFormData({
      service_id: '',
      price: '',
      notes: ''
    });
  };
  
  const cancelEdit = () => {
    setEditingService(null);
    resetForm();
  };
  
  // Filter out services that the mechanic already offers
  const filteredAvailableServices = availableServices.filter(
    service => !services.some(s => s.id === service.id)
  );
  
  if (loading) {
    return <div className="text-center py-10">Loading services...</div>;
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
    <div className="mechanic-services">
      <h1 className="text-3xl font-bold mb-6">My Services</h1>
      
      {/* Current Services */}
      <div className="current-services mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Services I Offer</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {showAddForm ? 'Cancel' : 'Add Service'}
          </button>
        </div>
        
        {services.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">You are not offering any services yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="service-card bg-white rounded-lg shadow-md p-6">
                {editingService && editingService.id === service.id ? (
                  <form onSubmit={handleUpdateService} className="space-y-4">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    
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
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                      ></textarea>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <div className="service-actions flex space-x-2">
                        <button 
                          onClick={() => startEditing(service)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemoveService(service.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-700">
                        <strong>Price:</strong> ${service.pivot.price ? parseFloat(service.pivot.price).toFixed(2) : 'Not specified'}
                      </p>
                      <p className="text-gray-700 mt-2">
                        <strong>Notes:</strong>
                      </p>
                      <p className="text-gray-600 mt-1">
                        {service.pivot.notes || 'No additional notes'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Service Form */}
      {showAddForm && (
        <div className="add-service-form bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a New Service</h2>
          
          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Service</label>
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a service</option>
                {filteredAvailableServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
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
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                placeholder="Add any additional information about this service"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Service
            </button>
          </form>
        </div>
      )}
      
      {/* Available Services Information */}
      <div className="available-services-info bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Available Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableServices.map(service => (
            <div key={service.id} className="service-info p-4 border rounded-lg">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MechanicServices;