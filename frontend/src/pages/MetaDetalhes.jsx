import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { metasAPI } from '../services/api'

export default function MetaDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showProgressoModal, setShowProgressoModal] = useState(false)
  const [showSubmetaModal, setShowSubmetaModal] = useState(false)
  const [progressoForm, setProgressoForm] = useState({
    valorAtual: '',
    percentual: '',
    observacao: ''
  })
  const [submetaForm, setSubmetaForm] = useState({
    titulo: '',
    descricao: '',
    prazo: ''
  })

  useEffect(() => {
    loadMeta()
  }, [id])

  const loadMeta = async () => {
    try {
      setLoading(true)
      const response = await metasAPI.getById(id)
      setMeta(response.data)
      setProgressoForm({
        valorAtual: response.data.valorAtual || 0,
        percentual: response.data.percentualConclusao || 0,
        observacao: ''
      })
    } catch (error) {
      console.error('Erro ao carregar meta:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMeta = async () => {
    if (!confirm('Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await metasAPI.delete(id)
      alert('Meta excluída com sucesso!')
      navigate('/metas')
    } catch (error) {
      console.error('Erro ao excluir meta:', error)
      alert('Erro ao excluir meta')
    }
  }

  const handleUpdateProgresso = async (e) => {
    e.preventDefault()
    try {
      await metasAPI.updateProgresso(id, {
        valorAtual: parseFloat(progressoForm.valorAtual),
        percentual: parseInt(progressoForm.percentual),
        observacao: progressoForm.observacao
      })
      alert('Progresso atualizado com sucesso!')
      setShowProgressoModal(false)
      loadMeta()
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error)
      alert('Erro ao atualizar progresso')
    }
  }

  const handleCreateSubmeta = async (e) => {
    e.preventDefault()
    try {
      await metasAPI.createSubmeta(id, submetaForm)
      alert('Submeta criada com sucesso!')
      setShowSubmetaModal(false)
      setSubmetaForm({ titulo: '', descricao: '', prazo: '' })
      loadMeta()
    } catch (error) {
      console.error('Erro ao criar submeta:', error)
      alert('Erro ao criar submeta')
    }
  }

  const handleToggleSubmeta = async (submetaId) => {
    try {
      await metasAPI.toggleSubmeta(id, submetaId)
      loadMeta()
    } catch (error) {
      console.error('Erro ao atualizar submeta:', error)
      alert('Erro ao atualizar submeta')
    }
  }

  const handleDeleteSubmeta = async (submetaId) => {
    if (!confirm('Tem certeza que deseja excluir esta submeta?')) {
      return
    }

    try {
      await metasAPI.deleteSubmeta(id, submetaId)
      loadMeta()
    } catch (error) {
      console.error('Erro ao excluir submeta:', error)
      alert('Erro ao excluir submeta')
    }
  }

  const getStatusColor = (status) => {
    const statusMap = {
      nao_iniciada: 'bg-gray-100 text-gray-800',
      em_andamento: 'bg-blue-100 text-blue-800',
      concluida: 'bg-green-100 text-green-800'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const statusMap = {
      nao_iniciada: 'Não Iniciada',
      em_andamento: 'Em Andamento',
      concluida: 'Concluída'
    }
    return statusMap[status] || status
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (!meta) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">Meta não encontrada</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <Link to="/metas" className="text-gray-600 hover:text-gray-800">
              ← Voltar
            </Link>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meta.status)}`}>
              {getStatusLabel(meta.status)}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{meta.titulo}</h2>
          <p className="mt-1 text-gray-600">{meta.categoria}</p>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/metas/${id}/editar`}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Editar
          </Link>
          <button
            onClick={handleDeleteMeta}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>

      {/* Progresso */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Progresso</h3>
          <button
            onClick={() => setShowProgressoModal(true)}
            className="btn-primary"
          >
            Atualizar Progresso
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">{meta.percentualConclusao}%</div>
            <div className="text-sm text-gray-600 mt-1">Percentual de Conclusão</div>
          </div>

          {meta.metaNumerica && (
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {meta.valorAtual}/{meta.metaNumerica}
              </div>
              <div className="text-sm text-gray-600 mt-1">{meta.unidade}</div>
            </div>
          )}

          <div className="text-center">
            <div className="text-4xl font-bold text-gray-600">{formatDate(meta.prazo)}</div>
            <div className="text-sm text-gray-600 mt-1">Data Alvo</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all"
            style={{ width: `${meta.percentualConclusao}%` }}
          ></div>
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Informações</h3>

        <div className="space-y-4">
          {meta.descricao && (
            <div>
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <p className="mt-1 text-gray-900">{meta.descricao}</p>
            </div>
          )}

          {meta.responsaveis && (
            <div>
              <label className="text-sm font-medium text-gray-700">Responsáveis</label>
              <p className="mt-1 text-gray-900">{meta.responsaveis}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Ano</label>
              <p className="mt-1 text-gray-900">{meta.ano}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Prioridade</label>
              <p className="mt-1 text-gray-900 capitalize">{meta.prioridade}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Criada em</label>
              <p className="mt-1 text-gray-900">{formatDate(meta.created_at)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Atualizada em</label>
              <p className="mt-1 text-gray-900">{formatDate(meta.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submetas */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Submetas ({meta.submetas?.filter(s => s.concluida).length || 0}/{meta.submetas?.length || 0})
          </h3>
          <button
            onClick={() => setShowSubmetaModal(true)}
            className="btn-primary"
          >
            + Nova Submeta
          </button>
        </div>

        {meta.submetas && meta.submetas.length > 0 ? (
          <div className="space-y-3">
            {meta.submetas.map(submeta => (
              <div
                key={submeta.id}
                className={`border rounded-lg p-4 ${submeta.concluida ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={submeta.concluida}
                      onChange={() => handleToggleSubmeta(submeta.id)}
                      className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${submeta.concluida ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {submeta.titulo}
                      </h4>
                      {submeta.descricao && (
                        <p className="text-sm text-gray-600 mt-1">{submeta.descricao}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📅 {formatDate(submeta.prazo)}</span>
                        {submeta.concluida && submeta.dataConclusao && (
                          <span>✅ Concluída em {formatDate(submeta.dataConclusao)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSubmeta(submeta.id)}
                    className="text-red-600 hover:text-red-800 text-sm ml-2"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhuma submeta cadastrada. Clique em "Nova Submeta" para adicionar marcos intermediários.
          </p>
        )}
      </div>

      {/* Histórico de Atualizações */}
      {meta.atualizacoes && meta.atualizacoes.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Histórico de Atualizações</h3>
          <div className="space-y-3">
            {meta.atualizacoes.map(atualizacao => (
              <div key={atualizacao.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {atualizacao.percentualAnterior}% → {atualizacao.percentualNovo}%
                    </p>
                    {atualizacao.observacao && (
                      <p className="text-sm text-gray-600 mt-1">{atualizacao.observacao}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{formatDateTime(atualizacao.data)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Atualizar Progresso */}
      {showProgressoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Atualizar Progresso</h3>
            <form onSubmit={handleUpdateProgresso} className="space-y-4">
              {meta.metaNumerica && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Atual ({meta.unidade})
                  </label>
                  <input
                    type="number"
                    value={progressoForm.valorAtual}
                    onChange={(e) => setProgressoForm({ ...progressoForm, valorAtual: e.target.value })}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentual de Conclusão (%)
                </label>
                <input
                  type="number"
                  value={progressoForm.percentual}
                  onChange={(e) => setProgressoForm({ ...progressoForm, percentual: e.target.value })}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observação
                </label>
                <textarea
                  value={progressoForm.observacao}
                  onChange={(e) => setProgressoForm({ ...progressoForm, observacao: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Descreva as mudanças ou novidades..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProgressoModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Nova Submeta */}
      {showSubmetaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nova Submeta</h3>
            <form onSubmit={handleCreateSubmeta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={submetaForm.titulo}
                  onChange={(e) => setSubmetaForm({ ...submetaForm, titulo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: Realizar primeira capacitação"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={submetaForm.descricao}
                  onChange={(e) => setSubmetaForm({ ...submetaForm, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Detalhes sobre esta submeta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo *
                </label>
                <input
                  type="date"
                  value={submetaForm.prazo}
                  onChange={(e) => setSubmetaForm({ ...submetaForm, prazo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmetaModal(false)
                    setSubmetaForm({ titulo: '', descricao: '', prazo: '' })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar Submeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
