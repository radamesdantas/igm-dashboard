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
  metas: [],
  submetas: [],
  atualizacoesMetas: [],
  nextId: {
    servicos: 1,
    acoes: 1,
    reunioes: 1,
    metas: 1,
    submetas: 1,
    atualizacoesMetas: 1
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

  // Metas 2026
  metas: {
    getAll: (filters = {}) => {
      let metas = db.metas;

      if (filters.categoria) {
        metas = metas.filter(m => m.categoria === filters.categoria);
      }

      if (filters.status) {
        metas = metas.filter(m => m.status === filters.status);
      }

      if (filters.ano) {
        metas = metas.filter(m => m.ano === parseInt(filters.ano));
      }

      return metas.map(meta => {
        const submetas = db.submetas.filter(s => s.meta_id === meta.id);
        const totalSubmetas = submetas.length;
        const submetasConcluidas = submetas.filter(s => s.concluida).length;

        return {
          ...meta,
          totalSubmetas,
          submetasConcluidas,
          percentualSubmetas: totalSubmetas > 0 ? Math.round((submetasConcluidas / totalSubmetas) * 100) : 0
        };
      }).sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
    },

    getById: (id) => {
      const meta = db.metas.find(m => m.id === parseInt(id));
      if (!meta) return null;

      const submetas = db.submetas.filter(s => s.meta_id === parseInt(id));
      const atualizacoes = db.atualizacoesMetas
        .filter(a => a.meta_id === parseInt(id))
        .sort((a, b) => new Date(b.data) - new Date(a.data));

      return {
        ...meta,
        submetas,
        atualizacoes
      };
    },

    create: (data) => {
      const id = db.nextId.metas++;
      const meta = {
        id,
        titulo: data.titulo,
        descricao: data.descricao || '',
        categoria: data.categoria,
        ano: parseInt(data.ano) || 2026,
        prazo: data.prazo,
        responsaveis: data.responsaveis || '',
        metaNumerica: data.metaNumerica ? parseFloat(data.metaNumerica) : null,
        valorAtual: data.valorAtual ? parseFloat(data.valorAtual) : 0,
        unidade: data.unidade || '',
        status: data.status || 'nao_iniciada',
        percentualConclusao: data.percentualConclusao || 0,
        prioridade: data.prioridade || 'media',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.metas.push(meta);
      saveDb();
      return meta;
    },

    update: (id, data) => {
      const index = db.metas.findIndex(m => m.id === parseInt(id));
      if (index === -1) return null;

      db.metas[index] = {
        ...db.metas[index],
        titulo: data.titulo,
        descricao: data.descricao || '',
        categoria: data.categoria,
        ano: parseInt(data.ano) || 2026,
        prazo: data.prazo,
        responsaveis: data.responsaveis || '',
        metaNumerica: data.metaNumerica ? parseFloat(data.metaNumerica) : null,
        valorAtual: data.valorAtual !== undefined ? parseFloat(data.valorAtual) : db.metas[index].valorAtual,
        unidade: data.unidade || '',
        status: data.status || db.metas[index].status,
        percentualConclusao: data.percentualConclusao !== undefined ? data.percentualConclusao : db.metas[index].percentualConclusao,
        prioridade: data.prioridade || db.metas[index].prioridade,
        updated_at: new Date().toISOString()
      };
      saveDb();
      return db.metas[index];
    },

    updateProgresso: (id, valorAtual, percentual, observacao = '') => {
      const index = db.metas.findIndex(m => m.id === parseInt(id));
      if (index === -1) return null;

      db.metas[index].valorAtual = parseFloat(valorAtual);
      db.metas[index].percentualConclusao = parseInt(percentual);
      db.metas[index].updated_at = new Date().toISOString();

      // Atualizar status baseado no percentual
      if (percentual === 0) {
        db.metas[index].status = 'nao_iniciada';
      } else if (percentual < 100) {
        db.metas[index].status = 'em_andamento';
      } else {
        db.metas[index].status = 'concluida';
      }

      // Registrar atualização
      const atualizacao = {
        id: db.nextId.atualizacoesMetas++,
        meta_id: parseInt(id),
        data: new Date().toISOString(),
        valorAnterior: db.metas[index].valorAtual,
        valorNovo: parseFloat(valorAtual),
        percentualAnterior: db.metas[index].percentualConclusao,
        percentualNovo: parseInt(percentual),
        observacao: observacao,
        created_at: new Date().toISOString()
      };
      db.atualizacoesMetas.push(atualizacao);

      saveDb();
      return db.metas[index];
    },

    delete: (id) => {
      const index = db.metas.findIndex(m => m.id === parseInt(id));
      if (index === -1) return false;

      // Remover submetas e atualizações relacionadas
      db.submetas = db.submetas.filter(s => s.meta_id !== parseInt(id));
      db.atualizacoesMetas = db.atualizacoesMetas.filter(a => a.meta_id !== parseInt(id));
      db.metas.splice(index, 1);
      saveDb();
      return true;
    }
  },

  // Submetas
  submetas: {
    getByMeta: (metaId) => {
      return db.submetas
        .filter(s => s.meta_id === parseInt(metaId))
        .sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
    },

    create: (data) => {
      const id = db.nextId.submetas++;
      const submeta = {
        id,
        meta_id: parseInt(data.meta_id),
        titulo: data.titulo,
        descricao: data.descricao || '',
        prazo: data.prazo,
        concluida: data.concluida || false,
        dataConclusao: data.dataConclusao || null,
        created_at: new Date().toISOString()
      };
      db.submetas.push(submeta);
      saveDb();
      return submeta;
    },

    update: (id, data) => {
      const index = db.submetas.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;

      db.submetas[index] = {
        ...db.submetas[index],
        titulo: data.titulo,
        descricao: data.descricao || '',
        prazo: data.prazo,
        concluida: data.concluida !== undefined ? data.concluida : db.submetas[index].concluida,
        dataConclusao: data.concluida ? new Date().toISOString() : null
      };
      saveDb();
      return db.submetas[index];
    },

    toggleConcluida: (id) => {
      const index = db.submetas.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;

      db.submetas[index].concluida = !db.submetas[index].concluida;
      db.submetas[index].dataConclusao = db.submetas[index].concluida ? new Date().toISOString() : null;
      saveDb();
      return db.submetas[index];
    },

    delete: (id) => {
      const index = db.submetas.findIndex(s => s.id === parseInt(id));
      if (index === -1) return false;

      db.submetas.splice(index, 1);
      saveDb();
      return true;
    }
  },

  // Atualizações de Metas
  atualizacoesMetas: {
    getByMeta: (metaId) => {
      return db.atualizacoesMetas
        .filter(a => a.meta_id === parseInt(metaId))
        .sort((a, b) => new Date(b.data) - new Date(a.data));
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

    // Estatísticas de Metas 2026
    const categoriasMetas = [
      'Igreja Geral',
      'Valentes de Davi',
      'Serviços',
      'Presbíteros',
      'Evangelização',
      'Jovens',
      'Crianças',
      'Música',
      'Outros'
    ];

    const metasPorCategoria = categoriasMetas.map(categoria => {
      const metasCategoria = db.metas.filter(m => m.categoria === categoria);
      const totalMetas = metasCategoria.length;
      const metasConcluidas = metasCategoria.filter(m => m.status === 'concluida').length;
      const metasEmAndamento = metasCategoria.filter(m => m.status === 'em_andamento').length;

      return {
        categoria,
        total: totalMetas,
        concluidas: metasConcluidas,
        emAndamento: metasEmAndamento,
        naoIniciadas: totalMetas - metasConcluidas - metasEmAndamento,
        percentualConclusao: totalMetas > 0 ? Math.round((metasConcluidas / totalMetas) * 100) : 0
      };
    }).filter(c => c.total > 0);

    return {
      stats: {
        totalServicos: db.servicos.length,
        totalAcoes: db.acoes.length,
        acoesPendentes: db.acoes.filter(a => a.status === 'pendente').length,
        acoesConcluidas: db.acoes.filter(a => a.status === 'concluida').length,
        totalReunioes: db.reunioes.length,
        totalMetas: db.metas.length,
        metasConcluidas: db.metas.filter(m => m.status === 'concluida').length,
        metasEmAndamento: db.metas.filter(m => m.status === 'em_andamento').length,
        metasNaoIniciadas: db.metas.filter(m => m.status === 'nao_iniciada').length
      },
      acoesPorMes,
      servicosTop,
      metasPorCategoria
    };
  },

  // Função helper para obter estatísticas detalhadas de metas
  getMetasStats: (ano = 2026) => {
    const metasAno = db.metas.filter(m => m.ano === ano);

    const categorias = [
      'Igreja Geral',
      'Valentes de Davi',
      'Serviços',
      'Presbíteros',
      'Evangelização',
      'Jovens',
      'Crianças',
      'Música',
      'Outros'
    ];

    const estatisticasPorCategoria = categorias.map(categoria => {
      const metasCategoria = metasAno.filter(m => m.categoria === categoria);
      const totalMetas = metasCategoria.length;

      if (totalMetas === 0) return null;

      const concluidas = metasCategoria.filter(m => m.status === 'concluida').length;
      const emAndamento = metasCategoria.filter(m => m.status === 'em_andamento').length;
      const naoIniciadas = metasCategoria.filter(m => m.status === 'nao_iniciada').length;

      // Calcular progresso médio
      const progressoMedio = metasCategoria.reduce((acc, m) => acc + m.percentualConclusao, 0) / totalMetas;

      return {
        categoria,
        total: totalMetas,
        concluidas,
        emAndamento,
        naoIniciadas,
        percentualConclusao: Math.round((concluidas / totalMetas) * 100),
        progressoMedio: Math.round(progressoMedio),
        metas: metasCategoria.map(m => {
          const submetas = db.submetas.filter(s => s.meta_id === m.id);
          return {
            id: m.id,
            titulo: m.titulo,
            prazo: m.prazo,
            status: m.status,
            percentualConclusao: m.percentualConclusao,
            responsaveis: m.responsaveis,
            totalSubmetas: submetas.length,
            submetasConcluidas: submetas.filter(s => s.concluida).length
          };
        })
      };
    }).filter(c => c !== null);

    return {
      ano,
      totalGeral: metasAno.length,
      concluidasGeral: metasAno.filter(m => m.status === 'concluida').length,
      emAndamentoGeral: metasAno.filter(m => m.status === 'em_andamento').length,
      naoIniciadasGeral: metasAno.filter(m => m.status === 'nao_iniciada').length,
      progressoGeralMedio: metasAno.length > 0
        ? Math.round(metasAno.reduce((acc, m) => acc + m.percentualConclusao, 0) / metasAno.length)
        : 0,
      categorias: estatisticasPorCategoria
    };
  }
};

export default database;
