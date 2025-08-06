import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MechanicDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalVehicles: 0,
    totalServices: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentUser && currentUser.user_type === 'mechanic') {
      fetchDashboardStats();
    }
  }, [currentUser]);
  
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/mechanic/dashboard/stats');
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }
  
  if (!currentUser || currentUser.user_type !== 'mechanic') {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">This page is only accessible to mechanics.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">Return to Home</Link>
      </div>
    );
  }
  
  return (
    <div className="mechanic-dashboard">
      <h1 className="text-3xl font-bold mb-6">Mechanic Dashboard</h1>
      
      <div className="welcome-section bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {currentUser.name}!</h2>
        <p className="text-gray-600">Here's an overview of your mechanic profile and activities.</p>
      </div>
      
      <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Service Requests</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.totalRequests}</p>
            </div>
            <div>
              <p className="text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.pendingRequests}</p>
            </div>
            <div>
              <p className="text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-500">{stats.completedRequests}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Your Services</h3>
          <p className="text-2xl font-bold">{stats.totalServices}</p>
          <Link to="/dashboard/services" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Manage Services
          </Link>
        </div>
        
        <div className="stat-card bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Your Rating</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">{stats.rating.toFixed(1)}</p>
            <div className="text-yellow-400">
              {/* Simple star rating display */}
              {'★'.repeat(Math.round(stats.rating))}
              {'☆'.repeat(5 - Math.round(stats.rating))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/dashboard/requests" className="action-card bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">View Service Requests</h3>
          <p>Manage your pending and completed service requests</p>
        </Link>
        
        <Link to="/dashboard/vehicles" className="action-card bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Manage Vehicles</h3>
          <p>Add or update vehicles you can service</p>
        </Link>
      </div>
    </div>
  );
};

export default MechanicDashboard;