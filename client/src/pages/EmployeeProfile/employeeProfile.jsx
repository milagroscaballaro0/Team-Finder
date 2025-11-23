import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import './employeeProfileStyle.css';
import { useAuth } from '../../context/AuthContext.jsx';

const Icons = {
  calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  ),
  team: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.02 3.02 0 0 0 16.95 6h-2.67c-.88 0-1.68.5-2.08 1.29L9.5 12H8c-1.65 0-3 1.35-3 3v7h3v-2h4v2h3v-3h-4v-2h2.5l1.65-4.95L14.5 12h-1.18l2.5 7.5H20zm-8-8H9v-2h3v2zm8-12c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM6 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2z"/>
    </svg>
  ),
  planning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
  ),
  review: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
    </svg>
  ),
  oneonone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  ),
  clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  ),
  trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </svg>
  ),
  skills: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  crown: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  ),
  email: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  date: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  ),
  id: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  company: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    </svg>
  ),
  refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  ),
  edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
    </svg>
  ),
  user: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  )
};

const MeetingsCard = () => {
  const meetings = [
    { id: 1, date: '20 Lun', title: 'Reunión de equipo', time: '10:00 AM', type: 'team' },
    { id: 2, date: '21 Mar', title: 'Planificación sprint', time: '11:30 AM', type: 'planning' },
    { id: 3, date: '22 Mié', title: 'Review de proyecto', time: '03:00 PM', type: 'review' },
    { id: 4, date: '23 Jue', title: '1:1 con manager', time: '09:00 AM', type: 'oneonone' }
  ];

  const getMeetingIcon = (type) => {
    const icons = {
      team: <Icons.team />,
      planning: <Icons.planning />,
      review: <Icons.review />,
      oneonone: <Icons.oneonone />
    };
    return icons[type] || <Icons.calendar />;
  };

  return (
    <div className="ep-meetings-card">
      <div className="ep-card-header">
        <h3><Icons.calendar /> Próximas Reuniones</h3>
        <span className="ep-badge">{meetings.length}</span>
      </div>
      <div className="ep-meetings-list">
        {meetings.map(meeting => (
          <div key={meeting.id} className="ep-meeting-item">
            <div className="ep-meeting-icon">
              {getMeetingIcon(meeting.type)}
            </div>
            <div className="ep-meeting-info">
              <div className="ep-meeting-title">{meeting.title}</div>
              <div className="ep-meeting-details">
                <span className="ep-meeting-date">{meeting.date}</span>
                <span className="ep-meeting-time">{meeting.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsCard = () => {
  const stats = [
    { label: 'Proyectos Completados', value: '12', icon: <Icons.check />, color: '#27ae60' },
    { label: 'Tareas Pendientes', value: '8', icon: <Icons.planning />, color: '#f39c12' },
    { label: 'Horas esta semana', value: '32', icon: <Icons.clock />, color: '#3498db' },
    { label: 'Colaboraciones', value: '15', icon: <Icons.team />, color: '#9b59b6' }
  ];

  return (
    <div className="ep-stats-card">
      <div className="ep-card-header">
        <h3><Icons.chart /> Estadísticas</h3>
      </div>
      <div className="ep-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="ep-stat-item">
            <div 
              className="ep-stat-icon"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              {stat.icon}
            </div>
            <div className="ep-stat-content">
              <div className="ep-stat-value">{stat.value}</div>
              <div className="ep-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function TopRoleCard({ userSkills, testResults, onTakeTest }) {
  if (testResults) {
    const topRoles = Object.entries(testResults.scores)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 3);

    return (
      <div className="ep-top-role-section">
        <div className="ep-section-header">
          <h2><Icons.trophy /> Resultados de tu Perfil</h2>
          <p>Descubre tus roles tecnológicos más afines</p>
        </div>
        
        <div className="ep-roles-grid">
         
          <div className="ep-main-role-card">
            <div className="ep-role-badge">ROL PRINCIPAL</div>
            <div className="ep-role-icon"><Icons.crown /></div>
            <h3 className="ep-role-title">{testResults.topRoleName}</h3>
            <div className="ep-role-score">
              <div className="ep-score-bar">
                <div 
                  className="ep-score-fill"
                  style={{ 
                    width: `${(testResults.scores[testResults.topRole]?.score / 15) * 100}%`,
                    background: 'linear-gradient(135deg, #4A90E2, #357ABD)'
                  }}
                ></div>
              </div>
              <span className="ep-score-text">
                {testResults.scores[testResults.topRole]?.score}/15 puntos
              </span>
            </div>
            <button 
              onClick={onTakeTest}
              className="ep-retake-test-btn"
            >
              <Icons.refresh /> Realizar Test Nuevamente
            </button>
          </div>

          <div className="ep-top-roles-card">
            <h4><Icons.star /> Top 3 Roles</h4>
            <div className="ep-top-roles-list">
              {topRoles.map(([roleKey, roleData], index) => (
                <div key={roleKey} className="ep-top-role-item">
                  <div className="ep-rank-badge">{index + 1}</div>
                  <div className="ep-role-info">
                    <div className="ep-role-name">{roleData.name}</div>
                    <div className="ep-role-score-small">
                      {roleData.score}/15 puntos
                    </div>
                  </div>
                  <div 
                    className="ep-affinity-badge"
                    style={{ 
                      backgroundColor: 
                        roleData.score >= 12 ? '#27ae60' : 
                        roleData.score >= 8 ? '#f39c12' : '#e74c3c'
                    }}
                  >
                    {roleData.score >= 12 ? 'Alta' : roleData.score >= 8 ? 'Media' : 'Baja'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {userSkills && userSkills.length > 0 && (
            <div className="ep-skills-card">
              <h4><Icons.skills /> Mis Habilidades</h4>
              <div className="ep-skills-grid">
                {userSkills.map((skill, index) => (
                  <div key={index} className="ep-skill-tag">
                    {skill}
                  </div>
                ))}
              </div>
              <button className="ep-add-skill-btn">
                + Agregar Habilidad
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ep-empty-test-section">
      <div className="ep-empty-test-content">
        <div className="ep-empty-icon"><Icons.user /></div>
        <h3>Completa tu Perfil</h3>
        <p>Realiza el test de roles para descubrir tu perfil tecnológico ideal y desbloquear oportunidades personalizadas.</p>
        <button 
          onClick={onTakeTest}
          className="ep-take-test-btn"
        >
          Comenzar Test de Roles
        </button>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserProfile = async () => {
    try {
      if (user && user.id) {
        const response = await fetch(`http://teamfinder.anima.edu.uy/api/users/profile/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const userWithProfile = data.user;
            
            if (userWithProfile.testResult) {
              setTestResults({
                scores: userWithProfile.testResult.scores,
                topRole: userWithProfile.testResult.topRole,
                topRoleName: userWithProfile.testResult.topRole,
                completedAt: userWithProfile.testResult.createdAt
              });
            } else {
              setTestResults(null);
            }
          }
        }
      }

      const savedTestResults = localStorage.getItem('testResults');
      if (savedTestResults && !testResults) {
        setTestResults(JSON.parse(savedTestResults));
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const refreshProfile = () => {
    setRefreshing(true);
    loadUserProfile();
  };

  const handleTakeTest = () => {
    navigate('/formulario');
  };

  const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
      <defs>
        <linearGradient id='avatarGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:#4A90E2;stop-opacity:1' />
          <stop offset='100%' style='stop-color:#357ABD;stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#avatarGradient)' />
      <g transform='translate(120,120)'>
        <circle cx='0' cy='-20' r='50' fill='white' opacity='0.9' />
        <rect x='-70' y='50' width='140' height='80' rx='20' fill='white' opacity='0.8' />
      </g>
    </svg>
  `)}`;

  const formatEmail = (email) => {
    if (!email) return (<><strong>Usuario</strong>@gmail.com</>);
    const parts = email.split('@');
    if (parts.length === 2) return (<><strong>{parts[0]}</strong>@{parts[1]}</>);
    return email;
  };

  const handleEdit = () => navigate('/employeeprofile/edit');

  if (loading) {
    return (
      <div className="ep-page">
        <Header />
        <div className="ep-loading-container">
          <div className="ep-loading-spinner"></div>
          <div className="ep-loading-text">Cargando tu perfil...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ep-page">
        <Header />
        <div className="ep-error-container">
          <div className="ep-error-icon"><Icons.user /></div>
          <h2>Usuario no encontrado</h2>
          <p>Por favor, inicia sesión nuevamente para acceder a tu perfil.</p>
          <button 
            onClick={() => navigate('/login')}
            className="ep-login-btn"
          >
            Ir al Login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ep-page">
      <Header />
      
      <div className="ep-controls-header">
        <button 
          onClick={refreshProfile}
          disabled={refreshing}
          className="ep-refresh-btn"
        >
          <Icons.refresh /> {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <main className="ep-main">

        <section className="ep-hero-section">
          <div className="ep-hero-background"></div>
          <div className="ep-hero-content">
            <div className="ep-avatar-container">
              <img 
                src={user.avatar || defaultAvatar} 
                alt={`Avatar de ${user.name}`} 
                className="ep-avatar" 
              />
              <div className="ep-avatar-badge"><Icons.star /></div>
            </div>
            
            <div className="ep-profile-info">
              <div className="ep-name-container">
                <h1 className="ep-name">{user.name || 'Usuario'}</h1>
                <button className="ep-edit-profile-btn" onClick={handleEdit}>
                  <Icons.edit /> Editar Perfil
                </button>
              </div>
              
              <p className="ep-title">
                {testResults ? testResults.topRoleName : 'Miembro del equipo'}
              </p>
              
              <div className="ep-badges-container">
                <span className="ep-role-badge">{user.role || 'Empleado'}</span>
                {testResults && (
                  <span className="ep-test-badge"><Icons.check /> Test Completado</span>
                )}
              </div>
              
              <p className="ep-bio">
                {user.bio || `Bienvenido a tu perfil profesional. ${user.name ? user.name + ' está' : 'Estás'} listo para encontrar oportunidades increíbles que se adapten a tus habilidades.`}
                {!testResults && (
                  <span className="ep-test-reminder">
                    Completa el test de roles para personalizar tu experiencia.
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="ep-content-grid">

          <div className="ep-left-column">
            <MeetingsCard />
            <StatsCard />
          </div>

          <div className="ep-right-column">
            <div className="ep-contact-card">
              <div className="ep-card-header">
                <h3><Icons.user /> Información de Contacto</h3>
              </div>
              <div className="ep-contact-list">
                <div className="ep-contact-item">
                  <span className="ep-contact-icon"><Icons.email /></span>
                  <div className="ep-contact-details">
                    <span className="ep-contact-label">Email</span>
                    <span className="ep-contact-value">{formatEmail(user.email)}</span>
                  </div>
                </div>
                
                <div className="ep-contact-item">
                  <span className="ep-contact-icon"><Icons.date /></span>
                  <div className="ep-contact-details">
                    <span className="ep-contact-label">Miembro desde</span>
                    <span className="ep-contact-value">
                      {new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="ep-contact-item">
                  <span className="ep-contact-icon"><Icons.id /></span>
                  <div className="ep-contact-details">
                    <span className="ep-contact-label">ID de Usuario</span>
                    <span className="ep-contact-value">{user.id}</span>
                  </div>
                </div>
                
                {user.company && (
                  <div className="ep-contact-item">
                    <span className="ep-contact-icon"><Icons.company /></span>
                    <div className="ep-contact-details">
                      <span className="ep-contact-label">Empresa</span>
                      <span className="ep-contact-value">{user.company.name}</span>
                    </div>
                  </div>
                )}
                
                {testResults && (
                  <div className="ep-contact-item">
                    <span className="ep-contact-icon"><Icons.trophy /></span>
                    <div className="ep-contact-details">
                      <span className="ep-contact-label">Rol Principal</span>
                      <span className="ep-contact-value highlight">
                        {testResults.topRoleName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ep-quick-stats-card">
              <div className="ep-card-header">
                <h3><Icons.chart /> Resumen</h3>
              </div>
              <div className="ep-quick-stats">
                <div className="ep-quick-stat">
                  <div className="ep-quick-stat-value">
                    {testResults ? <Icons.check /> : <Icons.clock />}
                  </div>
                  <div className="ep-quick-stat-label">Test Completado</div>
                </div>
                
                <div className="ep-quick-stat">
                  <div className="ep-quick-stat-value">
                    {testResults ? '100%' : '60%'}
                  </div>
                  <div className="ep-quick-stat-label">Perfil Completo</div>
                </div>
                
                {testResults && (
                  <div className="ep-quick-stat">
                    <div className="ep-quick-stat-value">
                      {testResults.scores && testResults.scores[testResults.topRole]?.score}/15
                    </div>
                    <div className="ep-quick-stat-label">Puntuación Máxima</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <TopRoleCard 
          userSkills={user.skills || []} 
          testResults={testResults}
          onTakeTest={handleTakeTest}
        />

        {!testResults && (
          <div className="ep-fab-container">
            <button 
              onClick={handleTakeTest}
              className="ep-fab-button"
            >
              <span className="ep-fab-icon"><Icons.trophy /></span>
              <span className="ep-fab-text">Realizar Test</span>
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
