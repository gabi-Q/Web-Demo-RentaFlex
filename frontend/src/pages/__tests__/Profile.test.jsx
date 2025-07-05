import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../Profile';

// Mock del contexto de autenticación
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      _id: '123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '123456789',
    },
    isAuthenticated: true,
  }),
}));

// Mock del servicio de usuarios
vi.mock('../../services/userService', () => ({
  updateProfile: vi.fn(),
}));

describe('Profile', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
  };

  it('renders profile form with user information', () => {
    renderComponent();

    expect(screen.getByText(/perfil/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue('123456789');
  });

  it('shows validation errors for empty fields', async () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(phoneInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el correo electrónico es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el teléfono es requerido/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
    });
  });

  it('handles successful profile update', async () => {
    const { updateProfile } = require('../../services/userService');
    updateProfile.mockResolvedValue({
      name: 'Updated User',
      email: 'updated@example.com',
      phone: '987654321',
    });

    renderComponent();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    fireEvent.change(nameInput, { target: { value: 'Updated User' } });
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '987654321' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        name: 'Updated User',
        email: 'updated@example.com',
        phone: '987654321',
      });
      expect(screen.getByText(/perfil actualizado exitosamente/i)).toBeInTheDocument();
    });
  });

  it('shows error message on update failure', async () => {
    const { updateProfile } = require('../../services/userService');
    updateProfile.mockRejectedValue(new Error('Update failed'));

    renderComponent();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    fireEvent.change(nameInput, { target: { value: 'Updated User' } });
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '987654321' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error al actualizar el perfil/i)).toBeInTheDocument();
    });
  });

  it('handles password change', async () => {
    const { updateProfile } = require('../../services/userService');
    updateProfile.mockResolvedValue({});

    renderComponent();

    const passwordInput = screen.getByLabelText(/nueva contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456789',
        password: 'newpassword123',
      });
    });
  });

  it('shows validation error for password mismatch', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/nueva contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different-password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('redirects to login when not authenticated', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({ isAuthenticated: false });

    renderComponent();

    expect(window.location.pathname).toBe('/login');
  });
}); 