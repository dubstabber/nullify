import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';
import { Music } from 'lucide-react';
describe('StatsCard', () => {
  it('renders the card with correct props', () => {
    const props = {
      icon: Music,
      label: 'Test Label',
      value: '100',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500'
    };
    render(<StatsCard {...props} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    const card = screen.getByTestId('stats-card');
    expect(card).toBeInTheDocument();
    const iconContainer = screen.getByTestId('stats-card').querySelector('.p-3');
    expect(iconContainer).not.toBeNull();
    expect(iconContainer?.className).toContain('bg-emerald-500');
    const icon = iconContainer?.querySelector('svg');
    expect(icon).not.toBeNull();
    const iconClasses = icon?.getAttribute('class') || '';
    expect(iconClasses).toContain('text-emerald-500');
  });
  it('applies custom background and icon colors', () => {
    const props = {
      icon: Music,
      label: 'Custom Colors',
      value: '200',
      bgColor: 'bg-blue-300/20',
      iconColor: 'text-blue-600'
    };
    render(<StatsCard {...props} />);
    expect(screen.getByText('Custom Colors')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    const iconContainer = screen.getByTestId('stats-card').querySelector('.p-3');
    expect(iconContainer).not.toBeNull();
    expect(iconContainer?.className).toContain('bg-blue-300');
    const icon = iconContainer?.querySelector('svg');
    expect(icon).not.toBeNull();
    const iconClasses = icon?.getAttribute('class') || '';
    expect(iconClasses).toContain('text-blue-600');
  });
});
