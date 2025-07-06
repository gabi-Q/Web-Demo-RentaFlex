import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import SearchFilter from '../components/SearchFilter';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tipo: '',
    precioMin: '',
    precioMax: '',
    ubicacion: '',
  });
  
  // Usar una referencia para evitar peticiones duplicadas
  const isFirstRender = useRef(true);

  const fetchProperties = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Aplicando filtros:', currentFilters);
      const data = await propertyService.getAll(currentFilters);
      console.log('Propiedades recibidas:', data);
      setProperties(data);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
      setError('Error al cargar las propiedades');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar propiedades iniciales solo una vez al montar el componente
  useEffect(() => {
    if (isFirstRender.current) {
      fetchProperties(filters);
      isFirstRender.current = false;
    }
  }, [fetchProperties, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    console.log('Nuevos filtros:', newFilters);
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback((searchFilters) => {
    console.log('Buscando con filtros:', searchFilters);
    fetchProperties(searchFilters);
  }, [fetchProperties]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Propiedades Disponibles</h1>

      {/* Filtros */}
      <SearchFilter 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Lista de Propiedades */}
      {loading ? (
        <div className="text-center text-gray-900">Cargando propiedades...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{property.titulo}</h3>
                <p className="text-gray-700 font-semibold mb-2">{property.ubicacion.distrito}</p>
                <p className="text-gray-600 mb-4">{property.descripcion}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    S/ {property.precio_noche}<span className="text-sm font-normal">/noche</span>
                  </span>
                  <Link
                    to={`/properties/${property._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Ver Detalles
                  </Link>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="mr-4">
                    {property.habitaciones} habitaciones
                  </span>
                  <span>{property.banos} baños</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && properties.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No se encontraron propiedades con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};

export default Properties;