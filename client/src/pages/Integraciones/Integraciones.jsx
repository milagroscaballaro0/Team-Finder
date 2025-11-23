import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import TrelloIntegration from '../../components/TrelloIntegration/TrelloIntegration.jsx';
import './IntegracionesStyle.css';

const Integraciones = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="integraciones-container">
      
        <div className="integraciones-header">
          <h1 className="integraciones-title">🔗 Integraciones</h1>
          <p className="integraciones-subtitle">
            Conecta tus herramientas favoritas con Team Finder y gestiona tu trabajo desde un solo lugar
          </p>
        </div>

        <div className="integrations-grid">
    
          <div className="integration-card trello-card">
            <div className="card-header">
              <div className="card-icon trello-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#0079bf"/>
                  <rect x="6" y="6" width="5" height="10" rx="1" fill="white"/>
                  <rect x="13" y="6" width="5" height="6" rx="1" fill="white"/>
                </svg>
              </div>
              <div className="card-title-section">
                <h2>Trello</h2>
                <span className="badge connected">OAuth 2.0</span>
              </div>
            </div>
            <p className="card-description">
              Conecta tu cuenta personal de Trello para gestionar tableros y tareas
            </p>
          </div>

          <div className="integration-card clickup-card">
            <div className="card-header">
              <div className="card-icon clickup-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#7B68EE"/>
                  <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-title-section">
                <h2>ClickUp</h2>
                <span className="badge coming-soon">Próximamente</span>
              </div>
            </div>
            <p className="card-description">
              Sincroniza tareas y proyectos con tu espacio de trabajo de ClickUp
            </p>
          </div>

          <div className="integration-card slack-card">
            <div className="card-header">
              <div className="card-icon slack-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="5" fill="#4A154B"/>
                  <path d="M8 9.5C8 8.67 7.33 8 6.5 8S5 8.67 5 9.5 5.67 11 6.5 11H8V9.5z" fill="#E01E5A"/>
                  <path d="M8.5 5C7.67 5 7 5.67 7 6.5v6c0 .83.67 1.5 1.5 1.5S10 13.33 10 12.5v-6C10 5.67 9.33 5 8.5 5z" fill="#36C5F0"/>
                  <path d="M14.5 11c.83 0 1.5.67 1.5 1.5V14h-1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5z" fill="#2EB67D"/>
                  <path d="M19 12.5c0-.83-.67-1.5-1.5-1.5h-6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5z" fill="#ECB22E"/>
                </svg>
              </div>
              <div className="card-title-section">
                <h2>Slack</h2>
                <span className="badge coming-soon">Próximamente</span>
              </div>
            </div>
            <p className="card-description">
              Recibe notificaciones y actualiza tareas desde Slack
            </p>
          </div>

          <div className="integration-card calendar-card">
            <div className="card-header">
              <div className="card-icon calendar-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" fill="#4285F4"/>
                  <rect x="3" y="4" width="18" height="5" rx="2" fill="#1967D2"/>
                  <text x="12" y="17" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">31</text>
                </svg>
              </div>
              <div className="card-title-section">
                <h2>Google Calendar</h2>
                <span className="badge coming-soon">Próximamente</span>
              </div>
            </div>
            <p className="card-description">
              Sincroniza deadlines y reuniones con tu calendario
            </p>
          </div>

          <div className="integration-card jira-card">
            <div className="card-header">
              <div className="card-icon jira-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="3" fill="#0052CC"/>
                  <path d="M12 4L8 8L12 12L16 8L12 4Z" fill="white"/>
                  <path d="M12 12L8 16L12 20L16 16L12 12Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <div className="card-title-section">
                <h2>Jira</h2>
                <span className="badge coming-soon">Próximamente</span>
              </div>
            </div>
            <p className="card-description">
              Conecta issues y sprints de Jira con tus equipos
            </p>
          </div>

          <div className="integration-card github-card">
            <div className="card-header">
              <div className="card-icon github-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#24292e"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" fill="white"/>
                </svg>
              </div>
              <div className="card-title-section">
                <h2>GitHub</h2>
                <span className="badge coming-soon">Próximamente</span>
              </div>
            </div>
            <p className="card-description">
              Vincula repositorios y pull requests con tus proyectos
            </p>
          </div>

        </div>

        <div className="trello-section">
          <TrelloIntegration />
        </div>

        <div className="cta-section">
          <h2>¿Necesitas otra integración?</h2>
          <p>Contáctanos y cuéntanos qué herramienta te gustaría integrar</p>
          <button 
            className="cta-button" 
            onClick={() => navigate('/contacto')} 
          >
            Contáctanos
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Integraciones;