import { useState, useEffect } from 'react'
import { acoesAPI } from '../services/api'
import { Link } from 'react-router-dom'

export default function Acoes() {
  const [acoes, setAcoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  useEffect(() => {
    loadAcoes()
  }, [])

  const loadAcoes = async () => {
    try {
      const response = await acoesAPI.getAll()
      setAcoes(response.data)
    } catch (error) {
      console.error('Erro ao carregar ações:', error)
    } finally {
      setLoading(false)
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

  const acoesFilteradas = acoes.filter(acao => {
    if (filtroMes && acao.mes !== filtroMes) return false
    if (filtroStatus && acao.status !== filtroStatus) return false
    return true
  })

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
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Todas as Ações</h2>
        <p className="mt-2 text-gray-600">
          Visualização consolidada de todas as ações dos serviços
        </p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Filtrar por Mês</label>
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="input"
            >
              <option value="">Todos os meses</option>
              {meses.map(mes => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Filtrar por Status</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="input"
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="concluida">Concluída</option>
              <option value="nao_realizada">Não Realizada</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFiltroMes('')
                setFiltroStatus('')
              }}
              className="btn btn-secondary w-full"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-yellow-50 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">Pendentes</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-2">
            {acoesFilteradas.filter(a => a.status === 'pendente').length}
          </p>
        </div>
        <div className="card bg-green-50 border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Concluídas</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {acoesFilteradas.filter(a => a.status === 'concluida').length}
          </p>
        </div>
        <div className="card bg-red-50 border border-red-200">
          <h3 className="text-sm font-medium text-red-800">Não Realizadas</h3>
          <p className="text-3xl font-bold text-red-900 mt-2">
            {acoesFilteradas.filter(a => a.status === 'nao_realizada').length}
          </p>
        </div>
      </div>

      {/* Lista de Ações */}
      <div className="space-y-6">
        {acoesFilteradas.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900">
              Nenhuma ação encontrada
            </h3>
            <p className="text-gray-600 mt-2">
              Tente ajustar os filtros ou adicione novas ações aos serviços
            </p>
          </div>
        ) : (
          meses.map(mes => {
            const acoesMes = acoesFilteradas.filter(a => a.mes === mes)
            if (acoesMes.length === 0) return null

            return (
              <div key={mes} className="card">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{mes}</h3>
                <div className="space-y-3">
                  {acoesMes.map(acao => (
                    <div
                      key={acao.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Link
                              to={`/servicos/${acao.servico_id}`}
                              className="text-sm font-semibold text-primary-600 hover:text-primary-800"
                            >
                              #{acao.servico_numero} {acao.servico_nome}
                            </Link>
                          </div>
                          <p className="text-gray-900">{acao.descricao}</p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(acao.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer Stats */}
      {acoesFilteradas.length > 0 && (
        <div className="card bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Mostrando {acoesFilteradas.length} de {acoes.length} ações
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
