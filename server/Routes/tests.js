import express from 'express';
import { saveTestResults, getTestResults } from '../Controllers/testController.js';

const router = express.Router();

router.post('/save', saveTestResults);
router.get('/user/:userId', getTestResults);

export default router;
