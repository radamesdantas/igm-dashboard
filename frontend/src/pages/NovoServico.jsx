import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { servicosAPI } from '../services/api'

export default function NovoServico() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    supervisor: '',
    coordenador: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await servicosAPI.create(formData)
      navigate('/servicos')
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      alert('Erro ao criar serviço. Verifique se o número do serviço já não existe.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/servicos" className="btn btn-secondary">
          ← Voltar
        </Link>
        <h2 className="text-3xl font-bold text-gray-900">Novo Serviço</h2>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Número *</label>
            <input
              type="number"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="input"
              required
              min="1"
              placeholder="Ex: 1"
            />
            <p className="mt-1 text-sm text-gray-500">
              Número sequencial do serviço (deve ser único)
            </p>
          </div>

          <div>
            <label className="label">Nome do Serviço *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="input"
              required
              placeholder="Ex: Segurança"
            />
          </div>

          <div>
            <label className="label">Supervisor</label>
            <input
              type="text"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleChange}
              className="input"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="label">Coordenador(es)</label>
            <input
              type="text"
              name="coordenador"
              value={formData.coordenador}
              onChange={handleChange}
              className="input"
              placeholder="Ex: Maria Santos, Pedro Oliveira"
            />
            <p className="mt-1 text-sm text-gray-500">
              Se houver mais de um coordenador, separe os nomes por vírgula
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="submit" className="btn btn-primary flex-1">
              Criar Serviço
            </button>
            <Link to="/servicos" className="btn btn-secondary flex-1">
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Dica</h3>
        <p className="text-sm text-blue-800">
          Após criar o serviço, você poderá adicionar ações e registrar reuniões
          na página de detalhes do serviço.
        </p>
      </div>
    </div>
  )
}
