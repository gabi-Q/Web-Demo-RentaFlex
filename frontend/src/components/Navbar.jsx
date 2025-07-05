import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">RentaFlex</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4 ml-10">
              <Link to="/properties" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Propiedades
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-properties" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                    Mis Propiedades
                  </Link>
                  <Link to="/publish" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                    Publicar
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Menú de escritorio */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/my-reservations" className="text-gray-700 hover:text-blue-600">
                  Mis Reservas
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  Mi Perfil
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
              <Link
                to="/properties"
                className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Propiedades
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-properties"
                    className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis Propiedades
                  </Link>
                  <Link
                    to="/publish"
                    className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Publicar
                  </Link>
                  <Link
                    to="/my-reservations"
                    className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis Reservas
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 