import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservas/mis-reservas');
      setReservations(response.data);
    } catch (error) {
      setError('Error al cargar las reservas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      await api.put(`/reservas/${reservationId}/cancelar`);
      setReservations((prev) =>
        prev.filter((res) => res._id !== reservationId)
      );
    } catch (error) {
      setError('Error al cancelar la reserva');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando reservas...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No tienes reservas activas</p>
          <Link
            to="/properties"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Explorar Propiedades
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {reservation.propiedad.titulo}
                  </h2>
                  <div className="text-gray-600">
                    <p>
                      <span className="font-medium">Llegada:</span>{' '}
                      {new Date(reservation.desde).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Salida:</span>{' '}
                      {new Date(reservation.hasta).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span>{' '}
                      <span
                        className={`capitalize ${
                          reservation.estado === 'confirmada'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {reservation.estado}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link
                    to={`/properties/${reservation.propiedad._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Ver Propiedad
                  </Link>
                  {reservation.estado === 'confirmada' && (
                    <button
                      onClick={() => handleCancelReservation(reservation._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations; 