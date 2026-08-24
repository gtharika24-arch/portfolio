import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio hero content and chess widget', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /tharika g/i, level: 1 })).toBeInTheDocument();
  expect(screen.getByText(/selected work/i)).toBeInTheDocument();
  expect(screen.getByText(/immortal game/i)).toBeInTheDocument();
});
