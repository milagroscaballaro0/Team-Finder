import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import './PersonalizableProfile.css';
import { useAuth } from '../../context/AuthContext.jsx';

const Icons = {
  arrowBack: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  ),
  save: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  ),
  upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
    </svg>
  ),
  camera: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  delete: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  )
};

const AvatarUpload = ({ currentAvatar, onAvatarChange }) => {
  const [preview, setPreview] = useState(currentAvatar);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onAvatarChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="pp-avatar-upload">
      <div className="pp-avatar-preview">
        <img 
          src={preview || defaultAvatar} 
          alt="Preview avatar" 
          className="pp-avatar-image"
        />
        <div className="pp-avatar-overlay">
          <Icons.camera />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="pp-avatar-input"
        id="avatar-upload"
      />
      <label htmlFor="avatar-upload" className="pp-upload-btn">
        <Icons.upload /> Cambiar Foto
      </label>
      <button 
        type="button" 
        className="pp-reset-avatar"
        onClick={() => {
          setPreview(null);
          onAvatarChange(null);
        }}
      >
        <Icons.delete /> Usar Avatar por Defecto
      </button>
    </div>
  );
};

const SkillsInput = ({ skills, onSkillsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentSkills, setCurrentSkills] = useState(skills || []);

  const addSkill = (skill) => {
    if (skill.trim() && !currentSkills.includes(skill.trim())) {
      const newSkills = [...currentSkills, skill.trim()];
      setCurrentSkills(newSkills);
      onSkillsChange(newSkills);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = currentSkills.filter(skill => skill !== skillToRemove);
    setCurrentSkills(newSkills);
    onSkillsChange(newSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="pp-skills-input">
      <label className="pp-label">Habilidades</label>
      <div className="pp-skills-tags">
        {currentSkills.map((skill, index) => (
          <div key={index} className="pp-skill-tag">
            {skill}
            <button 
              type="button"
              onClick={() => removeSkill(skill)}
              className="pp-remove-skill"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="pp-skill-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Agregar habilidad..."
          className="pp-skill-input"
        />
        <button 
          type="button"
          onClick={() => addSkill(inputValue)}
          disabled={!inputValue.trim()}
          className="pp-add-skill-btn"
        >
          Agregar
        </button>
      </div>
      <p className="pp-help-text">Presiona Enter o click en Agregar para añadir habilidades</p>
    </div>
  );
};

export default function PersonalizableProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    skills: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            bio: user.bio || '',
            avatar: user.avatar || '',
            skills: user.skills || []
          });
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...formData,
        updatedAt: new Date().toISOString()
      };;

      updateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setChanges(false);
      
      alert('Perfil actualizado exitosamente');
      
      navigate('/employeeprofile');
      
    } catch (error) {
      console.error('Error guardando perfil:', error);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (changes) {
      const confirm = window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
      if (confirm) {
        navigate('/employeeprofile');
      }
    } else {
      navigate('/employeeprofile');
    }
  };

  if (loading) {
    return (
      <div className="pp-page">
        <Header />
        <div className="pp-loading">
          <div className="pp-loading-spinner"></div>
          <p>Cargando datos del perfil...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pp-page">
        <Header />
        <div className="pp-error">
          <h2>Usuario no encontrado</h2>
          <p>Por favor, inicia sesión para editar tu perfil.</p>
          <button onClick={() => navigate('/login')} className="pp-login-btn">
            Ir al Login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pp-page">
      <Header />
      
      <div className="pp-container">
        <div className="pp-header">
          <button onClick={handleCancel} className="pp-back-btn">
            <Icons.arrowBack /> Volver al Perfil
          </button>
          <h1 className="pp-title">Editar Perfil</h1>
          <button 
            onClick={handleSave}
            disabled={!changes || saving}
            className="pp-save-btn"
          >
            <Icons.save /> 
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        <div className="pp-content">
          <div className="pp-left-column">
            <div className="pp-section">
              <h2 className="pp-section-title">Información Personal</h2>
              
              <div className="pp-form-group">
                <label className="pp-label" htmlFor="name">Nombre Completo</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pp-input"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="pp-form-group">
                <label className="pp-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pp-input"
                  placeholder="tu.email@ejemplo.com"
                />
              </div>

              <div className="pp-form-group">
                <label className="pp-label" htmlFor="bio">Biografía</label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="pp-textarea"
                  placeholder="Cuéntanos sobre ti, tus experiencias y objetivos profesionales..."
                  rows="5"
                />
                <div className="pp-char-count">
                  {formData.bio.length}/500 caracteres
                </div>
              </div>

              <SkillsInput 
                skills={formData.skills}
                onSkillsChange={(skills) => handleInputChange('skills', skills)}
              />
            </div>
          </div>

          <div className="pp-right-column">
            <div className="pp-section">
              <h2 className="pp-section-title">Foto de Perfil</h2>
              <AvatarUpload 
                currentAvatar={formData.avatar}
                onAvatarChange={(avatar) => handleInputChange('avatar', avatar)}
              />
            </div>

            <div className="pp-section">
              <h2 className="pp-section-title">Vista Previa</h2>
              <div className="pp-preview">
                <div className="pp-preview-avatar">
                  <img 
                    src={formData.avatar || `data:image/svg+xml;utf8,${encodeURIComponent(`
                      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
                        <defs>
                          <linearGradient id='previewGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                            <stop offset='0%' style='stop-color:#4A90E2;stop-opacity:1' />
                            <stop offset='100%' style='stop-color:#357ABD;stop-opacity:1' />
                          </linearGradient>
                        </defs>
                        <rect width='100%' height='100%' fill='url(#previewGradient)' />
                        <g transform='translate(60,60)'>
                          <circle cx='0' cy='-20' r='25' fill='white' opacity='0.9' />
                          <rect x='-35' y='25' width='70' height='40' rx='10' fill='white' opacity='0.8' />
                        </g>
                      </svg>
                    `)}`} 
                    alt="Preview" 
                  />
                </div>
                <div className="pp-preview-info">
                  <h3>{formData.name || 'Nombre del Usuario'}</h3>
                  <p className="pp-preview-bio">
                    {formData.bio || 'Biografía del usuario...'}
                  </p>
                  {formData.skills.length > 0 && (
                    <div className="pp-preview-skills">
                      {formData.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="pp-preview-skill">
                          {skill}
                        </span>
                      ))}
                      {formData.skills.length > 3 && (
                        <span className="pp-preview-skill-more">
                          +{formData.skills.length - 3} más
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pp-actions-footer">
          <button onClick={handleCancel} className="pp-cancel-btn">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!changes || saving}
            className="pp-save-btn-large"
          >
            <Icons.save /> 
            {saving ? 'Guardando Cambios...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
