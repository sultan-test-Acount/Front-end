import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MechanicRequests = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // pending, accepted, completed, rejected
  
  useEffect(() => {
    if (currentUser && currentUser.user_type === 'mechanic') {
      fetchServiceRequests();
    }
  }, [currentUser]);
  
  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/service-requests');
      setRequests(response.data.service_requests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      setError('Failed to load service requests');
      setLoading(false);
      toast.error('Failed to load service requests');
    }
  };
  
  const updateRequestStatus = async (requestId, status) => {
    try {
      const response = await axios.put(`/service-requests/${requestId}/status`, { status });
      
      if (response.data.success) {
        // Update the local state
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId ? { ...req, status } : req
          )
        );
        toast.success(`Request ${status} successfully`);
      }
    } catch (error) {
      console.error(`Error updating request status to ${status}:`, error);
      toast.error(`Failed to update request status to ${status}`);
    }
  };
  
  const filteredRequests = requests.filter(request => request.status === activeTab);
  
  if (loading) {
    return <div className="text-center py-10">Loading service requests...</div>;
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
    <div className="mechanic-requests">
      <h1 className="text-3xl font-bold mb-6">Service Requests</h1>
      
      <div className="tabs flex border-b mb-6">
        <button 
          className={`py-2 px-4 ${activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'accepted' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'completed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'rejected' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected
        </button>
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No {activeTab} service requests found.</p>
        </div>
      ) : (
        <div className="requests-list space-y-6">
          {filteredRequests.map(request => (
            <div key={request.id} className="request-card bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{request.service.name}</h3>
                  <p className="text-gray-600">
                    Requested by: {request.user.name}
                  </p>
                </div>
                <div className="status-badge">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700">
                  <strong>Description:</strong> {request.description || 'No description provided'}
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> {request.address}
                </p>
                <p className="text-gray-700">
                  <strong>Scheduled for:</strong> {new Date(request.scheduled_at).toLocaleString()}
                </p>
                {request.completed_at && (
                  <p className="text-gray-700">
                    <strong>Completed on:</strong> {new Date(request.completed_at).toLocaleString()}
                  </p>
                )}
              </div>
              
              <div className="contact-info mb-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <p><strong>Email:</strong> {request.user.email}</p>
                {request.user.phone_number && (
                  <p><strong>Phone:</strong> {request.user.phone_number}</p>
                )}
              </div>
              
              {request.status === 'pending' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateRequestStatus(request.id, 'accepted')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateRequestStatus(request.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Reject
                  </button>
                </div>
              )}
              
              {request.status === 'accepted' && (
                <button
                  onClick={() => updateRequestStatus(request.id, 'completed')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechanicRequests;