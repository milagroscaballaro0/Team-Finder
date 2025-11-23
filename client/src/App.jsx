import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './pages/Header/header.jsx';
import Footer from './pages/Footer/footer.jsx';
import Home from './pages/Home/home.jsx';
import Login from './pages/Login/login.jsx';
import Register from './pages/Register/register.jsx';
import EmployeeProfile from './pages/EmployeeProfile/employeeProfile.jsx';
import CompanyProfile from './pages/CompanyProfile/companyProfile.jsx';
import PersonalizableProfile from './pages/EmployeeProfile/PersonalizableProfile.jsx';
import Formulario from './pages/Formulario/formulario.jsx';
import FormResults from './pages/Formulario/FormResults.jsx'; 
import About from './pages/About/about.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Planes from "./pages/Planes/planes.jsx";
import Integraciones from './pages/Integraciones/Integraciones.jsx';
import MetodoPagoBronce from "./pages/Planes/MetodoPago/metodoPagoBronce.jsx";
import MetodoPagoPlata from "./pages/Planes/MetodoPago/metodoPagoPlata.jsx";
import MetodoPagoOro from "./pages/Planes/MetodoPago/metodoPagoOro.jsx";
import TeamsPage from './pages/Teams/teams.jsx'; 
import Servicios from './services/teamService.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/integraciones" element={<Integraciones />} />
            <Route path="/metodo-pago/bronce" element={<MetodoPagoBronce />} />
            <Route path="/metodo-pago/plata" element={<MetodoPagoPlata />} />
            <Route path="/metodo-pago/oro" element={<MetodoPagoOro />} />
            <Route path="/services" element={<Servicios />} />

            <Route 
              path="/employeeprofile" 
              element={
                <ProtectedRoute>
                  <EmployeeProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companyprofile" 
              element={
                <ProtectedRoute>
                  <CompanyProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employeeprofile/edit" 
              element={
                <ProtectedRoute>
                  <PersonalizableProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/formulario" 
              element={
                <ProtectedRoute>
                  <Formulario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resultados" 
              element={
                <ProtectedRoute>
                  <FormResults /> 
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams" 
              element={
                <ProtectedRoute>
                  <TeamsPage />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<div>Página no encontrada - 404</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;