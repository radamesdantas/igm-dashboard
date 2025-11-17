import { useState, useEffect } from 'react'
import { metasAPI } from '../services/api'
import { Link } from 'react-router-dom'

export default function Metas2026() {
  const [stats, setStats] = useState(null)
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

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
  ]

  const statusOptions = [
    { value: 'nao_iniciada', label: 'Não Iniciada', color: 'gray' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'blue' },
    { value: 'concluida', label: 'Concluída', color: 'green' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsResponse, metasResponse] = await Promise.all([
        metasAPI.getStats(2026),
        metasAPI.getAll({ ano: 2026 })
      ])
      setStats(statsResponse.data)
      setMetas(metasResponse.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const metasFiltradas = metas.filter(meta => {
    const matchCategoria = !filtroCategoria || meta.categoria === filtroCategoria
    const matchStatus = !filtroStatus || meta.status === filtroStatus
    return matchCategoria && matchStatus
  })

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

  const getCategoriaEmoji = (categoria) => {
    const emojiMap = {
      'Igreja Geral': '⛪',
      'Valentes de Davi': '🛡️',
      'Serviços': '🔧',
      'Presbíteros': '👔',
      'Evangelização': '📢',
      'Jovens': '👥',
      'Crianças': '👶',
      'Música': '🎵',
      'Outros': '📌'
    }
    return emojiMap[categoria] || '📌'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">Erro ao carregar dados</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Metas 2026</h2>
          <p className="mt-2 text-gray-600">
            Planejamento e acompanhamento de metas para 2026
          </p>
        </div>
        <Link
          to="/metas/nova"
          className="btn-primary"
        >
          + Nova Meta
        </Link>
      </div>

      {/* Stats Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total de Metas</p>
              <p className="text-4xl font-bold mt-2">{stats.totalGeral}</p>
            </div>
            <div className="text-5xl opacity-30">🎯</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Concluídas</p>
              <p className="text-4xl font-bold mt-2">{stats.concluidasGeral}</p>
              <p className="text-xs text-green-100 mt-1">
                {stats.totalGeral > 0
                  ? Math.round((stats.concluidasGeral / stats.totalGeral) * 100)
                  : 0}% do total
              </p>
            </div>
            <div className="text-5xl opacity-30">✅</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Em Andamento</p>
              <p className="text-4xl font-bold mt-2">{stats.emAndamentoGeral}</p>
              <p className="text-xs text-blue-100 mt-1">
                {stats.totalGeral > 0
                  ? Math.round((stats.emAndamentoGeral / stats.totalGeral) * 100)
                  : 0}% do total
              </p>
            </div>
            <div className="text-5xl opacity-30">🚀</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Progresso Médio</p>
              <p className="text-4xl font-bold mt-2">{stats.progressoGeralMedio}%</p>
            </div>
            <div className="text-5xl opacity-30">📊</div>
          </div>
        </div>
      </div>

      {/* Metas por Categoria */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Metas por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.categorias.map(cat => (
            <div key={cat.categoria} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoriaEmoji(cat.categoria)}</span>
                  <h4 className="font-semibold text-gray-900">{cat.categoria}</h4>
                </div>
                <span className="text-sm font-bold text-gray-600">{cat.total}</span>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progresso</span>
                  <span>{cat.progressoMedio}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${cat.progressoMedio}%` }}
                  ></div>
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-between text-xs text-gray-600">
                <span>✅ {cat.concluidas}</span>
                <span>🚀 {cat.emAndamento}</span>
                <span>⏸️ {cat.naoIniciadas}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros e Lista de Metas */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">
            Todas as Metas ({metasFiltradas.length})
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {metasFiltradas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhuma meta encontrada.
              <Link to="/metas/nova" className="text-primary-600 hover:text-primary-700 ml-1">
                Criar primeira meta
              </Link>
            </p>
          ) : (
            metasFiltradas.map(meta => (
              <div key={meta.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getCategoriaEmoji(meta.categoria)}</span>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{meta.titulo}</h4>
                        <p className="text-sm text-gray-500">{meta.categoria}</p>
                      </div>
                    </div>

                    {meta.descricao && (
                      <p className="text-gray-600 mb-3">{meta.descricao}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {meta.responsaveis && (
                        <span>👤 {meta.responsaveis}</span>
                      )}
                      <span>📅 Prazo: {formatDate(meta.prazo)}</span>
                      {meta.metaNumerica && (
                        <span>
                          🎯 {meta.valorAtual}/{meta.metaNumerica} {meta.unidade}
                        </span>
                      )}
                      {meta.totalSubmetas > 0 && (
                        <span>
                          📋 Submetas: {meta.submetasConcluidas}/{meta.totalSubmetas}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meta.status)}`}>
                      {getStatusLabel(meta.status)}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{meta.percentualConclusao}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${meta.percentualConclusao}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Link
                    to={`/metas/${meta.id}`}
                    className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver Detalhes
                  </Link>
                  <Link
                    to={`/metas/${meta.id}/editar`}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
