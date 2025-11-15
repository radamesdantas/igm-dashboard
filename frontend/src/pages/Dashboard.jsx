import { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
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
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Visão geral dos serviços da Igreja em Mossoró
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total de Serviços</p>
              <p className="text-4xl font-bold mt-2">{stats.stats.totalServicos}</p>
            </div>
            <div className="text-5xl opacity-30">📋</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Ações Concluídas</p>
              <p className="text-4xl font-bold mt-2">{stats.stats.acoesConcluidas}</p>
            </div>
            <div className="text-5xl opacity-30">✅</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Ações Pendentes</p>
              <p className="text-4xl font-bold mt-2">{stats.stats.acoesPendentes}</p>
            </div>
            <div className="text-5xl opacity-30">⏳</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total de Reuniões</p>
              <p className="text-4xl font-bold mt-2">{stats.stats.totalReunioes}</p>
            </div>
            <div className="text-5xl opacity-30">🤝</div>
          </div>
        </div>
      </div>

      {/* Ações por Mês */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Ações por Mês</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mês
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concluídas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendentes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Conclusão
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.acoesPorMes.map((mes) => {
                const percentual = mes.total > 0 ? ((mes.concluidas / mes.total) * 100).toFixed(1) : 0
                return (
                  <tr key={mes.mes} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {mes.mes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mes.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {mes.concluidas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                      {mes.pendentes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{percentual}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Serviços */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Serviços com Mais Ações
        </h3>
        <div className="space-y-4">
          {stats.servicosTop.slice(0, 5).map((servico, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{servico.nome}</h4>
                <p className="text-sm text-gray-600">
                  {servico.supervisor && `Supervisor: ${servico.supervisor}`}
                  {servico.supervisor && servico.coordenador && ' | '}
                  {servico.coordenador && `Coordenador: ${servico.coordenador}`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="badge badge-primary px-4 py-2">
                  {servico.total_acoes} ações
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/servicos/novo"
          className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500"
        >
          <div className="text-center py-8">
            <div className="text-5xl mb-4">➕</div>
            <h3 className="text-lg font-semibold text-gray-900">Novo Serviço</h3>
            <p className="text-sm text-gray-600 mt-2">
              Adicionar um novo serviço ao sistema
            </p>
          </div>
        </Link>

        <Link
          to="/servicos"
          className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500"
        >
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900">Ver Todos os Serviços</h3>
            <p className="text-sm text-gray-600 mt-2">
              Visualizar e gerenciar todos os serviços
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
