import express from 'express';
import { createJob, getJobs, getJobById, getJobsByCompany } from '../Controllers/jobController.js';

const router = express.Router();

router.post('/', createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.get('/company/:companyId', getJobsByCompany);

export default router;

