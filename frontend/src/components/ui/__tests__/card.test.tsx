import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card';
describe('Card Components', () => {
  describe('Card Component', () => {
    it('renders card with default classes', () => {
      render(<Card data-testid="card">Card Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-xl');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('bg-card');
      expect(card).toHaveClass('text-card-foreground');
      expect(card).toHaveClass('shadow');
    });
    it('merges custom className with default classes', () => {
      render(<Card data-testid="card" className="custom-class">Card Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-xl');
      expect(card).toHaveClass('custom-class');
    });
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Card Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
    it('passes additional props to the div element', () => {
      render(<Card aria-label="test-card" data-custom="value">Card Content</Card>);
      const card = screen.getByText('Card Content');
      expect(card).toHaveAttribute('aria-label', 'test-card');
      expect(card).toHaveAttribute('data-custom', 'value');
    });
  });
  describe('CardHeader Component', () => {
    it('renders with default classes', () => {
      render(<CardHeader data-testid="header">Header Content</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('flex-col');
      expect(header).toHaveClass('space-y-1.5');
      expect(header).toHaveClass('p-6');
    });
    it('merges custom className with default classes', () => {
      render(<CardHeader data-testid="header" className="custom-class">Header Content</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('custom-class');
    });
  });
  describe('CardFooter Component', () => {
    it('renders with default classes', () => {
      render(<CardFooter data-testid="footer">Footer Content</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('items-center');
      expect(footer).toHaveClass('p-6');
      expect(footer).toHaveClass('pt-0');
    });
    it('merges custom className with default classes', () => {
      render(<CardFooter data-testid="footer" className="custom-class">Footer Content</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('custom-class');
    });
  });
  describe('CardTitle Component', () => {
    it('renders with default classes', () => {
      render(<CardTitle data-testid="title">Title Content</CardTitle>);
      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('leading-none');
      expect(title).toHaveClass('tracking-tight');
    });
    it('merges custom className with default classes', () => {
      render(<CardTitle data-testid="title" className="custom-class">Title Content</CardTitle>);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('custom-class');
    });
  });
  describe('CardDescription Component', () => {
    it('renders with default classes', () => {
      render(<CardDescription data-testid="description">Description Content</CardDescription>);
      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-muted-foreground');
    });
    it('merges custom className with default classes', () => {
      render(<CardDescription data-testid="description" className="custom-class">Description Content</CardDescription>);
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('custom-class');
    });
  });
  describe('CardContent Component', () => {
    it('renders with default classes', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6');
      expect(content).toHaveClass('pt-0');
    });
    it('merges custom className with default classes', () => {
      render(<CardContent data-testid="content" className="custom-class">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('p-6');
      expect(content).toHaveClass('custom-class');
    });
  });
  describe('Card Composition', () => {
    it('composes card components correctly', () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Card Title</CardTitle>
            <CardDescription data-testid="description">Card Description</CardDescription>
          </CardHeader>
          <CardContent data-testid="content">Card Content Here</CardContent>
          <CardFooter data-testid="footer">Card Footer</CardFooter>
        </Card>
      );
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('description')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Content Here')).toBeInTheDocument();
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });
  });
});
