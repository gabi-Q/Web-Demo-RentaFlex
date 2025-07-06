import { Link } from 'react-router-dom';
import { useState } from 'react';

const CardProperty = ({ property }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200">
          <img
            src={property.imagenes[0]}
            alt={property.titulo}
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.titulo}</h3>
        <p className="text-gray-700 font-semibold mb-2">{property.ubicacion.distrito}</p>
        <p className="text-gray-600 mb-4 line-clamp-2">{property.descripcion}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${property.precio_noche}/noche
          </span>
          <Link
            to={`/properties/${property._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Ver Detalles
          </Link>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span className="mr-4">
            <svg
              className="w-5 h-5 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
          <span>
            <svg
              className="w-5 h-5 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
  );
};

export default CardProperty;