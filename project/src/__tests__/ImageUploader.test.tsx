import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ImageUploader from '../components/ImageUploader';

describe('ImageUploader', () => {
  it('renders upload button', () => {
    render(<ImageUploader onImageUploaded={vi.fn()} />);
    expect(screen.getByText('Parcourir')).toBeInTheDocument();
  });
});
