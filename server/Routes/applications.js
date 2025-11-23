import express from 'express';
import { 
  createApplication, 
  getApplicationsByUser, 
  getApplicationsByJob, 
  updateApplicationStatus,
  getApplications  // NUEVA IMPORTACIÓN
} from '../Controllers/applicationController.js';

const router = express.Router();

// RUTA NUEVA - Obtener todas las aplicaciones
router.get('/', getApplications);

// Rutas existentes
router.post('/', createApplication);
router.get('/user/:userId', getApplicationsByUser);
router.get('/job/:jobId', getApplicationsByJob);
router.put('/:id/status', updateApplicationStatus);

export default router;
