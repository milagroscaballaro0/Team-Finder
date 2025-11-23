import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import './contactStyle.css';

const Contact = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('sending');

    try {
     
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Formulario enviado:', formData);

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setStatus('');
      }, 5000);

    } catch (error) {
      console.error('Error al enviar:', error);
      setStatus('error');
      
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <div className="contact-header">
          <h1>📧 Contáctanos</h1>
          <p>¿Tienes alguna pregunta o necesitas solicitar una integración? Escríbenos y te responderemos pronto.</p>
        </div>

        <div className="contact-content">

          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Email</h3>
              <p>support@teamfinder.com</p>
              <a href="mailto:support@teamfinder.com" className="info-link">Enviar correo →</a>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Teléfono</h3>
              <p>(+598) 098789321</p>
              <a href="tel:+59898789321" className="info-link">Llamar ahora →</a>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Ubicación</h3>
              <p>1162 Canelones</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="info-link">Ver en mapa →</a>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#4A90E2" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Horario</h3>
              <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
              <p className="info-secondary">Sábado - Domingo: Cerrado</p>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envíanos un mensaje</h2>
            
            {status === 'success' && (
              <div className="alert alert-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#61bd4f"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <strong>¡Mensaje enviado exitosamente!</strong>
                  <p>Te responderemos pronto a tu correo electrónico.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="alert alert-error">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#eb5a46"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <strong>Error al enviar el mensaje</strong>
                  <p>Por favor, intenta nuevamente más tarde.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    className={errors.name ? 'error' : ''}
                    disabled={status === 'sending'}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: juan@ejemplo.com"
                    className={errors.email ? 'error' : ''}
                    disabled={status === 'sending'}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'error' : ''}
                  disabled={status === 'sending'}
                >
                  <option value="">-- Selecciona un asunto --</option>
                  <option value="Solicitud de integración">Solicitud de integración</option>
                  <option value="Soporte técnico">Soporte técnico</option>
                  <option value="Consulta sobre planes">Consulta sobre planes</option>
                  <option value="Sugerencia">Sugerencia</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  rows="6"
                  className={errors.message ? 'error' : ''}
                  disabled={status === 'sending'}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
                <span className="char-count">{formData.message.length} caracteres</span>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <div className="spinner"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="faq-section">
          <h2>Preguntas frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Cuánto tiempo tardan en responder?</h3>
              <p>Normalmente respondemos en menos de 24 horas durante días laborables.</p>
            </div>
            <div className="faq-item">
              <h3>¿Puedo solicitar una demo personalizada?</h3>
              <p>¡Claro! Selecciona "Consulta sobre planes" en el asunto y déjanos tus datos.</p>
            </div>
            <div className="faq-item">
              <h3>¿Qué integraciones puedo solicitar?</h3>
              <p>Puedes solicitar cualquier herramienta que uses en tu equipo. Evaluamos todas las solicitudes.</p>
            </div>
            <div className="faq-item">
              <h3>¿Ofrecen soporte en español?</h3>
              <p>Sí, nuestro equipo de soporte habla español e inglés.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;