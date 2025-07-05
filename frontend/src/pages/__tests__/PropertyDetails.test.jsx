import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PropertyDetails from '../PropertyDetails';

// Mock del servicio de propiedades
vi.mock('../../services/propertyService', () => ({
  getPropertyById: vi.fn(),
  toggleFavorite: vi.fn(),
}));

// Mock del contexto de autenticación
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { _id: '123' },
  }),
}));

describe('PropertyDetails', () => {
  const mockProperty = {
    _id: '1',
    title: 'Test Property',
    type: 'house',
    price: 100,
    description: 'Test description',
    rooms: 2,
    bathrooms: 1,
    area: 100,
    district: 'Test District',
    province: 'Test Province',
    images: ['test-image-1.jpg', 'test-image-2.jpg'],
    owner: {
      _id: '456',
      name: 'Test Owner',
      email: 'owner@test.com',
      phone: '123456789',
    },
  };

  const renderComponent = (property = mockProperty) => {
    const { getPropertyById } = require('../../services/propertyService');
    getPropertyById.mockResolvedValue(property);

    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PropertyDetails />} />
        </Routes>
      </BrowserRouter>
    );
  };

  it('renders property information correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('2 habitaciones')).toBeInTheDocument();
      expect(screen.getByText('1 baño')).toBeInTheDocument();
      expect(screen.getByText('100 m²')).toBeInTheDocument();
      expect(screen.getByText('Test District, Test Province')).toBeInTheDocument();
    });
  });

  it('renders owner information', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Owner')).toBeInTheDocument();
      expect(screen.getByText('owner@test.com')).toBeInTheDocument();
      expect(screen.getByText('123456789')).toBeInTheDocument();
    });
  });

  it('renders image gallery', async () => {
    renderComponent();

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'test-image-1.jpg');
      expect(images[1]).toHaveAttribute('src', 'test-image-2.jpg');
    });
  });

  it('renders reservation form when user is authenticated', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/reservar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fecha de llegada/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fecha de salida/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número de huéspedes/i)).toBeInTheDocument();
    });
  });

  it('shows login prompt when user is not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/inicia sesión para reservar/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  it('handles favorite toggle', async () => {
    const { toggleFavorite } = require('../../services/propertyService');
    toggleFavorite.mockResolvedValue({ isFavorite: true });

    renderComponent();

    const favoriteButton = await screen.findByRole('button', { name: /favorito/i });
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(toggleFavorite).toHaveBeenCalledWith('1');
      expect(favoriteButton).toHaveClass('text-red-500');
    });
  });

  it('shows loading state while fetching property', () => {
    renderComponent();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('shows error state when property fetch fails', async () => {
    const { getPropertyById } = require('../../services/propertyService');
    getPropertyById.mockRejectedValue(new Error('Failed to fetch'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/error al cargar la propiedad/i)).toBeInTheDocument();
    });
  });
}); 