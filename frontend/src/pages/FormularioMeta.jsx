import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { metasAPI } from '../services/api'

export default function FormularioMeta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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

  const prioridades = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' }
  ]

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: categorias[0],
    ano: 2026,
    prazo: '',
    responsaveis: '',
    metaNumerica: '',
    valorAtual: 0,
    unidade: '',
    prioridade: 'media'
  })

  useEffect(() => {
    if (id) {
      loadMeta()
    }
  }, [id])

  const loadMeta = async () => {
    try {
      setLoading(true)
      const response = await metasAPI.getById(id)
      const meta = response.data
      setFormData({
        titulo: meta.titulo,
        descricao: meta.descricao || '',
        categoria: meta.categoria,
        ano: meta.ano,
        prazo: meta.prazo.split('T')[0], // Formato para input date
        responsaveis: meta.responsaveis || '',
        metaNumerica: meta.metaNumerica || '',
        valorAtual: meta.valorAtual || 0,
        unidade: meta.unidade || '',
        prioridade: meta.prioridade || 'media'
      })
    } catch (error) {
      console.error('Erro ao carregar meta:', error)
      alert('Erro ao carregar meta')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório'
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória'
    }

    if (!formData.prazo) {
      newErrors.prazo = 'Prazo é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      setLoading(true)

      const dataToSend = {
        ...formData,
        metaNumerica: formData.metaNumerica ? parseFloat(formData.metaNumerica) : null,
        valorAtual: formData.valorAtual ? parseFloat(formData.valorAtual) : 0
      }

      if (id) {
        await metasAPI.update(id, dataToSend)
        alert('Meta atualizada com sucesso!')
      } else {
        await metasAPI.create(dataToSend)
        alert('Meta criada com sucesso!')
      }

      navigate('/metas')
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
      alert('Erro ao salvar meta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/metas')
  }

  if (loading && id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {id ? 'Editar Meta' : 'Nova Meta 2026'}
        </h2>
        <p className="mt-2 text-gray-600">
          {id ? 'Atualize as informações da meta' : 'Preencha os dados para criar uma nova meta'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
            Título da Meta *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.titulo ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Aumentar frequência nos cultos em 20%"
          />
          {errors.titulo && (
            <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Descreva detalhes sobre esta meta..."
          />
        </div>

        {/* Categoria e Prioridade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.categoria ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
            )}
          </div>

          <div>
            <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>
            <select
              id="prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {prioridades.map(prior => (
                <option key={prior.value} value={prior.value}>{prior.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ano e Prazo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              min="2026"
              max="2030"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="prazo" className="block text-sm font-medium text-gray-700 mb-2">
              Data Alvo *
            </label>
            <input
              type="date"
              id="prazo"
              name="prazo"
              value={formData.prazo}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.prazo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.prazo && (
              <p className="mt-1 text-sm text-red-600">{errors.prazo}</p>
            )}
          </div>
        </div>

        {/* Responsáveis */}
        <div>
          <label htmlFor="responsaveis" className="block text-sm font-medium text-gray-700 mb-2">
            Responsáveis
          </label>
          <input
            type="text"
            id="responsaveis"
            name="responsaveis"
            value={formData.responsaveis}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ex: João Silva, Maria Santos"
          />
        </div>

        {/* Indicadores Numéricos */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Quantitativos (Opcional)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="metaNumerica" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Numérica
              </label>
              <input
                type="number"
                id="metaNumerica"
                name="metaNumerica"
                value={formData.metaNumerica}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 100"
              />
            </div>

            <div>
              <label htmlFor="valorAtual" className="block text-sm font-medium text-gray-700 mb-2">
                Valor Atual
              </label>
              <input
                type="number"
                id="valorAtual"
                name="valorAtual"
                value={formData.valorAtual}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 50"
              />
            </div>

            <div>
              <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 mb-2">
                Unidade
              </label>
              <input
                type="text"
                id="unidade"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: pessoas, %, eventos"
              />
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Use indicadores numéricos para metas mensuráveis (ex: aumentar frequência para 200 pessoas)
          </p>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (id ? 'Atualizar Meta' : 'Criar Meta')}
          </button>
        </div>
      </form>
    </div>
  )
}
