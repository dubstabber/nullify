// React is used implicitly in JSX
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignInOAuthButtons from '../SignInOAuthButtons';
import { useSignIn } from '@clerk/clerk-react';

// Mock the Clerk library
vi.mock('@clerk/clerk-react', () => ({
  useSignIn: vi.fn()
}));

describe('SignInOAuthButtons Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when clerk is not loaded', () => {
    // Mock useSignIn to return isLoaded: false
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: false,
      signIn: {}
    });

    const { container } = render(<SignInOAuthButtons />);
    
    // Component should render nothing
    expect(container.firstChild).toBeNull();
  });

  it('should render the Google sign in button when clerk is loaded', () => {
    // Mock useSignIn to return isLoaded: true
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: true,
      signIn: {
        authenticateWithRedirect: vi.fn()
      }
    });

    render(<SignInOAuthButtons />);
    
    // Button should be rendered with correct text
    const button = screen.getByRole('button', { name: /continue with google/i });
    expect(button).toBeInTheDocument();
    
    // Button should have the secondary variant class
    expect(button.className).toContain('border-zinc-200');
    expect(button.className).toContain('text-white');
  });

  it('should call authenticateWithRedirect with correct params when button is clicked', () => {
    // Create a mock for authenticateWithRedirect
    const authenticateWithRedirect = vi.fn();
    
    // Mock useSignIn with the mock function
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: true,
      signIn: {
        authenticateWithRedirect
      }
    });

    render(<SignInOAuthButtons />);
    
    // Get and click the button
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Check if authenticateWithRedirect was called with correct parameters
    expect(authenticateWithRedirect).toHaveBeenCalledTimes(1);
    expect(authenticateWithRedirect).toHaveBeenCalledWith({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/auth-callback'
    });
  });

  it('should have the correct styling for the button', () => {
    // Mock useSignIn
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: true,
      signIn: {
        authenticateWithRedirect: vi.fn()
      }
    });

    render(<SignInOAuthButtons />);
    
    const button = screen.getByRole('button');
    
    // Check button styling
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('border-zinc-200');
    expect(button).toHaveClass('h-11');
  });
});
