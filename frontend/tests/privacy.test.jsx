import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';

describe('privacy boundary', () => {
  it('does not make a network request when a password is typed', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<App />);
    const passwordInput = screen.getByLabelText('Enter a synthetic password');
    fireEvent.change(passwordInput, { target: { value: 'SYNTHETIC-PRIVACY-MARKER-123!' } });
    expect(await screen.findByText('Good structure. Keep it unique to this service and protect it with MFA.')).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('keeps the analyzer functional with the bundled content', async () => {
    render(<App />);
    expect(await screen.findByText('Your secret never becomes telemetry.')).toBeInTheDocument();
    expect(screen.getByText('Bundled education')).toBeInTheDocument();
  });
});
