// // import React, { useState, useEffect, useContext } from 'react';
// // import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
// // import axios from 'axios';
// // import { AuthContext } from '../contexts/AuthContext';
// // import { toast } from 'react-toastify';
// // import { useNavigate } from 'react-router-dom';




// // import React, { useState, useEffect, useContext } from 'react';
// // import axios from 'axios';
// // import { AuthContext } from '../contexts/AuthContext';
// // import { toast } from 'react-toastify';
// // import { useNavigate } from 'react-router-dom';

// // const MapView = () => {
// //   const [currentPosition, setCurrentPosition] = useState(null);
// //   const [mechanics, setMechanics] = useState([]);
// //   const [selectedMechanic, setSelectedMechanic] = useState(null);
// //   const [services, setServices] = useState([]);
// //   const [selectedService, setSelectedService] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
  
// //   const { currentUser } = useContext(AuthContext);
// //   const navigate = useNavigate();
  
// //   // Get user's current location
// //   useEffect(() => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           const pos = {
// //             lat: position.coords.latitude,
// //             lng: position.coords.longitude
// //           };
// //           setCurrentPosition(pos);
// //           fetchNearbyMechanics(pos.lat, pos.lng);
// //         },
// //         (error) => {
// //           setError("Error: The Geolocation service failed.");
// //           setLoading(false);
// //           toast.error("Could not get your location. Please enable location services.");
// //         }
// //       );
// //     } else {
// //       setError("Error: Your browser doesn't support geolocation.");
// //       setLoading(false);
// //       toast.error("Your browser doesn't support geolocation.");
// //     }
    
// //     // Fetch available services
// //     fetchServices();
// //   }, []);

// //   // Fetch nearby mechanics
// //   const fetchNearbyMechanics = async (lat, lng, serviceId = null) => {
// //     try {
// //       setLoading(true);
// //       let url = `/mechanics/nearby?latitude=${lat}&longitude=${lng}`;
      
// //       if (serviceId) {
// //         url += `&service_id=${serviceId}`;
// //       }
      
// //       const response = await axios.get(url);
// //       setMechanics(response.data.mechanics);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error('Error fetching mechanics:', error);
// //       setError('Failed to load mechanics');
// //       setLoading(false);
// //       toast.error('Failed to load mechanics');
// //     }
// //   };

// //   // Fetch available services
// //   const fetchServices = async () => {
// //     try {
// //       const response = await axios.get('/services');
// //       setServices(response.data.services);
// //     } catch (error) {
// //       console.error('Error fetching services:', error);
// //       toast.error('Failed to load services');
// //     }
// //   };

// //   // Handle service filter change
// //   const handleServiceChange = (e) => {
// //     const serviceId = e.target.value;
// //     setSelectedService(serviceId);
    
// //     if (currentPosition) {
// //       fetchNearbyMechanics(currentPosition.lat, currentPosition.lng, serviceId || null);
// //     }
// //   };

// //   // Handle request service
// //   const handleRequestService = (mechanicId) => {
// //     if (!currentUser) {
// //       toast.info('Please login to request a service');
// //       navigate('/login');
// //       return;
// //     }
    
// //     // Navigate to a service request form or open a modal
// //     toast.info(`Service request for mechanic ${mechanicId} will be implemented soon`);
// //   };

// //   // Generate Google Maps Embed URL
// //   const getMapUrl = () => {
// //     if (!currentPosition) return '';
    
// //     let baseUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_EMBED_API_KEY&center=${currentPosition.lat},${currentPosition.lng}&zoom=14`;
    
// //     return baseUrl;
// //   };

// //   return (
// //     <div className="map-container">
// //       <h1 className="text-3xl font-bold mb-6">Find Nearby Mechanics</h1>
      
// //       <div className="filter-container mb-4">
// //         <select 
// //           className="p-2 border rounded-md w-full md:w-64"
// //           value={selectedService}
// //           onChange={handleServiceChange}
// //         >
// //           <option value="">All Services</option>
// //           {services.map(service => (
// //             <option key={service.id} value={service.id}>{service.name}</option>
// //           ))}
// //         </select>
// //       </div>
      
// //       {loading && <p className="text-center">Loading map...</p>}
// //       {error && <p className="text-center text-red-500">{error}</p>}
      
// //       {currentPosition && (
// //         <div style={{ height: "70vh", width: "100%" }}>
// //           <iframe
// //             width="100%"
// //             height="100%"
// //             style={{ border: 0 }}
// //             loading="lazy"
// //             allowFullScreen
// //             src={getMapUrl()}
// //             title="Google Map"
// //           ></iframe>
          
// //           {/* Display mechanics list next to or below the map */}
// //           <div className="mechanics-list mt-4">
// //             <h2 className="text-xl font-bold mb-2">Nearby Mechanics</h2>
// //             {mechanics.length === 0 ? (
// //               <p>No mechanics found in your area</p>
// //             ) : (
// //               <ul className="divide-y divide-gray-200">
// //                 {mechanics.map(mechanic => (
// //                   <li key={mechanic.id} className="py-4 cursor-pointer hover:bg-gray-50" onClick={() => setSelectedMechanic(mechanic)}>
// //                     <div className="flex justify-between">
// //                       <div>
// //                         <h3 className="font-bold">{mechanic.name}</h3>
// //                         <p>{mechanic.address || 'No address provided'}</p>
// //                         <p>Rating: {mechanic.rating || 'Not rated'}</p>
// //                         <p>Distance: {mechanic.distance.toFixed(2)} km</p>
// //                       </div>
// //                       <div className="flex items-center">
// //                         <button 
// //                           className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
// //                           onClick={(e) => {
// //                             e.stopPropagation();
// //                             window.open(`tel:${mechanic.phone_number}`);
// //                           }}
// //                         >
// //                           Call
// //                         </button>
// //                         <button 
// //                           className="bg-green-500 text-white px-3 py-1 rounded"
// //                           onClick={(e) => {
// //                             e.stopPropagation();
// //                             handleRequestService(mechanic.id);
// //                           }}
// //                         >
// //                           Request Service
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </li>
// //                 ))}
// //               </ul>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MapView;

// import React, { useState, useEffect, useContext } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import axios from 'axios';
// import { AuthContext } from '../contexts/AuthContext';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix Leaflet icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const MapView = () => {
//   const [currentPosition, setCurrentPosition] = useState(null);
//   const [mechanics, setMechanics] = useState([]);
//   const [selectedMechanic, setSelectedMechanic] = useState(null);
//   const [services, setServices] = useState([]);
//   const [selectedService, setSelectedService] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [map, setMap] = useState(null);
  
//   const { currentUser } = useContext(AuthContext);
//   const navigate = useNavigate();
  
//   // Get user's current location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const pos = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setCurrentPosition(pos);
//           fetchNearbyMechanics(pos.lat, pos.lng);
//         },
//         (error) => {
//           setError("Error: The Geolocation service failed.");
//           setLoading(false);
//           toast.error("Could not get your location. Please enable location services.");
//         }
//       );
//     } else {
//       setError("Error: Your browser doesn't support geolocation.");
//       setLoading(false);
//       toast.error("Your browser doesn't support geolocation.");
//     }
    
//     // Fetch available services
//     fetchServices();
//   }, []);

//   // Fetch nearby mechanics
//   const fetchNearbyMechanics = async (lat, lng, serviceId = null) => {
//     try {
//       setLoading(true);
//       let url = `/mechanics/nearby?latitude=${lat}&longitude=${lng}`;
      
//       if (serviceId) {
//         url += `&service_id=${serviceId}`;
//       }
      
//       const response = await axios.get(url);
//       setMechanics(response.data.mechanics);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching mechanics:', error);
//       setError('Failed to load mechanics');
//       setLoading(false);
//       toast.error('Failed to load mechanics');
//     }
//   };

//   // Fetch available services
//   const fetchServices = async () => {
//     try {
//       const response = await axios.get('/services');
//       setServices(response.data.services);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       toast.error('Failed to load services');
//     }
//   };

//   // Handle service filter change
//   const handleServiceChange = (e) => {
//     const serviceId = e.target.value;
//     setSelectedService(serviceId);
    
//     if (currentPosition) {
//       fetchNearbyMechanics(currentPosition.lat, currentPosition.lng, serviceId || null);
//     }
//   };

//   // Handle request service
//   const handleRequestService = (mechanicId) => {
//     if (!currentUser) {
//       toast.info('Please login to request a service');
//       navigate('/login');
//       return;
//     }
    
//     // Navigate to a service request form or open a modal
//     toast.info(`Service request for mechanic ${mechanicId} will be implemented soon`);
//   };

//   return (
//     <div className="map-container">
//       <h1 className="text-3xl font-bold mb-6">Find Nearby Mechanics</h1>
      
//       <div className="filter-container mb-4">
//         <select 
//           className="p-2 border rounded-md w-full md:w-64"
//           value={selectedService}
//           onChange={handleServiceChange}
//         >
//           <option value="">All Services</option>
//           {services.map(service => (
//             <option key={service.id} value={service.id}>{service.name}</option>
//           ))}
//         </select>
//       </div>
      
//       {loading && <p className="text-center">Loading map...</p>}
//       {error && <p className="text-center text-red-500">{error}</p>}
      
//       {currentPosition && (
//         <div style={{ height: "70vh", width: "100%" }}>
//           <MapContainer 
//             center={[currentPosition.lat, currentPosition.lng]} 
//             zoom={14} 
//             style={{ height: "100%", width: "100%" }}
//             whenCreated={setMap}
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
            
//             {/* Current user position marker */}
//             <Marker position={[currentPosition.lat, currentPosition.lng]}>
//               <Popup>Your location</Popup>
//             </Marker>
            
//             {/* Mechanics markers */}
//             {mechanics.map(mechanic => (
//               <Marker 
//                 key={mechanic.id} 
//                 position={[parseFloat(mechanic.latitude), parseFloat(mechanic.longitude)]}
//                 eventHandlers={{
//                   click: () => setSelectedMechanic(mechanic),
//                 }}
//               >
//                 <Popup>
//                   <div className="info-window">
//                     <h3 className="font-bold">{mechanic.name}</h3>
//                     <p>{mechanic.address || 'No address provided'}</p>
//                     <p>Rating: {mechanic.rating || 'Not rated'}</p>
//                     <p>Distance: {mechanic.distance.toFixed(2)} km</p>
//                     <div className="mt-2">
//                       <button 
//                         className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
//                         onClick={() => window.open(`tel:${mechanic.phone_number}`)}
//                       >
//                         Call
//                       </button>
//                       <button 
//                         className="bg-green-500 text-white px-3 py-1 rounded"
//                         onClick={() => handleRequestService(mechanic.id)}
//                       >
//                         Request Service
//                       </button>
//                     </div>
//                   </div>
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapView;

import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  
  // New state for service request modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    mechanic_id: '',
    service_id: '',
    description: '',
    latitude: '',
    longitude: '',
    address: '',
    scheduled_at: '',
  });
  
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(pos);
          fetchNearbyMechanics(pos.lat, pos.lng);
        },
        (error) => {
          setError("Error: The Geolocation service failed.");
          setLoading(false);
          toast.error("Could not get your location. Please enable location services.");
        }
      );
    } else {
      setError("Error: Your browser doesn't support geolocation.");
      setLoading(false);
      toast.error("Your browser doesn't support geolocation.");
    }
    
    // Fetch available services
    fetchServices();
  }, []);

  // Fetch nearby mechanics
  const fetchNearbyMechanics = async (lat, lng, serviceId = null) => {
    try {
      setLoading(true);
      let url = `/mechanics/nearby?latitude=${lat}&longitude=${lng}`;
      
      if (serviceId) {
        url += `&service_id=${serviceId}`;
      }
      
      const response = await axios.get(url);
      setMechanics(response.data.mechanics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mechanics:', error);
      setError('Failed to load mechanics');
      setLoading(false);
      toast.error('Failed to load mechanics');
    }
  };

  // Fetch available services
  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  // Handle service filter change
  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);
    
    if (currentPosition) {
      fetchNearbyMechanics(currentPosition.lat, currentPosition.lng, serviceId || null);
    }
  };

  // Handle request service
  const handleRequestService = (mechanicId) => {
    if (!currentUser) {
      toast.info('Please login to request a service');
      navigate('/login');
      return;
    }
    
    // Find the mechanic by ID
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      // Initialize request data with mechanic and location info
      setRequestData({
        mechanic_id: mechanicId,
        service_id: selectedService || '',
        description: '',
        latitude: currentPosition.lat,
        longitude: currentPosition.lng,
        address: '',  // Will be filled by user
        scheduled_at: new Date().toISOString().slice(0, 16),  // Format: YYYY-MM-DDThh:mm
      });
      
      // Show the modal
      setShowRequestModal(true);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/service-requests', requestData);
      
      if (response.data.success) {
        toast.success('Service request created successfully');
        setShowRequestModal(false);
        // Reset form data
        setRequestData({
          mechanic_id: '',
          service_id: '',
          description: '',
          latitude: '',
          longitude: '',
          address: '',
          scheduled_at: '',
        });
      }
    } catch (error) {
      console.error('Error creating service request:', error);
      toast.error(error.response?.data?.message || 'Failed to create service request');
    }
  };

  return (
    <div className="map-container">
      <h1 className="text-3xl font-bold mb-6">Find Nearby Mechanics</h1>
      
      <div className="filter-container mb-4">
        <select 
          className="p-2 border rounded-md w-full md:w-64"
          value={selectedService}
          onChange={handleServiceChange}
        >
          <option value="">All Services</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>
      
      {loading && <p className="text-center">Loading map...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {currentPosition && (
        <div style={{ height: "70vh", width: "100%" }}>
          <MapContainer 
            center={[currentPosition.lat, currentPosition.lng]} 
            zoom={14} 
            style={{ height: "100%", width: "100%" }}
            whenCreated={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Current user position marker */}
            <Marker position={[currentPosition.lat, currentPosition.lng]}>
              <Popup>Your location</Popup>
            </Marker>
            
            {/* Mechanics markers */}
            {mechanics.map(mechanic => (
              <Marker 
                key={mechanic.id} 
                position={[parseFloat(mechanic.latitude), parseFloat(mechanic.longitude)]}
                eventHandlers={{
                  click: () => setSelectedMechanic(mechanic),
                }}
              >
                <Popup>
                  <div className="info-window">
                    <h3 className="font-bold">{mechanic.name}</h3>
                    <p>{mechanic.address || 'No address provided'}</p>
                    <p>Rating: {mechanic.rating || 'Not rated'}</p>
                    <p>Distance: {mechanic.distance.toFixed(2)} km</p>
                    <div className="mt-2">
                      <button 
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => window.open(`tel:${mechanic.phone_number}`)}
                      >
                        Call
                      </button>
                      <button 
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleRequestService(mechanic.id)}
                      >
                        Request Service
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
      
      {/* Service Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Request Service</h2>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Service</label>
                <select
                  name="service_id"
                  value={requestData.service_id}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={requestData.address}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Scheduled Time</label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={requestData.scheduled_at}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={requestData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                  placeholder="Describe your service request"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;