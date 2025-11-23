import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import teamService from '../../../services/teamService';
import './MyTeams.css';

const MyTeams = ({ teams = [], loading = false, onTeamUpdate }) => {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [localTeams, setLocalTeams] = useState([]);

  useEffect(() => {
    setLocalTeams(teams);
  }, [teams]);

  useEffect(() => {
    if (teams.length === 0 && !loading) {
      loadUserTeams();
    }
  }, []);

  const loadUserTeams = async () => {
    try {
      const response = await teamService.getUserTeams();
      if (response.success) {
        setLocalTeams(response.data || []);
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      }
    } catch (error) {
      console.error('Error cargando equipos:', error);
    }
  };

  const viewTeamDetails = async (teamId) => {
    try {
      const response = await teamService.getTeamDetails(teamId);
      if (response.success) {
        setSelectedTeam(response.data);
      }
    } catch (error) {
      console.error('Error cargando detalles del equipo:', error);
    }
  };

  const closeTeamDetails = () => {
    setSelectedTeam(null);
  };

  const displayTeams = localTeams.length > 0 ? localTeams : teams;

  if (loading) {
    return (
      <div className="my-teams">
        <div className="formation-header">
          <h2>Mis Equipos</h2>
          <p>Cargando tus equipos...</p>
        </div>
        <div className="loading-state">
          <div className="spinner large"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-teams">
      <div className="formation-header">
        <h2>Mis Equipos</h2>
        <p>Gestiona y visualiza todos los equipos en los que participas</p>
      </div>

      {displayTeams.length === 0 ? (
        <div className="empty-teams">
          <div className="empty-content">
            <div className="empty-icon">🤝</div>
            <h3>No tienes equipos aún</h3>
            <p>Comienza formando tu primer equipo para colaborar con otros profesionales</p>
            <div className="empty-actions">
              <button 
                onClick={() => window.location.href = '/teams?tab=auto'}
                className="cta-button primary"
              >
                🚀 Formar Equipo Automáticamente
              </button>
              <button 
                onClick={() => window.location.href = '/teams?tab=manual'}
                className="cta-button secondary"
              >
                👥 Crear Equipo Manualmente
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="teams-content">
          <div className="teams-stats">
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <span className="stat-number">{displayTeams.length}</span>
                <span className="stat-label">Equipos Totales</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <span className="stat-number">
                  {displayTeams.reduce((acc, team) => acc + (team.member_count || team.members?.length || 1), 0)}
                </span>
                <span className="stat-label">Miembros Totales</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <span className="stat-number">
                  {Math.round(displayTeams.reduce((acc, team) => acc + (team.average_compatibility || team.compatibility || 0), 0) / displayTeams.length)}%
                </span>
                <span className="stat-label">Compatibilidad Promedio</span>
              </div>
            </div>
          </div>

          <div className="teams-grid">
            {displayTeams.map(team => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <h3 className="team-name">{team.name}</h3>
                  <div className="team-meta">
                    <span className="compatibility-badge">
                      {team.average_compatibility || team.compatibility || 85}% Compatible
                    </span>
                    <span className="team-date">
                      {new Date(team.created_at || team.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {team.description && (
                  <p className="team-description">{team.description}</p>
                )}
                
                {(team.project_name || team.project) && (
                  <div className="team-project">
                    <strong>Proyecto:</strong> {team.project_name || team.project}
                  </div>
                )}
                
                <div className="team-stats">
                  <div className="team-stat">
                    <span className="stat-label">Miembros:</span>
                    <span className="stat-value">{team.member_count || team.members?.length || 1}</span>
                  </div>
                  <div className="team-stat">
                    <span className="stat-label">Rol:</span>
                    <span className="stat-value role">{team.role || 'Miembro'}</span>
                  </div>
                </div>
                
                <div className="team-actions">
                  <button 
                    onClick={() => viewTeamDetails(team.id)}
                    className="action-btn primary"
                  >
                    👁️ Ver Detalles
                  </button>
                  <button className="action-btn secondary">
                    💬 Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTeam && (
        <div className="modal-overlay" onClick={closeTeamDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTeam.team?.name || selectedTeam.name}</h3>
              <button onClick={closeTeamDetails} className="close-btn">×</button>
            </div>
            
            <div className="modal-body">
              {(selectedTeam.team?.description || selectedTeam.description) && (
                <div className="modal-section">
                  <h4>Descripción</h4>
                  <p>{selectedTeam.team?.description || selectedTeam.description}</p>
                </div>
              )}
              
              {(selectedTeam.team?.project_name || selectedTeam.project) && (
                <div className="modal-section">
                  <h4>Proyecto</h4>
                  <p>{selectedTeam.team?.project_name || selectedTeam.project}</p>
                </div>
              )}
              
              <div className="modal-section">
                <h4>Miembros del Equipo ({selectedTeam.members?.length || selectedTeam.team?.members?.length || 0})</h4>
                <div className="members-list">
                  {(selectedTeam.members || selectedTeam.team?.members || []).map(member => (
                    <div key={member.id} className="member-item">
                      <div className="member-avatar">
                        {member.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-role">{member.role}</span>
                      </div>
                      <span className="member-email">{member.email}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="modal-stats">
                <div className="modal-stat">
                  <span className="stat-label">Compatibilidad Promedio</span>
                  <span className="stat-value">{selectedTeam.team?.average_compatibility || selectedTeam.compatibility || 85}%</span>
                </div>
                <div className="modal-stat">
                  <span className="stat-label">Fecha de Creación</span>
                  <span className="stat-value">
                    {new Date(selectedTeam.team?.created_at || selectedTeam.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button onClick={closeTeamDetails} className="modal-btn secondary">
                Cerrar
              </button>
              <button className="modal-btn primary">
                💬 Abrir Chat del Equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeams;