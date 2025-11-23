import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/auth.js';
import userRoutes from './Routes/users.js';
import companyRoutes from './Routes/companies.js';
import jobRoutes from './Routes/jobs.js';
import applicationRoutes from './Routes/applications.js';
import testRoutes from './Routes/tests.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: [
    "http://localhost:4176",
    "http://localhost:3000", 
    "http://172.22.5.104:4176",
    "http://10.1.0.18:4176", 
    "http://teamfinder.anima.edu.uy",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/tests', testRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

const teamRoutes = require('./routes/teamRoutes');
app.use('/api', teamRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Team Finder API funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Team Finder API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      companies: '/api/companies',
      jobs: '/api/jobs',
      applications: '/api/applications'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Ruta no encontrada' 
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Error interno del servidor' 
  });
});

app.listen(PORT, '0.0.0.0', () => { 
  console.log(`🚀 Servidor Team Finder en http://localhost:${PORT}`);
});
