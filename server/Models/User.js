import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  saveTestResults,
  getUserProfile,
  getUserTestResults
} from '../Controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/profile/:id', getUserProfile);  
router.get('/:userId/test-results', getUserTestResults);
router.post('/save-test-results', saveTestResults); 
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

class User {
  static async searchUsers(filters, currentUserId) {
    let query = `
      SELECT DISTINCT u.id, u.name, u.email, u.avatar, u.experience_level,
      GROUP_CONCAT(DISTINCT us.skill_name) as skills,
      GROUP_CONCAT(DISTINCT ui.interest_name) as interests
      FROM users u
      LEFT JOIN user_skills us ON u.id = us.user_id
      LEFT JOIN user_interests ui ON u.id = ui.user_id
      WHERE u.id != ?
    `;
    
    const params = [currentUserId];
    let conditions = [];

    if (filters.skills && filters.skills.length > 0) {
      conditions.push('us.skill_name IN (?)');
      params.push(filters.skills);
    }

    if (filters.interests && filters.interests.length > 0) {
      conditions.push('ui.interest_name IN (?)');
      params.push(filters.interests);
    }

    if (filters.experience) {
      conditions.push('u.experience_level = ?');
      params.push(filters.experience);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += ' GROUP BY u.id ORDER BY u.name';

    const [rows] = await db.execute(query, params);
    return rows.map(row => ({
      ...row,
      skills: row.skills ? row.skills.split(',') : [],
      interests: row.interests ? row.interests.split(',') : []
    }));
  }

  static async getRandomUsers(limit = 10, excludeUserId) {
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.avatar, u.experience_level,
       GROUP_CONCAT(DISTINCT us.skill_name) as skills
       FROM users u
       LEFT JOIN user_skills us ON u.id = us.user_id
       WHERE u.id != ?
       GROUP BY u.id
       ORDER BY RAND()
       LIMIT ?`,
      [excludeUserId, limit]
    );

    return rows.map(row => ({
      ...row,
      skills: row.skills ? row.skills.split(',') : []
    }));
  }
}

export default router;