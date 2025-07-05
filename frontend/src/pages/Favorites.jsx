import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/favoritos');
      setFavorites(response.data);
      setError('');
    } catch (err) {
      setError(
        'Error al cargar los favoritos. Por favor, intenta de nuevo.'
      );
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    setRemovingId(propertyId);

    try {
      await api.delete(`/usuarios/favoritos/${propertyId}`);
      setFavorites((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Error al eliminar de favoritos. Por favor, intenta de nuevo.'
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mis Favoritos
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          <p className="text-lg mb-4">No tienes propiedades favoritas</p>
          <Link to="/propiedades" className="btn btn-primary">
            Explorar Propiedades
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <Link to={`/propiedades/${property._id}`}>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={property.imagenes[0]}
                    alt={property.titulo}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link
                  to={`/propiedades/${property._id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                >
                  {property.titulo}
                </Link>
                <p className="mt-1 text-gray-600">{property.direccion}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-semibold text-primary-600">
                    ${property.precioPorNoche}/noche
                  </div>
                  <button
                    onClick={() => handleRemove(property._id)}
                    disabled={removingId === property._id}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {removingId === property._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {property.habitaciones} hab.
                  </span>
                  <span className="flex items-center ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {property.banos} baños
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 