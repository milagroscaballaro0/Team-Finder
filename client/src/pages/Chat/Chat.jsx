import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import './chatStyle.css';

export default function ChatMain() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  
 
  const companyData = (() => {
    try {
      return JSON.parse(localStorage.getItem('companyProfileData')) || {};
    } catch (e) { return {}; }
  })();

  const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
      <rect width='100%' height='100%' fill='%23e6eefb' />
      <g transform='translate(70,70)'>
        <rect x='0' y='0' width='100' height='100' fill='%233b82f6' />
        <text x='50' y='65' font-family='Arial' font-size='50' font-weight='bold' fill='white' text-anchor='middle'>C</text>
      </g>
    </svg>
  `)}`;

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotificationType(type);
    setNotification(message);
    
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification('');
    }, duration);
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading messages:', e);
        showNotification('Error al cargar los mensajes anteriores.', 'error');
      }
    }
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      setMessage('');
    
      showNotification('Mensaje enviado con éxito. Se te avisará cuando sea visto por Recursos Humanos.', 'success', 5000);
      
      if (Math.random() > 0.7) { 
        setTimeout(() => {
          const companyResponse = {
            id: Date.now().toString(),
            text: "Gracias por tu mensaje. Un representante de Recursos Humanos se pondrá en contacto contigo pronto.",
            sender: 'company',
            timestamp: new Date().toISOString()
          };
          
          const messagesWithResponse = [...updatedMessages, companyResponse];
          setMessages(messagesWithResponse);
          localStorage.setItem('chatMessages', JSON.stringify(messagesWithResponse));
   
          showNotification('Has recibido un mensaje nuevo.', 'info', 3000);
        }, 2000);
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      showNotification('Error al enviar el mensaje. Inténtalo de nuevo más tarde.', 'error', 5000);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="chat-container">
      <Header />
      <div className="chat-main">
        <div className="chat-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="chat-with">
            <img 
              src={companyData.avatar || defaultAvatar} 
              alt="Company" 
              className="company-avatar" 
            />
            <span className="company-name">{companyData.name || 'Tech Company'}</span>
          </div>
          <button 
            className="clear-history-button"
            onClick={() => setShowConfirmation(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Borrar historial
          </button>
        </div>
        
        <div className="messages-container">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender === 'user' ? 'user-message' : 'company-message'}`}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        
        {notification && (
          <div className={`notification notification-${notificationType}`}>
            <p>{notification}</p>
          </div>
        )}
        
        <form className="message-form" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Escribe un mensaje..." 
              className="chat-input"
              ref={inputRef}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!message.trim()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
      <Footer />
      
      {}
      {showConfirmation && (
        <div className="confirmation-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="confirmation-title">Borrar historial de chat</h3>
            <p className="confirmation-message">¿Estás seguro de que deseas eliminar todo el historial de conversación? Esta acción no se puede deshacer.</p>
            <div className="confirmation-actions">
              <button 
                className="confirmation-btn cancel-btn" 
                onClick={() => setShowConfirmation(false)}
              >
                Cancelar
              </button>
              <button 
                className="confirmation-btn confirm-btn" 
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem('chatMessages');
                  setShowConfirmation(false);
                  showNotification('Historial de chat borrado correctamente.', 'info', 3000);
                }}
              >
                Sí, borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
