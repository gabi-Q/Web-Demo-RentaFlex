import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock del contexto de autenticación
const mockUseAuth = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Navbar', () => {
  const renderComponent = (authState = { isAuthenticated: false, user: null }) => {
    mockUseAuth.mockReturnValue(authState);
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders login and register links when user is not authenticated', () => {
    renderComponent();

    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
  });

  it('renders user menu when user is authenticated', () => {
    renderComponent({
      isAuthenticated: true,
      user: { name: 'Test User' },
    });

    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
  });

  it('renders property management links when user is authenticated', () => {
    renderComponent({
      isAuthenticated: true,
      user: { name: 'Test User' },
    });

    expect(screen.getByText(/mis propiedades/i)).toBeInTheDocument();
    expect(screen.getByText(/publicar/i)).toBeInTheDocument();
  });

  it('renders navigation links correctly', () => {
    renderComponent();

    const homeLink = screen.getByRole('link', { name: /rentaflex/i });
    const propertiesLink = screen.getByRole('link', { name: /propiedades/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(propertiesLink).toHaveAttribute('href', '/properties');
  });

  it('shows mobile menu when menu button is clicked', () => {
    renderComponent();

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByRole('navigation')).toHaveClass('mobile-menu-open');
  });

  it('hides mobile menu when close button is clicked', () => {
    renderComponent();

    // Abrir menú
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Cerrar menú
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.getByRole('navigation')).not.toHaveClass('mobile-menu-open');
  });
}); 