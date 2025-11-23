import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  saveTestResults,
  getUserProfile,
  getUserTestResults,
  updateUserProfile,
  deleteUserTestResults
} from '../Controllers/userController.js';

const router = express.Router();

// Rutas para usuarios
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/profile/:id', getUserProfile); // 🔥 NUEVA
router.get('/:userId/test-results', getUserTestResults); // 🔥 NUEVA
router.post('/save-test-results', saveTestResults); // 🔥 NUEVA
router.put('/:id', updateUser);
router.put('/profile/:id', updateUserProfile); // 🔥 NUEVA
router.delete('/:id', deleteUser);
router.delete('/:userId/test-results', deleteUserTestResults); // 🔥 NUEVA

export default router;
