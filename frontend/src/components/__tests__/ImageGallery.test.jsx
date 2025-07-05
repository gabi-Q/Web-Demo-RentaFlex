import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageGallery from '../ImageGallery';

describe('ImageGallery', () => {
  const mockImages = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
  ];

  const renderComponent = (images = mockImages) => {
    return render(<ImageGallery images={images} />);
  };

  it('renders the first image by default', () => {
    renderComponent();

    const mainImage = screen.getByRole('img', { name: /property image/i });
    expect(mainImage).toHaveAttribute('src', 'image1.jpg');
  });

  it('shows navigation buttons when there are multiple images', () => {
    renderComponent();

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('does not show navigation buttons when there is only one image', () => {
    renderComponent(['single-image.jpg']);

    const prevButton = screen.queryByRole('button', { name: /previous/i });
    const nextButton = screen.queryByRole('button', { name: /next/i });

    expect(prevButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });

  it('navigates to next image when next button is clicked', () => {
    renderComponent();

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    const mainImage = screen.getByRole('img', { name: /property image/i });
    expect(mainImage).toHaveAttribute('src', 'image2.jpg');
  });

  it('navigates to previous image when previous button is clicked', () => {
    renderComponent();

    // Primero navegamos a la segunda imagen
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Luego volvemos a la primera
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    const mainImage = screen.getByRole('img', { name: /property image/i });
    expect(mainImage).toHaveAttribute('src', 'image1.jpg');
  });

  it('wraps around when reaching the end of images', () => {
    renderComponent();

    // Navegamos hasta la última imagen
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // image2
    fireEvent.click(nextButton); // image3

    // Al hacer clic en next de nuevo, debería volver a la primera imagen
    fireEvent.click(nextButton);

    const mainImage = screen.getByRole('img', { name: /property image/i });
    expect(mainImage).toHaveAttribute('src', 'image1.jpg');
  });

  it('wraps around when reaching the beginning of images', () => {
    renderComponent();

    // Intentamos ir a la imagen anterior desde la primera
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    const mainImage = screen.getByRole('img', { name: /property image/i });
    expect(mainImage).toHaveAttribute('src', 'image3.jpg');
  });

  it('allows selecting an image from thumbnails', () => {
    renderComponent();

    const thumbnails = screen.getAllByRole('img', { name: /thumbnail/i });
    fireEvent.click(thumbnails[1]); // Seleccionar la segunda imagen

    const mainImage = screen.getByRole('img', { name: /property image/i });
    expect(mainImage).toHaveAttribute('src', 'image2.jpg');
  });
}); 