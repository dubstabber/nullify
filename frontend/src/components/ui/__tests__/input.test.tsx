import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../input';
describe('Input Component', () => {
  it('renders input correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });
  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('custom-class');
  });
  it('applies different input types correctly', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    rerender(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
  });
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
  it('forwards additional props correctly', () => {
    render(
      <Input 
        id="test-id" 
        name="test-name" 
        required
        aria-label="test-label"
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-id');
    expect(input).toHaveAttribute('name', 'test-name');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-label', 'test-label');
  });
  it('applies disabled state correctly', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input.className).toContain('disabled:opacity-50');
    expect(input.className).toContain('disabled:cursor-not-allowed');
  });
  it('handles change events correctly', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });
  it('handles focus and blur events correctly', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
  it('applies focus-visible styles on focus', async () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('focus-visible:ring-1');
    expect(input.className).toContain('focus-visible:ring-ring');
  });
});
