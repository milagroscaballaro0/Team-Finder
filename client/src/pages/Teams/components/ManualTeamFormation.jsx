import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import teamService from '../../../services/teamService';
import UserCard from './UserCard';
import './ManualTeamFormation.css';

const ManualTeamFormation = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    skills: '',
    interests: '',
    experience: '',
    personality: ''
  });
  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    project_name: ''
  });

  const searchUsers = async () => {
    setSearching(true);
    try {
      const response = await teamService.searchUsers(filters);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error buscando usuarios:', error);
    } finally {
      setSearching(false);
    }
  };

  const toggleUserSelection = (user) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const createTeam = async () => {
    if (!teamForm.name || selectedUsers.length === 0) {
      alert('Por favor ingresa un nombre para el equipo y selecciona al menos un miembro');
      return;
    }

    setLoading(true);
    try {
      const response = await teamService.createManualTeam({
        ...teamForm,
        members: selectedUsers.map(user => user.id)
      });

      if (response.success) {
        alert(`¡Equipo "${teamForm.name}" creado exitosamente!`);
        setTeamForm({ name: '', description: '', project_name: '' });
        setSelectedUsers([]);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error creando equipo:', error);
      alert('Error creando el equipo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchUsers();
  }, []);

  return (
    <div className="manual-formation">
      <div className="formation-header">
        <h2>Formación Manual de Equipos</h2>
        <p>Selecciona manualmente los miembros perfectos para tu equipo</p>
      </div>

      <div className="manual-content">
        <div className="left-panel">
          <div className="search-panel">
            <div className="panel-header">
              <h3>🔍 Buscar Usuarios</h3>
            </div>
            <div className="search-filters">
              <div className="filter-group">
                <label className="filter-label">Habilidades</label>
                <input
                  type="text"
                  placeholder="React, Python, Design..."
                  value={filters.skills}
                  onChange={(e) => setFilters({...filters, skills: e.target.value})}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Intereses</label>
                <input
                  type="text"
                  placeholder="AI, Web3, Startup..."
                  value={filters.interests}
                  onChange={(e) => setFilters({...filters, interests: e.target.value})}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Experiencia</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  className="filter-select"
                >
                  <option value="">Todos los niveles</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <button 
                onClick={searchUsers} 
                disabled={searching}
                className="search-btn"
              >
                {searching ? (
                  <>
                    <div className="spinner small"></div>
                    Buscando...
                  </>
                ) : (
                  '🔍 Buscar Usuarios'
                )}
              </button>
            </div>
          </div>

          <div className="selected-panel">
            <div className="panel-header">
              <h3>👥 Miembros Seleccionados</h3>
              <span className="selected-count">{selectedUsers.length}</span>
            </div>
            <div className="selected-list">
              {selectedUsers.length === 0 ? (
                <div className="empty-selected">
                  <span>👆 Selecciona usuarios del panel derecho</span>
                </div>
              ) : (
                selectedUsers.map(user => (
                  <div key={user.id} className="selected-user">
                    <div className="selected-user-info">
                      <div className="selected-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="selected-name">{user.name}</span>
                    </div>
                    <button 
                      onClick={() => toggleUserSelection(user)}
                      className="remove-user-btn"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="center-panel">
          <div className="users-panel">
            <div className="panel-header">
              <h3>💼 Usuarios Disponibles</h3>
              <span className="users-count">{users.length} encontrados</span>
            </div>
            
            {users.length === 0 ? (
              <div className="empty-users">
                <div className="empty-icon">🔍</div>
                <h4>No se encontraron usuarios</h4>
                <p>Prueba con otros filtros de búsqueda</p>
              </div>
            ) : (
              <div className="users-grid">
                {users.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    selected={!!selectedUsers.find(u => u.id === user.id)}
                    onToggleSelect={() => toggleUserSelection(user)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="creation-panel">
            <div className="panel-header">
              <h3>🚀 Crear Equipo</h3>
            </div>
            
            <div className="creation-form">
              <div className="form-group">
                <label className="form-label">Nombre del equipo *</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                  placeholder="Ej: Dream Team Development"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Proyecto</label>
                <input
                  type="text"
                  value={teamForm.project_name}
                  onChange={(e) => setTeamForm({...teamForm, project_name: e.target.value})}
                  placeholder="Ej: E-commerce App"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                  placeholder="Describe el objetivo del equipo..."
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">Miembros seleccionados:</span>
                  <span className="stat-value">{selectedUsers.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Compatibilidad promedio:</span>
                  <span className="stat-value">
                    {selectedUsers.length > 0 
                      ? Math.round(selectedUsers.reduce((acc, user) => acc + user.compatibility, 0) / selectedUsers.length) 
                      : 0}%
                  </span>
                </div>
              </div>

              <button 
                onClick={createTeam}
                disabled={loading || !teamForm.name || selectedUsers.length === 0}
                className={`create-team-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Creando equipo...
                  </>
                ) : (
                  '🏆 Crear Equipo'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualTeamFormation;