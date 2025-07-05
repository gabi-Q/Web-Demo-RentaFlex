import api from './api';

export const propertyService = {
  // Obtener todas las propiedades
  getAll: async (filters = {}) => {
    try {
      // Convertir los filtros a un formato que el backend pueda procesar
      const queryParams = new URLSearchParams();
      
      if (filters.tipo) {
        console.log('Enviando filtro tipo:', filters.tipo);
        queryParams.append('tipo', filters.tipo.toLowerCase());
      }
      if (filters.precioMin) {
        console.log('Enviando filtro precio mínimo:', filters.precioMin);
        queryParams.append('precio_min', filters.precioMin);
      }
      if (filters.precioMax) {
        console.log('Enviando filtro precio máximo:', filters.precioMax);
        queryParams.append('precio_max', filters.precioMax);
      }
      if (filters.ubicacion) {
        console.log('Enviando filtro ubicación:', filters.ubicacion);
        queryParams.append('distrito', filters.ubicacion);
      }

      const url = `/properties?${queryParams.toString()}`;
      console.log('URL de búsqueda:', url);

      const response = await api.get(url);
      console.log('Respuesta del servidor:', response.data);
      
      // Verificar que los resultados coincidan con los filtros
      let propiedadesFiltradas = response.data;
      
      if (filters.tipo && propiedadesFiltradas.length > 0) {
        const tipoFiltrado = filters.tipo.toLowerCase();
        propiedadesFiltradas = propiedadesFiltradas.filter(p => p.tipo.toLowerCase() === tipoFiltrado);
        console.log('Propiedades filtradas por tipo:', propiedadesFiltradas);
      }
      
      if (filters.precioMin && propiedadesFiltradas.length > 0) {
        const precioMin = Number(filters.precioMin);
        propiedadesFiltradas = propiedadesFiltradas.filter(p => p.precio_noche >= precioMin);
        console.log('Propiedades filtradas por precio mínimo:', propiedadesFiltradas);
      }
      
      if (filters.precioMax && propiedadesFiltradas.length > 0) {
        const precioMax = Number(filters.precioMax);
        propiedadesFiltradas = propiedadesFiltradas.filter(p => p.precio_noche <= precioMax);
        console.log('Propiedades filtradas por precio máximo:', propiedadesFiltradas);
      }
      
      if (filters.ubicacion && propiedadesFiltradas.length > 0) {
        const ubicacionFiltrada = filters.ubicacion.toLowerCase();
        propiedadesFiltradas = propiedadesFiltradas.filter(p => 
          p.ubicacion.distrito.toLowerCase().includes(ubicacionFiltrada) ||
          p.ubicacion.provincia.toLowerCase().includes(ubicacionFiltrada)
        );
        console.log('Propiedades filtradas por ubicación:', propiedadesFiltradas);
      }
      
      return propiedadesFiltradas;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  // Obtener propiedades destacadas
  getFeatured: async () => {
    const response = await api.get('/properties/featured');
    return response.data;
  },

  // Obtener una propiedad por ID
  getById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Crear una nueva propiedad
  create: async (propertyData) => {
    const formData = new FormData();
    
    // Agregar campos de texto
    Object.keys(propertyData).forEach(key => {
      if (key === 'imagenes') {
        // Agregar cada imagen al FormData
        propertyData[key].forEach((file, index) => {
          formData.append('imagenes', file);
        });
      } else if (key === 'ubicacion') {
        // Agregar ubicación como JSON string
        formData.append('ubicacion', JSON.stringify(propertyData[key]));
      } else if (key === 'disponibilidad') {
        // Agregar disponibilidad como JSON string
        formData.append('disponibilidad', JSON.stringify(propertyData[key]));
      } else {
        formData.append(key, propertyData[key]);
      }
    });

    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Actualizar una propiedad
  update: async (id, propertyData) => {
    const formData = new FormData();
    
    // Agregar campos de texto
    Object.keys(propertyData).forEach(key => {
      if (key === 'imagenes') {
        // Agregar cada imagen al FormData
        propertyData[key].forEach((file, index) => {
          formData.append('imagenes', file);
        });
      } else if (key === 'ubicacion') {
        // Agregar ubicación como JSON string
        formData.append('ubicacion', JSON.stringify(propertyData[key]));
      } else if (key === 'disponibilidad') {
        // Agregar disponibilidad como JSON string
        formData.append('disponibilidad', JSON.stringify(propertyData[key]));
      } else {
        formData.append(key, propertyData[key]);
      }
    });

    const response = await api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Eliminar una propiedad
  delete: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Obtener propiedades del usuario
  getUserProperties: async () => {
    const response = await api.get('/properties/user');
    return response.data;
  },

  // Agregar/remover de favoritos
  toggleFavorite: async (propertyId) => {
    const response = await api.post(`/properties/${propertyId}/favorite`);
    return response.data;
  },

  // Obtener propiedades favoritas
  getFavorites: async () => {
    const response = await api.get('/properties/favorites');
    return response.data;
  },
}; 