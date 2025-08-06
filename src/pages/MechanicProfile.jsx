import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const MechanicProfile = () => {
  const { id } = useParams();
  const { currentUser, updateProfile } = useContext(AuthContext);
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    bio: ''
  });

  // Determine if viewing own profile or another mechanic's profile
  const isOwnProfile = currentUser && (!id || parseInt(id) === currentUser.id);

  useEffect(() => {
    fetchMechanicProfile();
  }, [id, currentUser]);

  const fetchMechanicProfile = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isOwnProfile) {
        // Get current user's profile
        response = await axios.get('/user');
        setMechanic(response.data.user);
        initFormData(response.data.user);
      } else {
        // Get another mechanic's profile
        response = await axios.get(`/mechanics/${id}`);
        setMechanic(response.data.mechanic);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mechanic profile:', error);
      setError('Failed to load mechanic profile');
      setLoading(false);
      toast.error('Failed to load mechanic profile');
    }
  };

  const initFormData = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      bio: user.bio || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMechanic(result.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const response = await axios.post('/user/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMechanic(prev => ({
          ...prev,
          profile_image: response.data.profile_image_url
        }));
        toast.success('Profile image updated successfully');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload profile image');
    }
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!mechanic) return <div className="text-center py-10 text-red-600">Mechanic not found</div>;

  return (
    <div className="mechanic-profile">
      <h1 className="text-3xl font-bold mb-6">
        {isOwnProfile ? 'My Profile' : `${mechanic.name}'s Profile`}
      </h1>
      
      <div className="profile-container bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row">
          <div className="profile-image mb-6 md:mb-0 md:mr-8">
            <div className="relative">
              <img 
                src={mechanic.profile_image || '/images/default-avatar.png'} 
                alt={`${mechanic.name}'s profile`} 
                className="w-48 h-48 object-cover rounded-full"
              />
              {isOwnProfile && (
                <div className="mt-4">
                  <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                    Change Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleProfileImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-details flex-1">
            {isOwnProfile && isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  ></textarea>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      initFormData(mechanic);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold mb-2">{mechanic.name}</h2>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{mechanic.rating ? mechanic.rating.toFixed(1) : 'No ratings yet'}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    <strong>Email:</strong> {mechanic.email}
                  </p>
                  
                  {mechanic.phone_number && (
                    <p className="text-gray-600 mb-2">
                      <strong>Phone:</strong> {mechanic.phone_number}
                    </p>
                  )}
                  
                  {mechanic.location && (
                    <p className="text-gray-600 mb-2">
                      <strong>Location:</strong> {mechanic.location.address}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-700">
                    {mechanic.bio || 'No bio available'}
                  </p>
                </div>
                
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicProfile;