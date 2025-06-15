import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';
import { Music } from 'lucide-react';

// Test uses Music icon from lucide-react

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
    
    // Check if label and value are displayed
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    
    // Check if StatsCard was rendered using our data-testid
    const card = screen.getByTestId('stats-card');
    expect(card).toBeInTheDocument();
    
    // Check for the background color class on an element
    // The background color is on a div inside the card content
    // Using querySelector to find the div with p-3 class which holds the background color
    const iconContainer = screen.getByTestId('stats-card').querySelector('.p-3');
    expect(iconContainer).not.toBeNull();
    
    // Check the className directly for our bg color
    expect(iconContainer?.className).toContain('bg-emerald-500');
    
    // Check for the icon color class
    // For SVG elements, we need to get the class attribute directly
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
    
    // Verify component rendered
    expect(screen.getByText('Custom Colors')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    
    // Check the background color using a safer approach
    // The background color is on a div with p-3 class inside the card content
    const iconContainer = screen.getByTestId('stats-card').querySelector('.p-3');
    expect(iconContainer).not.toBeNull();
    
    // Check the className directly for our bg color
    expect(iconContainer?.className).toContain('bg-blue-300');
    
    // Check the icon color 
    // For SVG elements, we need to get the class attribute directly
    const icon = iconContainer?.querySelector('svg');
    expect(icon).not.toBeNull();
    const iconClasses = icon?.getAttribute('class') || '';
    expect(iconClasses).toContain('text-blue-600');
  });
});
