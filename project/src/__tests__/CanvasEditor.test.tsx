import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
vi.mock('fabric', () => ({ fabric: { Canvas: class {} } }));
import CanvasEditor from '../components/CanvasEditor';
import { ProjectImage } from '../context/ProjectContext';

const image: ProjectImage = {
  id: '1',
  dataUrl: 'data:image/png;base64,',
  name: 'test.png',
  timestamp: Date.now(),
};

describe.skip('CanvasEditor', () => {
  it('renders canvas element', () => {
    render(<CanvasEditor image={image} setCanvasRef={() => {}} />);
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });
});
