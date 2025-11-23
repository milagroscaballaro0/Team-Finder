const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Búsqueda de usuarios
router.get('/users/search', TeamController.searchUsers);

// Formación de equipos automática
router.post('/teams/auto', TeamController.formAutoTeam);

// Creación de equipos manual
router.post('/teams/manual', TeamController.createManualTeam);

// Obtener equipos del usuario
router.get('/teams', TeamController.getUserTeams);

// Obtener detalles del equipo
router.get('/teams/:id', TeamController.getTeamDetails);

module.exports = router;
