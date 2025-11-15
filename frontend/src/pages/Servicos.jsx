import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { servicosAPI } from '../services/api'

export default function Servicos() {
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadServicos()
  }, [])

  const loadServicos = async () => {
    try {
      const response = await servicosAPI.getAll()
      setServicos(response.data)
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o serviço "${nome}"?`)) {
      try {
        await servicosAPI.delete(id)
        loadServicos()
      } catch (error) {
        console.error('Erro ao excluir serviço:', error)
        alert('Erro ao excluir serviço')
      }
    }
  }

  const filteredServicos = servicos.filter(
    (servico) =>
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (servico.supervisor && servico.supervisor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (servico.coordenador && servico.coordenador.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h2 className="text-3xl font-bold text-gray-900">Serviços</h2>
          <p className="mt-2 text-gray-600">
            Gerenciamento de todos os serviços da igreja
          </p>
        </div>
        <Link to="/servicos/novo" className="btn btn-primary">
          ➕ Novo Serviço
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <input
          type="text"
          placeholder="Buscar por nome, supervisor ou coordenador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
      </div>

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 gap-6">
        {filteredServicos.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900">
              Nenhum serviço encontrado
            </h3>
            <p className="text-gray-600 mt-2">
              {searchTerm
                ? 'Tente ajustar os termos de busca'
                : 'Comece adicionando um novo serviço'}
            </p>
          </div>
        ) : (
          filteredServicos.map((servico) => (
            <div key={servico.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-primary-600">
                      #{servico.numero}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {servico.nome}
                    </h3>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {servico.supervisor && (
                      <div>
                        <p className="text-sm text-gray-500">Supervisor</p>
                        <p className="text-base font-medium text-gray-900">
                          {servico.supervisor}
                        </p>
                      </div>
                    )}
                    {servico.coordenador && (
                      <div>
                        <p className="text-sm text-gray-500">Coordenador(es)</p>
                        <p className="text-base font-medium text-gray-900">
                          {servico.coordenador}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Link
                    to={`/servicos/${servico.id}`}
                    className="btn btn-primary"
                  >
                    Ver Detalhes
                  </Link>
                  <button
                    onClick={() => handleDelete(servico.id, servico.nome)}
                    className="btn btn-danger"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {filteredServicos.length > 0 && (
        <div className="card bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Mostrando {filteredServicos.length} de {servicos.length} serviços
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
