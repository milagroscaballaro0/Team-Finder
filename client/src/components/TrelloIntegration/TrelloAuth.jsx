import React from 'react';
import trelloService from '../../services/trelloService.js';
import './trelloIntegration.css';

/**
 * Componente de autenticación con Trello
 * Muestra el botón para conectar/desconectar la cuenta
 */
const TrelloAuth = ({ isAuthenticated, onAuthChange, userName }) => {
  
  /**
   * Maneja el inicio del flujo de autenticación OAuth
   * Redirige al usuario a la página de autorización de Trello
   */
  const handleConnect = () => {
    const authUrl = trelloService.getAuthorizationUrl();
    console.log('🔗 Redirigiendo a Trello para autorización...');
    window.location.href = authUrl;
  };

  /**
   * Maneja el cierre de sesión
   * Elimina el token y notifica al componente padre
   */
  const handleDisconnect = () => {
    if (window.confirm('¿Estás seguro de desconectar tu cuenta de Trello?')) {
      trelloService.logout();
      onAuthChange(false);
    }
  };

  return (
    <div className="trello-auth-section">
      {isAuthenticated ? (
        <div className="auth-connected">
          <div className="auth-info">
            <svg className="auth-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#61bd4f"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="auth-text">
              <h3>Conectado a Trello</h3>
              {userName && <p>Usuario: {userName}</p>}
            </div>
          </div>
          <button onClick={handleDisconnect} className="btn-disconnect">
            Desconectar
          </button>
        </div>
      ) : (
        <div className="auth-disconnected">
          <div className="auth-prompt">
            <svg className="trello-logo" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#0079bf"/>
              <rect x="6" y="6" width="5" height="10" rx="1" fill="white"/>
              <rect x="13" y="6" width="5" height="6" rx="1" fill="white"/>
            </svg>
            <div>
              <h3>Conecta tu cuenta de Trello</h3>
              <p>Autoriza el acceso para ver tus tableros y crear tareas</p>
            </div>
          </div>
          <button onClick={handleConnect} className="btn-connect">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Conectar con Trello
          </button>
        </div>
      )}
    </div>
  );
};

export default TrelloAuth;