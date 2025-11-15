import { useState, useEffect } from 'react'
import { acoesAPI, servicosAPI } from '../services/api'

export default function GerenciarAcoes() {
  const [acoes, setAcoes] = useState([])
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNovaAcao, setShowNovaAcao] = useState(false)
  const [editandoAcao, setEditandoAcao] = useState(null)

  const [filtros, setFiltros] = useState({
    servico_id: '',
    mes: '',
    status: ''
  })

  const [novaAcao, setNovaAcao] = useState({
    servico_id: '',
    mes: 'Janeiro',
    descricao: '',      // WHAT - O quê
    motivo: '',         // WHY - Por quê
    local: '',          // WHERE - Onde
    data_prevista: '',  // WHEN - Quando
    responsavel: '',    // WHO - Quem
    metodo: '',         // HOW - Como
    custo: '',          // HOW MUCH - Quanto
    status: 'pendente'
  })

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  useEffect(() => {
    loadData()
  }, [filtros])

  const loadData = async () => {
    try {
      const [acoesRes, servicosRes] = await Promise.all([
        acoesAPI.getAll(filtros),
        servicosAPI.getAll()
      ])
      setAcoes(acoesRes.data)
      setServicos(servicosRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCriarAcao = async (e) => {
    e.preventDefault()
    try {
      await acoesAPI.create(novaAcao)
      setNovaAcao({
        servico_id: '',
        mes: 'Janeiro',
        descricao: '',
        motivo: '',
        local: '',
        data_prevista: '',
        responsavel: '',
        metodo: '',
        custo: '',
        status: 'pendente'
      })
      setShowNovaAcao(false)
      loadData()
    } catch (error) {
      console.error('Erro ao criar ação:', error)
      alert('Erro ao criar ação')
    }
  }

  const handleAtualizarAcao = async (e) => {
    e.preventDefault()
    try {
      await acoesAPI.update(editandoAcao.id, editandoAcao)
      setEditandoAcao(null)
      loadData()
    } catch (error) {
      console.error('Erro ao atualizar ação:', error)
      alert('Erro ao atualizar ação')
    }
  }

  const handleDeletarAcao = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta ação?')) {
      try {
        await acoesAPI.delete(id)
        loadData()
      } catch (error) {
        console.error('Erro ao deletar ação:', error)
        alert('Erro ao deletar ação')
      }
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pendente: 'badge-pending',
      concluida: 'badge-completed',
      nao_realizada: 'badge-not-done'
    }
    const labels = {
      pendente: 'Pendente',
      concluida: 'Concluída',
      nao_realizada: 'Não Realizada'
    }
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>
  }

  const FormularioAcao = ({ acao, setAcao, onSubmit, onCancel, isEdit = false }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">📋 Informações Básicas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Serviço *</label>
            <select
              value={acao.servico_id}
              onChange={(e) => setAcao({ ...acao, servico_id: e.target.value })}
              className="input"
              required
            >
              <option value="">Selecione um serviço</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                  #{servico.numero} - {servico.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Mês *</label>
            <select
              value={acao.mes}
              onChange={(e) => setAcao({ ...acao, mes: e.target.value })}
              className="input"
              required
            >
              {meses.map(mes => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5W2H */}
      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-4">🎯 Planejamento 5W2H</h4>

        <div className="space-y-4">
          {/* WHAT - O quê */}
          <div>
            <label className="label text-blue-900">
              🔹 WHAT (O quê) - Descrição da Ação *
            </label>
            <textarea
              value={acao.descricao}
              onChange={(e) => setAcao({ ...acao, descricao: e.target.value })}
              className="input"
              rows="2"
              placeholder="O que será feito? Ex: Realizar treinamento de segurança"
              required
            />
          </div>

          {/* WHY - Por quê */}
          <div>
            <label className="label text-blue-900">
              🔹 WHY (Por quê) - Motivo/Justificativa
            </label>
            <textarea
              value={acao.motivo}
              onChange={(e) => setAcao({ ...acao, motivo: e.target.value })}
              className="input"
              rows="2"
              placeholder="Por que esta ação é necessária? Ex: Para garantir a segurança dos membros"
            />
          </div>

          {/* WHERE - Onde & WHEN - Quando */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label text-blue-900">
                🔹 WHERE (Onde) - Local
              </label>
              <input
                type="text"
                value={acao.local}
                onChange={(e) => setAcao({ ...acao, local: e.target.value })}
                className="input"
                placeholder="Ex: Salão principal, Anexo, etc."
              />
            </div>
            <div>
              <label className="label text-blue-900">
                🔹 WHEN (Quando) - Data Prevista
              </label>
              <input
                type="date"
                value={acao.data_prevista}
                onChange={(e) => setAcao({ ...acao, data_prevista: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* WHO - Quem */}
          <div>
            <label className="label text-blue-900">
              🔹 WHO (Quem) - Responsável(is)
            </label>
            <input
              type="text"
              value={acao.responsavel}
              onChange={(e) => setAcao({ ...acao, responsavel: e.target.value })}
              className="input"
              placeholder="Ex: João Silva, Maria Santos"
            />
          </div>

          {/* HOW - Como */}
          <div>
            <label className="label text-blue-900">
              🔹 HOW (Como) - Método/Procedimento
            </label>
            <textarea
              value={acao.metodo}
              onChange={(e) => setAcao({ ...acao, metodo: e.target.value })}
              className="input"
              rows="2"
              placeholder="Como será executado? Ex: Reunião com todos os membros do serviço"
            />
          </div>

          {/* HOW MUCH - Quanto */}
          <div>
            <label className="label text-blue-900">
              🔹 HOW MUCH (Quanto) - Custo Estimado
            </label>
            <input
              type="text"
              value={acao.custo}
              onChange={(e) => setAcao({ ...acao, custo: e.target.value })}
              className="input"
              placeholder="Ex: R$ 500,00 ou Sem custo"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="label">Status da Ação</label>
        <select
          value={acao.status}
          onChange={(e) => setAcao({ ...acao, status: e.target.value })}
          className="input"
        >
          <option value="pendente">Pendente</option>
          <option value="concluida">Concluída</option>
          <option value="nao_realizada">Não Realizada</option>
        </select>
      </div>

      {/* Botões */}
      <div className="flex space-x-3">
        <button type="submit" className="btn btn-success flex-1">
          {isEdit ? '💾 Salvar Alterações' : '✅ Criar Ação'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex-1"
        >
          Cancelar
        </button>
      </div>
    </form>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Ações (5W2H)</h2>
          <p className="mt-2 text-gray-600">
            Planeje e gerencie as ações usando a metodologia 5W2H
          </p>
        </div>
        <button
          onClick={() => setShowNovaAcao(!showNovaAcao)}
          className="btn btn-primary"
        >
          {showNovaAcao ? 'Cancelar' : '➕ Nova Ação'}
        </button>
      </div>

      {/* Formulário Nova Ação */}
      {showNovaAcao && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Criar Nova Ação</h3>
          <FormularioAcao
            acao={novaAcao}
            setAcao={setNovaAcao}
            onSubmit={handleCriarAcao}
            onCancel={() => setShowNovaAcao(false)}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Serviço</label>
            <select
              value={filtros.servico_id}
              onChange={(e) => setFiltros({ ...filtros, servico_id: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                  #{servico.numero} - {servico.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Mês</label>
            <select
              value={filtros.mes}
              onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              {meses.map(mes => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="concluida">Concluída</option>
              <option value="nao_realizada">Não Realizada</option>
            </select>
          </div>
        </div>
        {(filtros.servico_id || filtros.mes || filtros.status) && (
          <button
            onClick={() => setFiltros({ servico_id: '', mes: '', status: '' })}
            className="btn btn-secondary mt-4"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Lista de Ações */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          📝 Ações ({acoes.length})
        </h3>

        {acoes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900">
              Nenhuma ação encontrada
            </h3>
            <p className="text-gray-600 mt-2">
              {(filtros.servico_id || filtros.mes || filtros.status)
                ? 'Tente ajustar os filtros'
                : 'Comece adicionando uma nova ação'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {acoes.map(acao => (
              <div key={acao.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                {editandoAcao?.id === acao.id ? (
                  // Modo Edição
                  <FormularioAcao
                    acao={editandoAcao}
                    setAcao={setEditandoAcao}
                    onSubmit={handleAtualizarAcao}
                    onCancel={() => setEditandoAcao(null)}
                    isEdit={true}
                  />
                ) : (
                  // Modo Visualização
                  <div>
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-semibold text-primary-600">
                            #{acao.servico_numero} {acao.servico_nome}
                          </span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm font-medium text-gray-700">{acao.mes}</span>
                          {getStatusBadge(acao.status)}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditandoAcao(acao)}
                          className="btn btn-secondary text-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeletarAcao(acao.id)}
                          className="btn btn-danger text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* 5W2H Detalhado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs font-semibold text-gray-600 mb-1">🔹 WHAT (O quê)</p>
                        <p className="text-sm text-gray-900">{acao.descricao}</p>
                      </div>

                      {acao.motivo && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs font-semibold text-gray-600 mb-1">🔹 WHY (Por quê)</p>
                          <p className="text-sm text-gray-900">{acao.motivo}</p>
                        </div>
                      )}

                      {acao.local && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs font-semibold text-gray-600 mb-1">🔹 WHERE (Onde)</p>
                          <p className="text-sm text-gray-900">{acao.local}</p>
                        </div>
                      )}

                      {acao.data_prevista && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs font-semibold text-gray-600 mb-1">🔹 WHEN (Quando)</p>
                          <p className="text-sm text-gray-900">
                            {new Date(acao.data_prevista).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}

                      {acao.responsavel && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs font-semibold text-gray-600 mb-1">🔹 WHO (Quem)</p>
                          <p className="text-sm text-gray-900">{acao.responsavel}</p>
                        </div>
                      )}

                      {acao.metodo && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs font-semibold text-gray-600 mb-1">🔹 HOW (Como)</p>
                          <p className="text-sm text-gray-900">{acao.metodo}</p>
                        </div>
                      )}

                      {acao.custo && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs font-semibold text-gray-600 mb-1">🔹 HOW MUCH (Quanto)</p>
                          <p className="text-sm text-gray-900">{acao.custo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
