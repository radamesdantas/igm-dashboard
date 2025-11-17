// Vercel Serverless Function
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from '../backend/routes/auth.js';
import servicosRouter from '../backend/routes/servicos.js';
import acoesRouter from '../backend/routes/acoes.js';
import reunioesRouter from '../backend/routes/reunioes.js';
import metasRouter from '../backend/routes/metas.js';

// Carregar variáveis de ambiente
dotenv.config();

// Escolher banco de dados
const useGoogleSheets = process.env.USE_GOOGLE_SHEETS === 'true';
let db;

// Função assíncrona para inicializar o banco
async function initDB() {
  if (useGoogleSheets) {
    console.log('📊 Usando Google Sheets como banco de dados');
    const dbSheets = await import('../backend/database-sheets.js');
    db = dbSheets.default;
    await db.init();
  } else {
    console.log('📁 Usando db.json como banco de dados');
    const dbJson = await import('../backend/database.js');
    db = dbJson.default;
  }
  return db;
}

const app = express();

// Middlewares
const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Inicializar DB na primeira requisição (ANTES das rotas)
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDB();
      dbInitialized = true;
      console.log('✅ Banco de dados inicializado!');
    } catch (error) {
      console.error('❌ Erro ao inicializar DB:', error);
    }
  }
  next();
});

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/servicos', servicosRouter);
app.use('/api/acoes', acoesRouter);
app.use('/api/reunioes', reunioesRouter);
app.use('/api/metas', metasRouter);

// Rota de dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    const dashboardData = await db.getStats();
    res.json(dashboardData);
  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota raiz
app.get('/api', (req, res) => {
  res.json({
    message: 'API do Sistema de Gerenciamento de Serviços - Igreja em Mossoró',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      dashboard: '/api/dashboard',
      servicos: '/api/servicos',
      acoes: '/api/acoes',
      reunioes: '/api/reunioes',
      metas: '/api/metas',
      metasStats: '/api/metas/stats/:ano'
    }
  });
});

export default app;
