import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_FILE = join(__dirname, 'db.json');

// Estrutura inicial do banco de dados
const initialDb = {
  servicos: [],
  acoes: [],
  reunioes: [],
  nextId: {
    servicos: 1,
    acoes: 1,
    reunioes: 1
  }
};

// Carregar ou criar banco de dados
let db = initialDb;

if (fs.existsSync(DB_FILE)) {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(data);
    console.log('✅ Banco de dados carregado com sucesso!');
  } catch (error) {
    console.error('⚠️  Erro ao carregar banco de dados, criando novo...');
    db = initialDb;
  }
} else {
  console.log('📝 Criando novo banco de dados...');
  saveDb();
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao salvar banco de dados:', error);
  }
}

// API do banco de dados
const database = {
  // Serviços
  servicos: {
    getAll: () => db.servicos.sort((a, b) => a.numero - b.numero),

    getById: (id) => db.servicos.find(s => s.id === parseInt(id)),

    create: (data) => {
      const id = db.nextId.servicos++;
      const servico = {
        id,
        numero: parseInt(data.numero),
        nome: data.nome,
        supervisor: data.supervisor || null,
        coordenador: data.coordenador || null,
        created_at: new Date().toISOString()
      };
      db.servicos.push(servico);
      saveDb();
      return servico;
    },

    update: (id, data) => {
      const index = db.servicos.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;

      db.servicos[index] = {
        ...db.servicos[index],
        numero: parseInt(data.numero),
        nome: data.nome,
        supervisor: data.supervisor || null,
        coordenador: data.coordenador || null
      };
      saveDb();
      return db.servicos[index];
    },

    delete: (id) => {
      const index = db.servicos.findIndex(s => s.id === parseInt(id));
      if (index === -1) return false;

      // Remover ações e reuniões relacionadas
      db.acoes = db.acoes.filter(a => a.servico_id !== parseInt(id));
      db.reunioes = db.reunioes.filter(r => r.servico_id !== parseInt(id));
      db.servicos.splice(index, 1);
      saveDb();
      return true;
    }
  },

  // Ações
  acoes: {
    getAll: (filters = {}) => {
      let acoes = db.acoes;

      if (filters.servico_id) {
        acoes = acoes.filter(a => a.servico_id === parseInt(filters.servico_id));
      }

      if (filters.mes) {
        acoes = acoes.filter(a => a.mes === filters.mes);
      }

      // Adicionar informações do serviço
      return acoes.map(acao => {
        const servico = db.servicos.find(s => s.id === acao.servico_id);
        return {
          ...acao,
          servico_nome: servico?.nome || '',
          servico_numero: servico?.numero || 0
        };
      });
    },

    getByServico: (servicoId) => {
      const acoes = db.acoes.filter(a => a.servico_id === parseInt(servicoId));
      const servico = db.servicos.find(s => s.id === parseInt(servicoId));

      return acoes.map(acao => ({
        ...acao,
        servico_nome: servico?.nome || ''
      }));
    },

    create: (data) => {
      const id = db.nextId.acoes++;
      const acao = {
        id,
        servico_id: parseInt(data.servico_id),
        mes: data.mes,
        descricao: data.descricao,  // What (O quê)
        motivo: data.motivo || '',  // Why (Por quê)
        local: data.local || '',    // Where (Onde)
        data_prevista: data.data_prevista || '',  // When (Quando)
        responsavel: data.responsavel || '',  // Who (Quem)
        metodo: data.metodo || '',  // How (Como)
        custo: data.custo || '',    // How much (Quanto)
        status: data.status || 'pendente',
        created_at: new Date().toISOString()
      };
      db.acoes.push(acao);
      saveDb();
      return acao;
    },

    update: (id, data) => {
      const index = db.acoes.findIndex(a => a.id === parseInt(id));
      if (index === -1) return null;

      db.acoes[index] = {
        ...db.acoes[index],
        servico_id: parseInt(data.servico_id),
        mes: data.mes,
        descricao: data.descricao,
        motivo: data.motivo || '',
        local: data.local || '',
        data_prevista: data.data_prevista || '',
        responsavel: data.responsavel || '',
        metodo: data.metodo || '',
        custo: data.custo || '',
        status: data.status
      };
      saveDb();
      return db.acoes[index];
    },

    delete: (id) => {
      const index = db.acoes.findIndex(a => a.id === parseInt(id));
      if (index === -1) return false;

      db.acoes.splice(index, 1);
      saveDb();
      return true;
    }
  },

  // Reuniões
  reunioes: {
    getAll: (filters = {}) => {
      let reunioes = db.reunioes;

      if (filters.servico_id) {
        reunioes = reunioes.filter(r => r.servico_id === parseInt(filters.servico_id));
      }

      if (filters.mes) {
        reunioes = reunioes.filter(r => r.mes === filters.mes);
      }

      // Adicionar informações do serviço
      return reunioes.map(reuniao => {
        const servico = db.servicos.find(s => s.id === reuniao.servico_id);
        return {
          ...reuniao,
          servico_nome: servico?.nome || '',
          servico_numero: servico?.numero || 0
        };
      }).sort((a, b) => new Date(b.data) - new Date(a.data));
    },

    getByServico: (servicoId) => {
      const reunioes = db.reunioes.filter(r => r.servico_id === parseInt(servicoId));
      const servico = db.servicos.find(s => s.id === parseInt(servicoId));

      return reunioes.map(reuniao => ({
        ...reuniao,
        servico_nome: servico?.nome || ''
      })).sort((a, b) => new Date(b.data) - new Date(a.data));
    },

    create: (data) => {
      const id = db.nextId.reunioes++;
      const reuniao = {
        id,
        servico_id: parseInt(data.servico_id),
        data: data.data,
        mes: data.mes,
        resumo: data.resumo || '',
        participantes: data.participantes || '',
        decisoes: data.decisoes || '',
        created_at: new Date().toISOString()
      };
      db.reunioes.push(reuniao);
      saveDb();
      return reuniao;
    },

    update: (id, data) => {
      const index = db.reunioes.findIndex(r => r.id === parseInt(id));
      if (index === -1) return null;

      db.reunioes[index] = {
        ...db.reunioes[index],
        servico_id: parseInt(data.servico_id),
        data: data.data,
        mes: data.mes,
        resumo: data.resumo || '',
        participantes: data.participantes || '',
        decisoes: data.decisoes || ''
      };
      saveDb();
      return db.reunioes[index];
    },

    delete: (id) => {
      const index = db.reunioes.findIndex(r => r.id === parseInt(id));
      if (index === -1) return false;

      db.reunioes.splice(index, 1);
      saveDb();
      return true;
    }
  },

  // Stats
  getStats: () => {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const acoesPorMes = meses.map(mes => {
      const acoesDoMes = db.acoes.filter(a => a.mes === mes);
      return {
        mes,
        total: acoesDoMes.length,
        concluidas: acoesDoMes.filter(a => a.status === 'concluida').length,
        pendentes: acoesDoMes.filter(a => a.status === 'pendente').length
      };
    });

    const servicosTop = db.servicos.map(servico => {
      const acoesServico = db.acoes.filter(a => a.servico_id === servico.id);
      return {
        nome: servico.nome,
        supervisor: servico.supervisor,
        coordenador: servico.coordenador,
        total_acoes: acoesServico.length
      };
    }).sort((a, b) => b.total_acoes - a.total_acoes);

    return {
      stats: {
        totalServicos: db.servicos.length,
        totalAcoes: db.acoes.length,
        acoesPendentes: db.acoes.filter(a => a.status === 'pendente').length,
        acoesConcluidas: db.acoes.filter(a => a.status === 'concluida').length,
        totalReunioes: db.reunioes.length
      },
      acoesPorMes,
      servicosTop
    };
  }
};

export default database;
