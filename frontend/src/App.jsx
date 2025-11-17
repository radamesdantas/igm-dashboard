import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Servicos from './pages/Servicos'
import ServicoDetalhes from './pages/ServicoDetalhes'
import NovoServico from './pages/NovoServico'
import Acoes from './pages/Acoes'
import GerenciarAcoes from './pages/GerenciarAcoes'
import Metas2026 from './pages/Metas2026'
import FormularioMeta from './pages/FormularioMeta'
import MetaDetalhes from './pages/MetaDetalhes'

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Não mostrar navbar na página de login
  if (location.pathname === '/login') {
    return null
  }

  return (
    <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center">
                  <h1 className="text-2xl font-bold text-primary-600">
                    IGM Dashboard
                  </h1>
                </Link>
                {/* Desktop Menu */}
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
                  <Link
                    to="/metas"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                  >
                    Metas 2026
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* User info and logout */}
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Olá, <span className="font-semibold">{user?.username || 'Usuário'}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Sair
                  </button>
                </div>
                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                >
                  <span className="sr-only">Abrir menu</span>
                  {/* Hamburger icon */}
                  {!mobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/servicos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                >
                  Serviços
                </Link>
                <Link
                  to="/acoes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                >
                  Ações
                </Link>
                <Link
                  to="/gerenciar-acoes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                >
                  Gerenciar Ações
                </Link>
                <Link
                  to="/metas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                >
                  Metas 2026
                </Link>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    Olá, <span className="font-semibold">{user?.username || 'Usuário'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/servicos" element={<PrivateRoute><Servicos /></PrivateRoute>} />
          <Route path="/servicos/novo" element={<PrivateRoute><NovoServico /></PrivateRoute>} />
          <Route path="/servicos/:id" element={<PrivateRoute><ServicoDetalhes /></PrivateRoute>} />
          <Route path="/acoes" element={<PrivateRoute><Acoes /></PrivateRoute>} />
          <Route path="/gerenciar-acoes" element={<PrivateRoute><GerenciarAcoes /></PrivateRoute>} />
          <Route path="/metas" element={<PrivateRoute><Metas2026 /></PrivateRoute>} />
          <Route path="/metas/nova" element={<PrivateRoute><FormularioMeta /></PrivateRoute>} />
          <Route path="/metas/:id" element={<PrivateRoute><MetaDetalhes /></PrivateRoute>} />
          <Route path="/metas/:id/editar" element={<PrivateRoute><FormularioMeta /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
