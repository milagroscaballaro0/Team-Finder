import React, { useState } from 'react';
import './AutoTeamFormation.css';

const AutoTeamFormation = ({ onTeamCreated }) => {
  const [formData, setFormData] = useState({
    projectName: 'App Móvil de Tareas',
    teamSize: 4,
    skills: ['React', 'JavaScript', 'Node.js']
  });

  const [newSkill, setNewSkill] = useState('');

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      name: 'Equipo Fullstack',
      compatibility: 85,
      members: [
        { 
          id: 1, 
          name: 'Ana Developer', 
          skills: ['React', 'JavaScript', 'TypeScript'], 
          compatibility: 90 
        },
        { 
          id: 2, 
          name: 'Carlos Backend', 
          skills: ['Node.js', 'MongoDB', 'Express'], 
          compatibility: 85 
        },
        { 
          id: 3, 
          name: 'María Frontend', 
          skills: ['React', 'CSS', 'HTML5'], 
          compatibility: 80 
        },
        { 
          id: 4, 
          name: 'Luis Fullstack', 
          skills: ['React', 'Node.js', 'PostgreSQL'], 
          compatibility: 75 
        }
      ]
    },
    {
      id: 2, 
      name: 'Equipo Especializado',
      compatibility: 78,
      members: [
        { 
          id: 5, 
          name: 'Pedro React', 
          skills: ['React', 'TypeScript', 'Redux'], 
          compatibility: 95 
        },
        { 
          id: 6, 
          name: 'Laura Node', 
          skills: ['Node.js', 'Express', 'API REST'], 
          compatibility: 88 
        },
        { 
          id: 7, 
          name: 'Sofia MongoDB', 
          skills: ['MongoDB', 'NoSQL', 'Database Design'], 
          compatibility: 70 
        },
        { 
          id: 8, 
          name: 'David JavaScript', 
          skills: ['JavaScript', 'ES6+', 'Web APIs'], 
          compatibility: 65 
        }
      ]
    }
  ]);

  const handleGenerateTeam = () => {
    console.log('🔧 Generando equipo con:', formData);
    setTimeout(() => {
      alert('✅ Equipos generados exitosamente! Revisa las sugerencias abajo.');
    }, 1000);
  };

const handleCreateTeam = (suggestion) => {
  console.log('🚀 Creando equipo:', suggestion);
  
  const newTeam = {
    name: suggestion.name,
    project: formData.projectName,
    compatibility: suggestion.compatibility,
    members: suggestion.members.map(member => ({
      id: member.id,
      name: member.name,
      skills: member.skills,
      compatibility: member.compatibility,
      role: 'Miembro' 
    })),
    skills: formData.skills,
    status: 'activo'
  };

  alert(`🔄 Creando equipo "${suggestion.name}"...\n\nEsto puede tomar unos segundos.`);

  if (onTeamCreated) {
    onTeamCreated(newTeam);
  }
};

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="auto-formation">
      <div className="formation-header">
        <h2>Formación Automática de Equipos</h2>
        <p>Nuestro algoritmo encuentra el equipo perfecto para tu proyecto</p>
      </div>

      <div className="formation-content">
        <div className="config-panel">
          <div className="panel-header">
            <h3>Configuración del Proyecto</h3>
          </div>
          <div className="config-form">
            <div className="form-group">
              <label className="form-label">Nombre del Proyecto</label>
              <input
                type="text"
                className="form-input"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                placeholder="Ej: App Móvil de Tareas"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tamaño del Equipo</label>
              <select 
                className="form-select"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value)})}
              >
                <option value={3}>3 personas</option>
                <option value={4}>4 personas</option>
                <option value={5}>5 personas</option>
                <option value={6}>6 personas</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Habilidades Requeridas</label>
              
              <div className="skills-tags">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button 
                      type="button"
                      className="remove-skill"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <span style={{color: '#94a3b8', fontStyle: 'italic'}}>
                    No hay habilidades agregadas
                  </span>
                )}
              </div>

              <div className="skills-input-container">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Agregar habilidad (ej: Python, Docker...)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  type="button"
                  className="add-skill-btn"
                  onClick={addSkill}
                  disabled={!newSkill.trim()}
                >
                  +
                </button>
              </div>
            </div>

            <button 
              className="generate-btn"
              onClick={handleGenerateTeam}
            >
            </button>
          </div>
        </div>

        <div className="suggestions-panel">
          <div className="panel-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Equipos Sugeridos</h3>
            <span className="suggestions-count">{suggestions.length} equipos</span>
          </div>

          {suggestions.length > 0 ? (
            <div className="suggestions-grid">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card">
                  <div className="suggestion-header">
                    <div className="suggestion-title">
                      <h4>{suggestion.name}</h4>
                      <span className="compatibility-badge">
                        {suggestion.compatibility}% Compatible
                      </span>
                    </div>
                  </div>

                  <div className="suggestion-stats">
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Tamaño del Equipo</span>
                        <span className="stat-value">{suggestion.members.length} miembros</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Compatibilidad Promedio</span>
                        <span className="stat-value">{suggestion.compatibility}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="suggestion-members">
                    <div className="members-header">
                      <h5>Miembros del Equipo</h5>
                      <span className="members-count">{suggestion.members.length}</span>
                    </div>
                    
                    <div className="member-list">
                      {suggestion.members.map(member => (
                        <div key={member.id} className="member-item">
                          <div className="member-info">
                            <span className="member-name">{member.name}</span>
                            <span className="member-skills">{member.skills.join(', ')}</span>
                          </div>
                          <span className="member-compatibility">{member.compatibility}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="suggestion-actions">
                    <button 
                      className="create-team-btn"
                      onClick={() => handleCreateTeam(suggestion)}
                    >
                      🚀 Crear este Equipo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🤖</div>
              <h4>No hay sugerencias aún</h4>
              <p>Configura tu proyecto y haz clic en "Generar Equipos" para ver sugerencias</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoTeamFormation;