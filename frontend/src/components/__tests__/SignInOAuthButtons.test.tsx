import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignInOAuthButtons from '../SignInOAuthButtons';
import { useSignIn } from '@clerk/clerk-react';
vi.mock('@clerk/clerk-react', () => ({
  useSignIn: vi.fn()
}));
describe('SignInOAuthButtons Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render nothing when clerk is not loaded', () => {
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: false,
      signIn: {}
    });
    const { container } = render(<SignInOAuthButtons />);
    expect(container.firstChild).toBeNull();
  });
  it('should render the Google sign in button when clerk is loaded', () => {
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: true,
      signIn: {
        authenticateWithRedirect: vi.fn()
      }
    });
    render(<SignInOAuthButtons />);
    const button = screen.getByRole('button', { name: /continue with google/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('border-zinc-200');
    expect(button.className).toContain('text-white');
  });
  it('should call authenticateWithRedirect with correct params when button is clicked', () => {
    const authenticateWithRedirect = vi.fn();
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: true,
      signIn: {
        authenticateWithRedirect
      }
    });
    render(<SignInOAuthButtons />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(authenticateWithRedirect).toHaveBeenCalledTimes(1);
    expect(authenticateWithRedirect).toHaveBeenCalledWith({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/auth-callback'
    });
  });
  it('should have the correct styling for the button', () => {
    (useSignIn as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoaded: true,
      signIn: {
        authenticateWithRedirect: vi.fn()
      }
    });
    render(<SignInOAuthButtons />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('border-zinc-200');
    expect(button).toHaveClass('h-11');
  });
});
