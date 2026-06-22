import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

const trigFixture = {
  topic: 'trig',
  title: 'Understanding sine through the unit circle',
  summary: 'Fixture lesson',
  concepts: ['unit circle', 'projection'],
  controls: { angleDegrees: 45 },
  views: {
    graphical: { kind: 'trig', title: 'Trig graph', angleDegrees: 45, trigFunction: 'sin' },
    numerical: { title: 'Values', metrics: [{ label: 'Angle', value: '45°' }], trigTable: [] },
    explanation: { title: 'Explain', blocks: [{ title: 'Projection', body: 'Body' }] },
  },
  steps: [
    { id: 'a', title: 'Angle', detail: 'Inspect the angle', focus: ['angle'] },
    { id: 'b', title: 'Projection', detail: 'Inspect projections', focus: ['projection'] },
  ],
};

describe('App', () => {
  it('renders a lesson from the backend and updates step focus', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => trigFixture,
    }));

    render(<App />);

    expect(await screen.findByText('Understanding sine through the unit circle')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /projection/i }));
    expect(screen.getByText('Step 2 of 2')).toBeInTheDocument();
  });
});
