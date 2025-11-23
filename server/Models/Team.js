const db = require('../config/database');

class Team {

  static async create(teamData) {
    const [result] = await db.execute(
      'INSERT INTO teams (name, description, project_name, created_by, average_compatibility) VALUES (?, ?, ?, ?, ?)',
      [teamData.name, teamData.description, teamData.project_name, teamData.created_by, teamData.average_compatibility || 0]
    );
    return result.insertId;
  }

  static async addMember(teamId, userId, role = 'Miembro') {
    const [result] = await db.execute(
      'INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)',
      [teamId, userId, role]
    );
    return result;
  }

  static async getUserTeams(userId) {
    const [rows] = await db.execute(
      `SELECT t.*, tm.role 
       FROM teams t 
       JOIN team_members tm ON t.id = tm.team_id 
       WHERE tm.user_id = ? 
       ORDER BY t.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getTeamDetails(teamId) {
  
    const [teamRows] = await db.execute(
      'SELECT * FROM teams WHERE id = ?',
      [teamId]
    );

    const [memberRows] = await db.execute(
      `SELECT u.id, u.name, u.email, u.avatar, tm.role 
       FROM team_members tm 
       JOIN users u ON tm.user_id = u.id 
       WHERE tm.team_id = ?`,
      [teamId]
    );

    return {
      team: teamRows[0],
      members: memberRows
    };
  }

  static async calculateCompatibility(user1Id, user2Id) {

    const [commonSkills] = await db.execute(
      `SELECT COUNT(*) as count FROM (
        SELECT skill_name FROM user_skills WHERE user_id = ?
        INTERSECT
        SELECT skill_name FROM user_skills WHERE user_id = ?
      ) AS common`,
      [user1Id, user2Id]
    );

    const [totalSkills] = await db.execute(
      `SELECT COUNT(DISTINCT skill_name) as count FROM (
        SELECT skill_name FROM user_skills WHERE user_id = ?
        UNION
        SELECT skill_name FROM user_skills WHERE user_id = ?
      ) AS all_skills`,
      [user1Id, user2Id]
    );

    const [commonInterests] = await db.execute(
      `SELECT COUNT(*) as count FROM (
        SELECT interest_name FROM user_interests WHERE user_id = ?
        INTERSECT
        SELECT interest_name FROM user_interests WHERE user_id = ?
      ) AS common`,
      [user1Id, user2Id]
    );

    const [totalInterests] = await db.execute(
      `SELECT COUNT(DISTINCT interest_name) as count FROM (
        SELECT interest_name FROM user_interests WHERE user_id = ?
        UNION
        SELECT interest_name FROM user_interests WHERE user_id = ?
      ) AS all_interests`,
      [user1Id, user2Id]
    );

    const skillCompatibility = totalSkills.count > 0 ? (commonSkills.count / totalSkills.count) * 50 : 0;
    const interestCompatibility = totalInterests.count > 0 ? (commonInterests.count / totalInterests.count) * 50 : 0;

    return Math.round(skillCompatibility + interestCompatibility);
  }
}

module.exports = Team;