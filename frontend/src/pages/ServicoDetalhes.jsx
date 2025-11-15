import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { servicosAPI, acoesAPI, reunioesAPI } from '../services/api'

export default function ServicoDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [servico, setServico] = useState(null)
  const [acoes, setAcoes] = useState([])
  const [reunioes, setReunioes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNovaAcaoForm, setShowNovaAcaoForm] = useState(false)
  const [showNovaReuniaoForm, setShowNovaReuniaoForm] = useState(false)

  const [novaAcao, setNovaAcao] = useState({
    mes: 'Janeiro',
    descricao: '',
    status: 'pendente'
  })

  const [novaReuniao, setNovaReuniao] = useState({
    data: '',
    mes: 'Janeiro',
    resumo: '',
    participantes: '',
    decisoes: ''
  })

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [servicoRes, acoesRes, reunioesRes] = await Promise.all([
        servicosAPI.getById(id),
        acoesAPI.getByServico(id),
        reunioesAPI.getByServico(id)
      ])
      setServico(servicoRes.data)
      setAcoes(acoesRes.data)
      setReunioes(reunioesRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCriarAcao = async (e) => {
    e.preventDefault()
    try {
      await acoesAPI.create({
        servico_id: id,
        ...novaAcao
      })
      setNovaAcao({ mes: 'Janeiro', descricao: '', status: 'pendente' })
      setShowNovaAcaoForm(false)
      loadData()
    } catch (error) {
      console.error('Erro ao criar ação:', error)
      alert('Erro ao criar ação')
    }
  }

  const handleCriarReuniao = async (e) => {
    e.preventDefault()
    try {
      await reunioesAPI.create({
        servico_id: id,
        ...novaReuniao
      })
      setNovaReuniao({ data: '', mes: 'Janeiro', resumo: '', participantes: '', decisoes: '' })
      setShowNovaReuniaoForm(false)
      loadData()
    } catch (error) {
      console.error('Erro ao criar reunião:', error)
      alert('Erro ao criar reunião')
    }
  }

  const handleDeleteAcao = async (acaoId) => {
    if (window.confirm('Tem certeza que deseja excluir esta ação?')) {
      try {
        await acoesAPI.delete(acaoId)
        loadData()
      } catch (error) {
        console.error('Erro ao excluir ação:', error)
      }
    }
  }

  const handleUpdateAcaoStatus = async (acaoId, novoStatus) => {
    try {
      const acao = acoes.find(a => a.id === acaoId)
      await acoesAPI.update(acaoId, { ...acao, status: novoStatus })
      loadData()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (!servico) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">Serviço não encontrado</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/servicos" className="btn btn-secondary">
          ← Voltar
        </Link>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-primary-600">
              #{servico.numero}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{servico.nome}</h2>
          </div>
        </div>
      </div>

      {/* Informações do Serviço */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servico.supervisor && (
            <div>
              <p className="text-sm text-gray-500 font-medium">Supervisor</p>
              <p className="text-lg text-gray-900 mt-1">{servico.supervisor}</p>
            </div>
          )}
          {servico.coordenador && (
            <div>
              <p className="text-sm text-gray-500 font-medium">Coordenador(es)</p>
              <p className="text-lg text-gray-900 mt-1">{servico.coordenador}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Ações</h3>
          <button
            onClick={() => setShowNovaAcaoForm(!showNovaAcaoForm)}
            className="btn btn-primary"
          >
            {showNovaAcaoForm ? 'Cancelar' : '➕ Nova Ação'}
          </button>
        </div>

        {showNovaAcaoForm && (
          <form onSubmit={handleCriarAcao} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="label">Mês</label>
              <select
                value={novaAcao.mes}
                onChange={(e) => setNovaAcao({ ...novaAcao, mes: e.target.value })}
                className="input"
                required
              >
                {meses.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Descrição</label>
              <textarea
                value={novaAcao.descricao}
                onChange={(e) => setNovaAcao({ ...novaAcao, descricao: e.target.value })}
                className="input"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={novaAcao.status}
                onChange={(e) => setNovaAcao({ ...novaAcao, status: e.target.value })}
                className="input"
              >
                <option value="pendente">Pendente</option>
                <option value="concluida">Concluída</option>
                <option value="nao_realizada">Não Realizada</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">
              Criar Ação
            </button>
          </form>
        )}

        {acoes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhuma ação registrada ainda
          </div>
        ) : (
          <div className="space-y-4">
            {meses.map(mes => {
              const acoesMes = acoes.filter(a => a.mes === mes)
              if (acoesMes.length === 0) return null

              return (
                <div key={mes} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">{mes}</h4>
                  <div className="space-y-3">
                    {acoesMes.map(acao => (
                      <div key={acao.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-gray-900">{acao.descricao}</p>
                          <div className="mt-2">
                            {getStatusBadge(acao.status)}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <select
                            value={acao.status}
                            onChange={(e) => handleUpdateAcaoStatus(acao.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="concluida">Concluída</option>
                            <option value="nao_realizada">Não Realizada</option>
                          </select>
                          <button
                            onClick={() => handleDeleteAcao(acao.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reuniões */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Reuniões</h3>
          <button
            onClick={() => setShowNovaReuniaoForm(!showNovaReuniaoForm)}
            className="btn btn-primary"
          >
            {showNovaReuniaoForm ? 'Cancelar' : '➕ Nova Reunião'}
          </button>
        </div>

        {showNovaReuniaoForm && (
          <form onSubmit={handleCriarReuniao} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Data</label>
                <input
                  type="date"
                  value={novaReuniao.data}
                  onChange={(e) => setNovaReuniao({ ...novaReuniao, data: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Mês</label>
                <select
                  value={novaReuniao.mes}
                  onChange={(e) => setNovaReuniao({ ...novaReuniao, mes: e.target.value })}
                  className="input"
                  required
                >
                  {meses.map(mes => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Participantes</label>
              <input
                type="text"
                value={novaReuniao.participantes}
                onChange={(e) => setNovaReuniao({ ...novaReuniao, participantes: e.target.value })}
                className="input"
                placeholder="Ex: João, Maria, Pedro"
              />
            </div>
            <div>
              <label className="label">Resumo</label>
              <textarea
                value={novaReuniao.resumo}
                onChange={(e) => setNovaReuniao({ ...novaReuniao, resumo: e.target.value })}
                className="input"
                rows="4"
                placeholder="Resumo da reunião..."
              />
            </div>
            <div>
              <label className="label">Decisões</label>
              <textarea
                value={novaReuniao.decisoes}
                onChange={(e) => setNovaReuniao({ ...novaReuniao, decisoes: e.target.value })}
                className="input"
                rows="3"
                placeholder="Decisões tomadas..."
              />
            </div>
            <button type="submit" className="btn btn-success">
              Criar Reunião
            </button>
          </form>
        )}

        {reunioes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhuma reunião registrada ainda
          </div>
        ) : (
          <div className="space-y-4">
            {reunioes.map(reuniao => (
              <div key={reuniao.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">
                      {new Date(reuniao.data).toLocaleDateString('pt-BR')} - {reuniao.mes}
                    </h4>
                    {reuniao.participantes && (
                      <p className="text-sm text-gray-600">
                        Participantes: {reuniao.participantes}
                      </p>
                    )}
                  </div>
                </div>
                {reuniao.resumo && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Resumo:</p>
                    <p className="text-gray-900 whitespace-pre-line">{reuniao.resumo}</p>
                  </div>
                )}
                {reuniao.decisoes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Decisões:</p>
                    <p className="text-gray-900 whitespace-pre-line">{reuniao.decisoes}</p>
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
