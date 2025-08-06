
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MechanicDashboard from './pages/MechanicDashboard';
import MechanicProfile from './pages/MechanicProfile';
import MechanicServices from './pages/MechanicServices';
import MechanicVehicles from './pages/MechanicVehicles';
import MechanicRequests from './pages/MechanicRequests';
import MapView from './pages/MapView';
import VehiclesList from './pages/VehiclesList';
import VehicleDetail from './pages/VehicleDetail';
import PrivateRoute from './components/auth/PrivateRoute';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="container py-4 flex-grow-1">
            <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/vehicles" element={<VehiclesList />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/mechanics/:id" element={<MechanicProfile />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <MechanicDashboard />
                </PrivateRoute>
              } />
              <Route path="/dashboard/services" element={
                <PrivateRoute>
                  <MechanicServices />
                </PrivateRoute>
              } />
              <Route path="/dashboard/vehicles" element={
                <PrivateRoute>
                  <MechanicVehicles />
                </PrivateRoute>
              } />
              <Route path="/dashboard/requests" element={
                <PrivateRoute>
                  <MechanicRequests />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;