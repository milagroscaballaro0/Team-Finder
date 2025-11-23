import express from 'express';
import { createCompany, getCompanies, getCompanyById, updateCompany } from '../Controllers/companyController.js';

const router = express.Router();

router.post('/', createCompany);
router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompany);

export default router;
