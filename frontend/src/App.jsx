import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Servicos from './pages/Servicos'
import ServicoDetalhes from './pages/ServicoDetalhes'
import NovoServico from './pages/NovoServico'
import Acoes from './pages/Acoes'
import GerenciarAcoes from './pages/GerenciarAcoes'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center">
                  <h1 className="text-2xl font-bold text-primary-600">
                    IGM Dashboard
                  </h1>
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/servicos"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                  >
                    Serviços
                  </Link>
                  <Link
                    to="/acoes"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                  >
                    Ações
                  </Link>
                  <Link
                    to="/gerenciar-acoes"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                  >
                    Gerenciar Ações
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/servicos/novo" element={<NovoServico />} />
            <Route path="/servicos/:id" element={<ServicoDetalhes />} />
            <Route path="/acoes" element={<Acoes />} />
            <Route path="/gerenciar-acoes" element={<GerenciarAcoes />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
