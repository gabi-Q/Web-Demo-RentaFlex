import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getUserProperties();
      setProperties(data);
    } catch (error) {
      setError('Error al cargar las propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      try {
        await propertyService.delete(id);
        setProperties((prev) => prev.filter((property) => property._id !== id));
      } catch (error) {
        setError('Error al eliminar la propiedad');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando propiedades...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Propiedades</h1>
        <Link
          to="/publish"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Publicar Nueva Propiedad
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No tienes propiedades publicadas</p>
          <Link
            to="/publish"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Publica tu primera propiedad
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={property.imagenes[0]}
                alt={property.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{property.titulo}</h2>
                <p className="text-gray-600 mb-2">{property.descripcion}</p>
                <p className="text-blue-600 font-semibold mb-4">
                  S/ {property.precio_noche} por noche
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/properties/${property._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Ver detalles
                  </Link>
                  <div className="space-x-2">
                    <Link
                      to={`/properties/${property._id}/edit`}
                      className="text-green-600 hover:text-green-800"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties; 