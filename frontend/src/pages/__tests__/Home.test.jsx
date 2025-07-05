import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock del servicio de propiedades
vi.mock('../../services/propertyService', () => ({
  getProperties: vi.fn(),
  getFeaturedProperties: vi.fn(),
}));

describe('Home', () => {
  const mockProperties = [
    {
      _id: '1',
      title: 'Test Property 1',
      type: 'house',
      price: 100,
      images: ['test-image-1.jpg'],
      district: 'Test District 1',
      province: 'Test Province 1',
    },
    {
      _id: '2',
      title: 'Test Property 2',
      type: 'apartment',
      price: 200,
      images: ['test-image-2.jpg'],
      district: 'Test District 2',
      province: 'Test Province 2',
    },
  ];

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('renders hero section with search form', () => {
    renderComponent();

    expect(screen.getByText(/encuentra tu hogar ideal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('renders featured properties section', async () => {
    const { getProperties } = await import('../../services/propertyService');
    getProperties.mockResolvedValue(mockProperties);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/propiedades destacadas/i)).toBeInTheDocument();
      expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      expect(screen.getByText('Test Property 2')).toBeInTheDocument();
    });
  });

  it('renders loading state while fetching properties', () => {
    renderComponent();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('renders error state when property fetch fails', async () => {
    const { getProperties } = await import('../../services/propertyService');
    getProperties.mockRejectedValue(new Error('Failed to fetch'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/error al cargar las propiedades/i)).toBeInTheDocument();
    });
  });

  it('renders property cards with correct information', async () => {
    const { getProperties } = await import('../../services/propertyService');
    getProperties.mockResolvedValue(mockProperties);

    renderComponent();

    await waitFor(() => {
      mockProperties.forEach(property => {
        expect(screen.getByText(property.title)).toBeInTheDocument();
        expect(screen.getByText(`$${property.price}`)).toBeInTheDocument();
        expect(screen.getByText(`${property.district}, ${property.province}`)).toBeInTheDocument();
      });
    });
  });

  it('renders property type filters', () => {
    renderComponent();

    expect(screen.getByText(/tipo de propiedad/i)).toBeInTheDocument();
    expect(screen.getByText(/casa/i)).toBeInTheDocument();
    expect(screen.getByText(/apartamento/i)).toBeInTheDocument();
    expect(screen.getByText(/departamento/i)).toBeInTheDocument();
  });

  it('renders price range filter', () => {
    renderComponent();

    expect(screen.getByText(/rango de precio/i)).toBeInTheDocument();
    expect(screen.getByText(/mínimo/i)).toBeInTheDocument();
    expect(screen.getByText(/máximo/i)).toBeInTheDocument();
  });

  it('renders location filter', () => {
    renderComponent();

    expect(screen.getByText(/ubicación/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/distrito/i)).toBeInTheDocument();
  });
}); 