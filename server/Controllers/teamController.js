const Team = require('../models/Team');
const User = require('../models/User');

class TeamController {

  static async searchUsers(req, res) {
    try {
      const { skills, interests, experience, personality } = req.query;
      const currentUserId = req.user.id;

      const filters = {
        skills: skills ? skills.split(',') : [],
        interests: interests ? interests.split(',') : [],
        experience: experience || '',
        personality: personality || ''
      };

      const users = await User.searchUsers(filters, currentUserId);
      
      const usersWithCompatibility = await Promise.all(
        users.map(async (user) => {
          const compatibility = await Team.calculateCompatibility(currentUserId, user.id);
          return {
            ...user,
            compatibility
          };
        })
      );

      res.json({
        success: true,
        data: usersWithCompatibility
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error buscando usuarios',
        error: error.message
      });
    }
  }

  static async formAutoTeam(req, res) {
    try {
      const currentUserId = req.user.id;
      const { teamSize = 4, requiredSkills = [] } = req.body;

      const users = await User.getRandomUsers(15, currentUserId);
      
      const usersWithCompatibility = await Promise.all(
        users.map(async (user) => {
          const compatibility = await Team.calculateCompatibility(currentUserId, user.id);
          return {
            ...user,
            compatibility
          };
        })
      );

      usersWithCompatibility.sort((a, b) => b.compatibility - a.compatibility);

      const teamSuggestions = [];
      const maxTeams = 3;

      for (let i = 0; i < maxTeams; i++) {
        const teamMembers = [currentUserId]; 
        let teamCompatibility = 0;
        let memberCount = 1;

        for (const user of usersWithCompatibility) {
          if (memberCount >= teamSize) break;
          
          if (requiredSkills.length > 0) {
            const hasRequiredSkills = requiredSkills.some(skill => 
              user.skills.includes(skill)
            );
            if (!hasRequiredSkills) continue;
          }

          teamMembers.push(user.id);
          teamCompatibility += user.compatibility;
          memberCount++;
        }

        const avgCompatibility = teamCompatibility / (teamMembers.length - 1);

        teamSuggestions.push({
          id: i + 1,
          members: teamMembers,
          averageCompatibility: Math.round(avgCompatibility),
          requiredSkillsCoverage: Math.round((requiredSkills.length > 0 ? 
            (teamMembers.filter(memberId => {
              const member = usersWithCompatibility.find(u => u.id === memberId);
              return member && requiredSkills.some(skill => member.skills.includes(skill));
            }).length / requiredSkills.length) * 100 : 100))
        });
      }

      res.json({
        success: true,
        data: {
          suggestions: teamSuggestions,
          availableUsers: usersWithCompatibility
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error formando equipo automático',
        error: error.message
      });
    }
  }

  static async createManualTeam(req, res) {
    try {
      const currentUserId = req.user.id;
      const { name, description, project_name, members } = req.body;

      if (!name || !members || members.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nombre del equipo y al menos un miembro son requeridos'
        });
      }

      let totalCompatibility = 0;
      let compatibilityCount = 0;

      for (const memberId of members) {
        if (memberId !== currentUserId) {
          const compatibility = await Team.calculateCompatibility(currentUserId, memberId);
          totalCompatibility += compatibility;
          compatibilityCount++;
        }
      }

      const averageCompatibility = compatibilityCount > 0 ? 
        Math.round(totalCompatibility / compatibilityCount) : 100;

      const teamId = await Team.create({
        name,
        description,
        project_name,
        created_by: currentUserId,
        average_compatibility: averageCompatibility
      });

      const allMembers = [currentUserId, ...members.filter(id => id !== currentUserId)];
      
      for (const memberId of allMembers) {
        const role = memberId === currentUserId ? 'Líder' : 'Miembro';
        await Team.addMember(teamId, memberId, role);
      }

      res.json({
        success: true,
        message: 'Equipo creado exitosamente',
        data: {
          teamId,
          averageCompatibility
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creando equipo',
        error: error.message
      });
    }
  }

  static async getUserTeams(req, res) {
    try {
      const currentUserId = req.user.id;
      const teams = await Team.getUserTeams(currentUserId);

      res.json({
        success: true,
        data: teams
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo equipos',
        error: error.message
      });
    }
  }

  static async getTeamDetails(req, res) {
    try {
      const { id } = req.params;
      const teamDetails = await Team.getTeamDetails(id);

      if (!teamDetails.team) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      res.json({
        success: true,
        data: teamDetails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo detalles del equipo',
        error: error.message
      });
    }
  }
}

module.exports = TeamController;