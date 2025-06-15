import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Button, buttonVariants } from '../button';
import { Slot } from '@radix-ui/react-slot';

// Mock Radix UI Slot component
vi.mock('@radix-ui/react-slot', () => ({
  Slot: vi.fn(({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
    <div data-testid="slot-component" {...props}>
      {children}
    </div>
  ))
}));

describe('Button Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders button correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('bg-primary');
  });
  
  it('renders button with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    
    let button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-secondary');
    
    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button', { name: /ghost/i });
    expect(button).toHaveClass('hover:bg-accent');
    
    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole('button', { name: /link/i });
    expect(button).toHaveClass('text-primary');
  });
  
  it('renders button with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    
    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('text-xs');
    
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-8');
  });
  
  it('renders as a different element using asChild', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    );
    
    // When asChild is true, it uses Slot which we mocked
    const slotComponent = screen.getByTestId('slot-component');
    expect(slotComponent).toBeInTheDocument();
    
    const linkElement = screen.getByText(/link button/i);
    expect(linkElement.tagName).toBe('A');
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
  });
  
  it('applies additional className', () => {
    render(<Button className="test-class">Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('test-class');
    expect(button).toHaveClass('bg-primary'); // Should also maintain default classes
  });
  
  it('forwards ref to button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Click me</Button>);
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    // The disabled class is in the base styles using a CSS modifier
    expect(button.className).toContain('disabled:opacity-50');
  });
  
  it('supports buttonVariants function for styling', () => {
    const classes = buttonVariants({ variant: 'outline', size: 'sm' });
    
    expect(classes).toContain('border');
    expect(classes).toContain('h-8');
    expect(classes).toContain('px-3');
    expect(classes).toContain('text-xs');
  });
});
