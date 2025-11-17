import googleSheets from './google-sheets.js';

// Cache em memória para melhorar performance
let cache = {
  servicos: [],
  acoes: [],
  reunioes: [],
  metas: [],
  submetas: [],
  atualizacoesMetas: [],
  lastUpdate: null
};

const CACHE_DURATION = 30000; // 30 segundos

// Funções helper para gerenciar IDs
async function getNextId(tableName) {
  const data = await loadTable(tableName);
  if (data.length === 0) return 1;
  const maxId = Math.max(...data.map(item => item.id || 0));
  return maxId + 1;
}

// Carregar dados de uma tabela
async function loadTable(tableName) {
  const now = Date.now();
  if (cache[tableName] && cache.lastUpdate && (now - cache.lastUpdate) < CACHE_DURATION) {
    return cache[tableName];
  }

  const data = await googleSheets.read(tableName);
  cache[tableName] = data;
  cache.lastUpdate = now;
  return data;
}

// Salvar dados em uma tabela
async function saveTable(tableName, data) {
  await googleSheets.write(tableName, data);
  cache[tableName] = data;
  cache.lastUpdate = Date.now();
}

// Invalidar cache
function invalidateCache(tableName = null) {
  if (tableName) {
    cache[tableName] = [];
  } else {
    cache = {
      servicos: [],
      acoes: [],
      reunioes: [],
      metas: [],
      submetas: [],
      atualizacoesMetas: [],
      lastUpdate: null
    };
  }
}

// API do banco de dados
const database = {
  // Serviços
  servicos: {
    getAll: async () => {
      const servicos = await loadTable('servicos');
      return servicos.sort((a, b) => a.numero - b.numero);
    },

    getById: async (id) => {
      const servicos = await loadTable('servicos');
      return servicos.find(s => s.id === parseInt(id));
    },

    create: async (data) => {
      const servicos = await loadTable('servicos');
      const id = await getNextId('servicos');

      const servico = {
        id,
        numero: parseInt(data.numero),
        nome: data.nome,
        supervisor: data.supervisor || '',
        coordenador: data.coordenador || '',
        created_at: new Date().toISOString()
      };

      servicos.push(servico);
      await saveTable('servicos', servicos);
      return servico;
    },

    update: async (id, data) => {
      const servicos = await loadTable('servicos');
      const index = servicos.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;

      servicos[index] = {
        ...servicos[index],
        numero: parseInt(data.numero),
        nome: data.nome,
        supervisor: data.supervisor || '',
        coordenador: data.coordenador || ''
      };

      await saveTable('servicos', servicos);
      return servicos[index];
    },

    delete: async (id) => {
      const servicos = await loadTable('servicos');
      const index = servicos.findIndex(s => s.id === parseInt(id));
      if (index === -1) return false;

      // Remover ações e reuniões relacionadas
      const acoes = await loadTable('acoes');
      const reunioes = await loadTable('reunioes');

      const acoesFiltered = acoes.filter(a => a.servico_id !== parseInt(id));
      const reunioesFiltered = reunioes.filter(r => r.servico_id !== parseInt(id));

      servicos.splice(index, 1);

      await saveTable('servicos', servicos);
      await saveTable('acoes', acoesFiltered);
      await saveTable('reunioes', reunioesFiltered);

      return true;
    }
  },

  // Ações
  acoes: {
    getAll: async (filters = {}) => {
      let acoes = await loadTable('acoes');
      const servicos = await loadTable('servicos');

      if (filters.servico_id) {
        acoes = acoes.filter(a => a.servico_id === parseInt(filters.servico_id));
      }

      if (filters.mes) {
        acoes = acoes.filter(a => a.mes === filters.mes);
      }

      // Adicionar informações do serviço
      return acoes.map(acao => {
        const servico = servicos.find(s => s.id === acao.servico_id);
        return {
          ...acao,
          servico_nome: servico?.nome || '',
          servico_numero: servico?.numero || 0
        };
      });
    },

    getByServico: async (servicoId) => {
      const acoes = await loadTable('acoes');
      const servicos = await loadTable('servicos');

      const acoesFiltered = acoes.filter(a => a.servico_id === parseInt(servicoId));
      const servico = servicos.find(s => s.id === parseInt(servicoId));

      return acoesFiltered.map(acao => ({
        ...acao,
        servico_nome: servico?.nome || ''
      }));
    },

    create: async (data) => {
      const acoes = await loadTable('acoes');
      const id = await getNextId('acoes');

      const acao = {
        id,
        servico_id: parseInt(data.servico_id),
        mes: data.mes,
        descricao: data.descricao,
        motivo: data.motivo || '',
        local: data.local || '',
        data_prevista: data.data_prevista || '',
        responsavel: data.responsavel || '',
        metodo: data.metodo || '',
        custo: data.custo || '',
        status: data.status || 'pendente',
        created_at: new Date().toISOString()
      };

      acoes.push(acao);
      await saveTable('acoes', acoes);
      return acao;
    },

    update: async (id, data) => {
      const acoes = await loadTable('acoes');
      const index = acoes.findIndex(a => a.id === parseInt(id));
      if (index === -1) return null;

      acoes[index] = {
        ...acoes[index],
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

      await saveTable('acoes', acoes);
      return acoes[index];
    },

    delete: async (id) => {
      const acoes = await loadTable('acoes');
      const index = acoes.findIndex(a => a.id === parseInt(id));
      if (index === -1) return false;

      acoes.splice(index, 1);
      await saveTable('acoes', acoes);
      return true;
    }
  },

  // Reuniões
  reunioes: {
    getAll: async (filters = {}) => {
      let reunioes = await loadTable('reunioes');
      const servicos = await loadTable('servicos');

      if (filters.servico_id) {
        reunioes = reunioes.filter(r => r.servico_id === parseInt(filters.servico_id));
      }

      if (filters.mes) {
        reunioes = reunioes.filter(r => r.mes === filters.mes);
      }

      // Adicionar informações do serviço
      return reunioes.map(reuniao => {
        const servico = servicos.find(s => s.id === reuniao.servico_id);
        return {
          ...reuniao,
          servico_nome: servico?.nome || '',
          servico_numero: servico?.numero || 0
        };
      }).sort((a, b) => new Date(b.data) - new Date(a.data));
    },

    getByServico: async (servicoId) => {
      const reunioes = await loadTable('reunioes');
      const servicos = await loadTable('servicos');

      const reunioesFiltered = reunioes.filter(r => r.servico_id === parseInt(servicoId));
      const servico = servicos.find(s => s.id === parseInt(servicoId));

      return reunioesFiltered.map(reuniao => ({
        ...reuniao,
        servico_nome: servico?.nome || ''
      })).sort((a, b) => new Date(b.data) - new Date(a.data));
    },

    create: async (data) => {
      const reunioes = await loadTable('reunioes');
      const id = await getNextId('reunioes');

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

      reunioes.push(reuniao);
      await saveTable('reunioes', reunioes);
      return reuniao;
    },

    update: async (id, data) => {
      const reunioes = await loadTable('reunioes');
      const index = reunioes.findIndex(r => r.id === parseInt(id));
      if (index === -1) return null;

      reunioes[index] = {
        ...reunioes[index],
        servico_id: parseInt(data.servico_id),
        data: data.data,
        mes: data.mes,
        resumo: data.resumo || '',
        participantes: data.participantes || '',
        decisoes: data.decisoes || ''
      };

      await saveTable('reunioes', reunioes);
      return reunioes[index];
    },

    delete: async (id) => {
      const reunioes = await loadTable('reunioes');
      const index = reunioes.findIndex(r => r.id === parseInt(id));
      if (index === -1) return false;

      reunioes.splice(index, 1);
      await saveTable('reunioes', reunioes);
      return true;
    }
  },

  // Metas 2026
  metas: {
    getAll: async (filters = {}) => {
      let metas = await loadTable('metas');
      const submetas = await loadTable('submetas');

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
        const submetasMeta = submetas.filter(s => s.meta_id === meta.id);
        const totalSubmetas = submetasMeta.length;
        const submetasConcluidas = submetasMeta.filter(s => s.concluida === true || s.concluida === 'true').length;

        return {
          ...meta,
          totalSubmetas,
          submetasConcluidas,
          percentualSubmetas: totalSubmetas > 0 ? Math.round((submetasConcluidas / totalSubmetas) * 100) : 0
        };
      }).sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
    },

    getById: async (id) => {
      const metas = await loadTable('metas');
      const submetas = await loadTable('submetas');
      const atualizacoesMetas = await loadTable('atualizacoesMetas');

      const meta = metas.find(m => m.id === parseInt(id));
      if (!meta) return null;

      const submetasMeta = submetas.filter(s => s.meta_id === parseInt(id));
      const atualizacoes = atualizacoesMetas
        .filter(a => a.meta_id === parseInt(id))
        .sort((a, b) => new Date(b.data) - new Date(a.data));

      return {
        ...meta,
        submetas: submetasMeta,
        atualizacoes
      };
    },

    create: async (data) => {
      const metas = await loadTable('metas');
      const id = await getNextId('metas');

      const meta = {
        id,
        titulo: data.titulo,
        descricao: data.descricao || '',
        categoria: data.categoria,
        ano: parseInt(data.ano) || 2026,
        prazo: data.prazo,
        responsaveis: data.responsaveis || '',
        metaNumerica: data.metaNumerica ? parseFloat(data.metaNumerica) : 0,
        valorAtual: data.valorAtual ? parseFloat(data.valorAtual) : 0,
        unidade: data.unidade || '',
        status: data.status || 'nao_iniciada',
        percentualConclusao: data.percentualConclusao || 0,
        prioridade: data.prioridade || 'media',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      metas.push(meta);
      await saveTable('metas', metas);
      return meta;
    },

    update: async (id, data) => {
      const metas = await loadTable('metas');
      const index = metas.findIndex(m => m.id === parseInt(id));
      if (index === -1) return null;

      metas[index] = {
        ...metas[index],
        titulo: data.titulo,
        descricao: data.descricao || '',
        categoria: data.categoria,
        ano: parseInt(data.ano) || 2026,
        prazo: data.prazo,
        responsaveis: data.responsaveis || '',
        metaNumerica: data.metaNumerica ? parseFloat(data.metaNumerica) : 0,
        valorAtual: data.valorAtual !== undefined ? parseFloat(data.valorAtual) : metas[index].valorAtual,
        unidade: data.unidade || '',
        status: data.status || metas[index].status,
        percentualConclusao: data.percentualConclusao !== undefined ? data.percentualConclusao : metas[index].percentualConclusao,
        prioridade: data.prioridade || metas[index].prioridade,
        updated_at: new Date().toISOString()
      };

      await saveTable('metas', metas);
      return metas[index];
    },

    updateProgresso: async (id, valorAtual, percentual, observacao = '') => {
      const metas = await loadTable('metas');
      const atualizacoesMetas = await loadTable('atualizacoesMetas');

      const index = metas.findIndex(m => m.id === parseInt(id));
      if (index === -1) return null;

      const valorAnterior = metas[index].valorAtual;
      const percentualAnterior = metas[index].percentualConclusao;

      metas[index].valorAtual = parseFloat(valorAtual);
      metas[index].percentualConclusao = parseInt(percentual);
      metas[index].updated_at = new Date().toISOString();

      // Atualizar status baseado no percentual
      if (percentual === 0 || percentual === '0') {
        metas[index].status = 'nao_iniciada';
      } else if (percentual < 100) {
        metas[index].status = 'em_andamento';
      } else {
        metas[index].status = 'concluida';
      }

      // Registrar atualização
      const atualizacaoId = await getNextId('atualizacoesMetas');
      const atualizacao = {
        id: atualizacaoId,
        meta_id: parseInt(id),
        data: new Date().toISOString(),
        valorAnterior: parseFloat(valorAnterior),
        valorNovo: parseFloat(valorAtual),
        percentualAnterior: parseInt(percentualAnterior),
        percentualNovo: parseInt(percentual),
        observacao: observacao,
        created_at: new Date().toISOString()
      };

      atualizacoesMetas.push(atualizacao);

      await saveTable('metas', metas);
      await saveTable('atualizacoesMetas', atualizacoesMetas);

      return metas[index];
    },

    delete: async (id) => {
      const metas = await loadTable('metas');
      const submetas = await loadTable('submetas');
      const atualizacoesMetas = await loadTable('atualizacoesMetas');

      const index = metas.findIndex(m => m.id === parseInt(id));
      if (index === -1) return false;

      // Remover submetas e atualizações relacionadas
      const submetasFiltered = submetas.filter(s => s.meta_id !== parseInt(id));
      const atualizacoesFiltered = atualizacoesMetas.filter(a => a.meta_id !== parseInt(id));

      metas.splice(index, 1);

      await saveTable('metas', metas);
      await saveTable('submetas', submetasFiltered);
      await saveTable('atualizacoesMetas', atualizacoesFiltered);

      return true;
    }
  },

  // Submetas
  submetas: {
    getByMeta: async (metaId) => {
      const submetas = await loadTable('submetas');
      return submetas
        .filter(s => s.meta_id === parseInt(metaId))
        .sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
    },

    create: async (data) => {
      const submetas = await loadTable('submetas');
      const id = await getNextId('submetas');

      const submeta = {
        id,
        meta_id: parseInt(data.meta_id),
        titulo: data.titulo,
        descricao: data.descricao || '',
        prazo: data.prazo,
        concluida: data.concluida || false,
        dataConclusao: data.dataConclusao || '',
        created_at: new Date().toISOString()
      };

      submetas.push(submeta);
      await saveTable('submetas', submetas);
      return submeta;
    },

    update: async (id, data) => {
      const submetas = await loadTable('submetas');
      const index = submetas.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;

      submetas[index] = {
        ...submetas[index],
        titulo: data.titulo,
        descricao: data.descricao || '',
        prazo: data.prazo,
        concluida: data.concluida !== undefined ? data.concluida : submetas[index].concluida,
        dataConclusao: data.concluida ? new Date().toISOString() : ''
      };

      await saveTable('submetas', submetas);
      return submetas[index];
    },

    toggleConcluida: async (id) => {
      const submetas = await loadTable('submetas');
      const index = submetas.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;

      const concluida = submetas[index].concluida === true || submetas[index].concluida === 'true';
      submetas[index].concluida = !concluida;
      submetas[index].dataConclusao = !concluida ? new Date().toISOString() : '';

      await saveTable('submetas', submetas);
      return submetas[index];
    },

    delete: async (id) => {
      const submetas = await loadTable('submetas');
      const index = submetas.findIndex(s => s.id === parseInt(id));
      if (index === -1) return false;

      submetas.splice(index, 1);
      await saveTable('submetas', submetas);
      return true;
    }
  },

  // Atualizações de Metas
  atualizacoesMetas: {
    getByMeta: async (metaId) => {
      const atualizacoesMetas = await loadTable('atualizacoesMetas');
      return atualizacoesMetas
        .filter(a => a.meta_id === parseInt(metaId))
        .sort((a, b) => new Date(b.data) - new Date(a.data));
    }
  },

  // Stats
  getStats: async () => {
    const servicos = await loadTable('servicos');
    const acoes = await loadTable('acoes');
    const reunioes = await loadTable('reunioes');
    const metas = await loadTable('metas');

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const acoesPorMes = meses.map(mes => {
      const acoesDoMes = acoes.filter(a => a.mes === mes);
      return {
        mes,
        total: acoesDoMes.length,
        concluidas: acoesDoMes.filter(a => a.status === 'concluida').length,
        pendentes: acoesDoMes.filter(a => a.status === 'pendente').length
      };
    });

    const servicosTop = servicos.map(servico => {
      const acoesServico = acoes.filter(a => a.servico_id === servico.id);
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
      const metasCategoria = metas.filter(m => m.categoria === categoria);
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
        totalServicos: servicos.length,
        totalAcoes: acoes.length,
        acoesPendentes: acoes.filter(a => a.status === 'pendente').length,
        acoesConcluidas: acoes.filter(a => a.status === 'concluida').length,
        totalReunioes: reunioes.length,
        totalMetas: metas.length,
        metasConcluidas: metas.filter(m => m.status === 'concluida').length,
        metasEmAndamento: metas.filter(m => m.status === 'em_andamento').length,
        metasNaoIniciadas: metas.filter(m => m.status === 'nao_iniciada').length
      },
      acoesPorMes,
      servicosTop,
      metasPorCategoria
    };
  },

  // Função helper para obter estatísticas detalhadas de metas
  getMetasStats: async (ano = 2026) => {
    const metas = await loadTable('metas');
    const submetas = await loadTable('submetas');

    const metasAno = metas.filter(m => m.ano === parseInt(ano));

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
      const progressoMedio = metasCategoria.reduce((acc, m) => acc + (parseFloat(m.percentualConclusao) || 0), 0) / totalMetas;

      return {
        categoria,
        total: totalMetas,
        concluidas,
        emAndamento,
        naoIniciadas,
        percentualConclusao: Math.round((concluidas / totalMetas) * 100),
        progressoMedio: Math.round(progressoMedio),
        metas: metasCategoria.map(m => {
          const submetasMeta = submetas.filter(s => s.meta_id === m.id);
          return {
            id: m.id,
            titulo: m.titulo,
            prazo: m.prazo,
            status: m.status,
            percentualConclusao: m.percentualConclusao,
            responsaveis: m.responsaveis,
            totalSubmetas: submetasMeta.length,
            submetasConcluidas: submetasMeta.filter(s => s.concluida === true || s.concluida === 'true').length
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
        ? Math.round(metasAno.reduce((acc, m) => acc + (parseFloat(m.percentualConclusao) || 0), 0) / metasAno.length)
        : 0,
      categorias: estatisticasPorCategoria
    };
  },

  // Inicializar Google Sheets
  init: async () => {
    await googleSheets.setupSheets();
    console.log('✅ Google Sheets Database inicializado!');
  }
};

export default database;
