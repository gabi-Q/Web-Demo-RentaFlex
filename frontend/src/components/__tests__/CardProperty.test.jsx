import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardProperty from '../CardProperty';

// Mock del contexto de autenticación
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { _id: '123' },
    isAuthenticated: true,
  }),
}));

// Mock del servicio de propiedades
vi.mock('../../services/propertyService', () => ({
  toggleFavorite: vi.fn(),
}));

describe('CardProperty', () => {
  const mockProperty = {
    _id: '1',
    title: 'Test Property',
    type: 'house',
    price: 100,
    images: ['test-image.jpg'],
    district: 'Test District',
    province: 'Test Province',
  };

  const renderComponent = (property = mockProperty) => {
    return render(
      <BrowserRouter>
        <CardProperty property={property} />
      </BrowserRouter>
    );
  };

  it('renders property information correctly', () => {
    renderComponent();

    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Test District, Test Province')).toBeInTheDocument();
  });

  it('renders property image with correct alt text', () => {
    renderComponent();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Property');
  });

  it('renders favorite button when user is authenticated', () => {
    renderComponent();

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('navigates to property details when clicked', () => {
    renderComponent();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/properties/1');
  });
}); 