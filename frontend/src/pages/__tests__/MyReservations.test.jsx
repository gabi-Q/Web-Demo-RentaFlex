import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyReservations from '../MyReservations';

// Mock del contexto de autenticación
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { _id: '123' },
  }),
}));

// Mock del servicio de reservas
vi.mock('../../services/reservationService', () => ({
  getUserReservations: vi.fn(),
  cancelReservation: vi.fn(),
}));

describe('MyReservations', () => {
  const mockReservations = [
    {
      _id: '1',
      property: {
        _id: '101',
        title: 'Test Property 1',
        images: ['test-image-1.jpg'],
      },
      checkIn: '2024-03-01',
      checkOut: '2024-03-05',
      guests: 2,
      totalPrice: 400,
      status: 'confirmed',
    },
    {
      _id: '2',
      property: {
        _id: '102',
        title: 'Test Property 2',
        images: ['test-image-2.jpg'],
      },
      checkIn: '2024-03-10',
      checkOut: '2024-03-15',
      guests: 3,
      totalPrice: 750,
      status: 'pending',
    },
  ];

  const renderComponent = (reservations = mockReservations) => {
    const { getUserReservations } = require('../../services/reservationService');
    getUserReservations.mockResolvedValue(reservations);

    return render(
      <BrowserRouter>
        <MyReservations />
      </BrowserRouter>
    );
  };

  it('renders reservations list', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/mis reservas/i)).toBeInTheDocument();
      expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      expect(screen.getByText('Test Property 2')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching reservations', () => {
    renderComponent();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    const { getUserReservations } = require('../../services/reservationService');
    getUserReservations.mockRejectedValue(new Error('Failed to fetch'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/error al cargar las reservas/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no reservations', async () => {
    renderComponent([]);

    await waitFor(() => {
      expect(screen.getByText(/no tienes reservas/i)).toBeInTheDocument();
    });
  });

  it('displays reservation details correctly', async () => {
    renderComponent();

    await waitFor(() => {
      const firstReservation = screen.getByText('Test Property 1').closest('div');
      expect(firstReservation).toHaveTextContent('01/03/2024');
      expect(firstReservation).toHaveTextContent('05/03/2024');
      expect(firstReservation).toHaveTextContent('2 huéspedes');
      expect(firstReservation).toHaveTextContent('$400');
      expect(firstReservation).toHaveTextContent('confirmada');
    });
  });

  it('handles reservation cancellation', async () => {
    const { cancelReservation } = require('../../services/reservationService');
    cancelReservation.mockResolvedValue({});

    renderComponent();

    const cancelButtons = await screen.findAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/¿estás seguro de que deseas cancelar esta reserva?/i)).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(cancelReservation).toHaveBeenCalledWith('1');
      expect(screen.getByText(/reserva cancelada exitosamente/i)).toBeInTheDocument();
    });
  });

  it('shows error message on cancellation failure', async () => {
    const { cancelReservation } = require('../../services/reservationService');
    cancelReservation.mockRejectedValue(new Error('Cancellation failed'));

    renderComponent();

    const cancelButtons = await screen.findAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButtons[0]);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/error al cancelar la reserva/i)).toBeInTheDocument();
    });
  });

  it('navigates to property details when clicking on property', async () => {
    renderComponent();

    const propertyLinks = await screen.findAllByRole('link', { name: /ver propiedad/i });
    expect(propertyLinks[0]).toHaveAttribute('href', '/properties/101');
    expect(propertyLinks[1]).toHaveAttribute('href', '/properties/102');
  });

  it('redirects to login when not authenticated', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({ isAuthenticated: false });

    renderComponent();

    expect(window.location.pathname).toBe('/login');
  });
}); 