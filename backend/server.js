import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import servicosRouter from './routes/servicos.js';
import acoesRouter from './routes/acoes.js';
import reunioesRouter from './routes/reunioes.js';
import metasRouter from './routes/metas.js';

// Carregar variáveis de ambiente
dotenv.config();

// Escolher banco de dados baseado na variável de ambiente
const useGoogleSheets = process.env.USE_GOOGLE_SHEETS === 'true';
let db;

if (useGoogleSheets) {
  console.log('📊 Usando Google Sheets como banco de dados');
  const dbSheets = await import('./database-sheets.js');
  db = dbSheets.default;
  // Inicializar Google Sheets
  await db.init();
} else {
  console.log('📁 Usando db.json como banco de dados');
  const dbJson = await import('./database.js');
  db = dbJson.default;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
// Configuração de CORS para permitir acesso do frontend em produção
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://igm-dashboard.netlify.app',
        /\.netlify\.app$/,  // Permite qualquer subdomínio do Netlify
        'http://localhost:3000',  // Para testes locais
      ]
    : '*',  // Em desenvolvimento, permite qualquer origem
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/servicos', servicosRouter);
app.use('/api/acoes', acoesRouter);
app.use('/api/reunioes', reunioesRouter);
app.use('/api/metas', metasRouter);

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
        reunioes: '/api/reunioes',
        metas: '/api/metas',
        metasStats: '/api/metas/stats/:ano'
      }
    });
  });
}

// Iniciar servidor (apenas se não estiver em serverless)
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'serverless') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`📋 Serviços: http://localhost:${PORT}/api/servicos\n`);
  });
}

export default app;
