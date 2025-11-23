import api from './api';

export const teamService = {
  // Buscar usuarios
  searchUsers: async (filters) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.interests) params.append('interests', filters.interests);
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.personality) params.append('personality', filters.personality);

      const response = await api.get(`/users/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Formar equipo automáticamente
  formAutoTeam: async (data) => {
    try {
      const response = await api.post('/teams/auto', data);
      return response.data;
    } catch (error) {
      console.error('Error forming auto team:', error);
      throw error;
    }
  },

  // Crear equipo manualmente
  createManualTeam: async (data) => {
    try {
      const response = await api.post('/teams/manual', data);
      return response.data;
    } catch (error) {
      console.error('Error creating manual team:', error);
      throw error;
    }
  },

  // Obtener equipos del usuario
  getUserTeams: async () => {
    try {
      const response = await api.get('/teams');
      return response.data;
    } catch (error) {
      console.error('Error getting user teams:', error);
      throw error;
    }
  },

  // Obtener detalles del equipo
  getTeamDetails: async (teamId) => {
    try {
      const response = await api.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting team details:', error);
      throw error;
    }
  }
};

export default teamService;
