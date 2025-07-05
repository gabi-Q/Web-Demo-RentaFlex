import { useState } from 'react';

const SearchFilter = ({ onFilterChange, onSearch }) => {
  const [filters, setFilters] = useState({
    tipo: '',
    precioMin: '',
    precioMax: '',
    ubicacion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      tipo: '',
      precioMin: '',
      precioMax: '',
      ubicacion: '',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Filtros de Búsqueda</h2>
        <div className="space-x-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Buscar
          </button>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            name="tipo"
            value={filters.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="">Todos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="departamento">Departamento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Mínimo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">S/</span>
            <input
              type="number"
              name="precioMin"
              value={filters.precioMin}
              onChange={handleChange}
              placeholder="Min"
              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Máximo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">S/</span>
            <input
              type="number"
              name="precioMax"
              value={filters.precioMax}
              onChange={handleChange}
              placeholder="Max"
              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={filters.ubicacion}
            onChange={handleChange}
            placeholder="Ciudad o distrito"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter; 