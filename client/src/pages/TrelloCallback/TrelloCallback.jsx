import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import trelloService from '../../services/trelloService.js';
import './TrelloCallbackStyle.css';

const TrelloCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');  
  const [message, setMessage] = useState('Procesando autorización...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = () => {
    try {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('token');

      if (!token) {
        throw new Error('No se recibió el token de autorización');
      }

      trelloService.saveToken(token);
      
      setStatus('success');
      setMessage('✅ Conexión exitosa con Trello!');

      setTimeout(() => {
        navigate('/integraciones');
      }, 2000);

    } catch (error) {
      console.error('Error en callback de Trello:', error);
      setStatus('error');
      setMessage(`❌ Error: ${error.message}`);
      
      setTimeout(() => {
        navigate('/integraciones');
      }, 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.spinner}></div>
        <h2 style={styles.title}>{message}</h2>
        {status === 'success' && (
          <p style={styles.subtitle}>Redirigiendo a integraciones...</p>
        )}
        {status === 'error' && (
          <p style={styles.subtitle}>Redirigiendo en unos segundos...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  card: {
    background: 'white',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxWidth: '400px'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #0079bf',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 2rem'
  },
  title: {
    fontSize: '1.5rem',
    color: '#172b4d',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#5e6c84',
    fontSize: '1rem'
  }
};

export default TrelloCallback;