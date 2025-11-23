import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import AutoTeamFormation from './components/AutoTeamFormation';
import ManualTeamFormation from './components/ManualTeamFormation';
import MyTeams from './components/MyTeams';
import teamService from '../../services/teamService';
import './teams.css';

const TeamsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('auto');
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserTeams();
  }, []);

  const loadUserTeams = async () => {
    try {
      setLoading(true);
      const response = await teamService.getUserTeams();
      if (response.success) {
        setMyTeams(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando equipos:', error);
      setMyTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamCreated = async (newTeam) => {
    try {
      console.log('🔄 Guardando equipo en la base de datos...', newTeam);
     
      const teamData = {
        name: newTeam.name,
        description: `Equipo formado automáticamente para el proyecto: ${newTeam.project}`,
        project_name: newTeam.project,
        skills_required: newTeam.skills,
        members: newTeam.members.map(member => ({
          user_id: member.id,
          compatibility: member.compatibility
        }))
      };

      const response = await teamService.createTeam(teamData);
      
      if (response.success) {
        console.log('✅ Equipo guardado en BD:', response.data);
        
        await loadUserTeams();
        
        setActiveTab('my-teams');
        
        alert(`✅ Equipo "${newTeam.name}" creado exitosamente!`);
      } else {
        throw new Error(response.message || 'Error al crear equipo');
      }
      
    } catch (error) {
      console.error('❌ Error guardando equipo:', error);
    
      const teamWithId = {
        ...newTeam,
        id: Date.now(),
        created_at: new Date().toISOString(),
        average_compatibility: newTeam.compatibility,
        member_count: newTeam.members.length,
        role: 'Líder'
      };
      
      setMyTeams(prevTeams => [...prevTeams, teamWithId]);
      setActiveTab('my-teams');
      
      alert(`✅ Equipo "${newTeam.name}" creado (modo offline)`);
    }
  };

  return (
    <div className="teams-page">

      <Header />
      <div className="teams-hero">
        <div className="hero-content">
          <h1>Encuentra tu Equipo Ideal</h1>
          <p>Conecta con profesionales compatibles y forma equipos de alto rendimiento</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">+{myTeams.length + 10}</span>
              <span className="stat-label">Equipos Formados</span>
            </div>
            <div className="stat">
              <span className="stat-number">+30</span>
              <span className="stat-label">Profesionales</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Tasa de Éxito</span>
            </div>
          </div>
        </div>
      </div>

      <div className="teams-tabs-container">
        <div className="container">
          <div className="teams-tabs">
            <button 
              className={`tab-button ${activeTab === 'auto' ? 'active' : ''}`}
              onClick={() => setActiveTab('auto')}
            >
              <span className="tab-icon">🤖</span>
              Formación Automática
            </button>
            <button 
              className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              <span className="tab-icon">👥</span>
              Formación Manual
            </button>
            <button 
              className={`tab-button ${activeTab === 'my-teams' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-teams')}
            >
              <span className="tab-icon">🏆</span>
              Mis Equipos ({myTeams.length})
            </button>
          </div>
        </div>
      </div>

      <div className="teams-content">
        <div className="container">
          {activeTab === 'auto' && <AutoTeamFormation onTeamCreated={handleTeamCreated} />}
          {activeTab === 'manual' && <ManualTeamFormation onTeamCreated={handleTeamCreated} />}
          {activeTab === 'my-teams' && (
            <MyTeams 
              teams={myTeams} 
              loading={loading}
              onTeamUpdate={loadUserTeams}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamsPage;