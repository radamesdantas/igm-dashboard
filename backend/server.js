import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './database.js';
import authRouter from './routes/auth.js';
import servicosRouter from './routes/servicos.js';
import acoesRouter from './routes/acoes.js';
import reunioesRouter from './routes/reunioes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/servicos', servicosRouter);
app.use('/api/acoes', acoesRouter);
app.use('/api/reunioes', reunioesRouter);

// Rota de dashboard - estatísticas gerais
app.get('/api/dashboard', (req, res) => {
  try {
    const dashboardData = db.getStats();
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    // Se não for uma rota da API, servir o index.html
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
  });
} else {
  // Rota raiz para desenvolvimento
  app.get('/', (req, res) => {
    res.json({
      message: 'API do Sistema de Gerenciamento de Serviços - Igreja em Mossoró',
      version: '1.0.0',
      endpoints: {
        dashboard: '/api/dashboard',
        servicos: '/api/servicos',
        acoes: '/api/acoes',
        reunioes: '/api/reunioes'
      }
    });
  });
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`📋 Serviços: http://localhost:${PORT}/api/servicos\n`);
});

export default app;
