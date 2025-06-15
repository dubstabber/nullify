import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Topbar from '../Topbar';
import { useAuthStore } from '@/stores/useAuthStore';
vi.mock('@clerk/clerk-react', () => ({
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-out">{children}</div>
  ),
  UserButton: () => <div data-testid="user-button">User Button</div>
}));
vi.mock('@/stores/useAuthStore');
vi.mock('../SignInOAuthButtons', () => ({
  __esModule: true,
  default: () => <div data-testid="sign-in-buttons">Sign In Buttons</div>
}));
describe('Topbar Component', () => {
  const mockUseAuthStore = useAuthStore as unknown as ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      isAdmin: false,
      isLoading: false,
      checkAdminStatus: vi.fn(),
      reset: vi.fn()
    });
  });
  it('renders the logo and navigation', () => {
    render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>
    );
    expect(screen.getByAltText('Spotify logo')).toBeInTheDocument();
    expect(screen.getByText('Nullify')).toBeInTheDocument();
  });
  it('does not show admin link for non-admin users', () => {
    mockUseAuthStore.mockReturnValue({
      isAdmin: false,
      isLoading: false,
      checkAdminStatus: vi.fn(),
      reset: vi.fn()
    });
    render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>
    );
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
  });
  it('shows admin link for admin users', () => {
    mockUseAuthStore.mockReturnValue({
      isAdmin: true,
      isLoading: false,
      checkAdminStatus: vi.fn(),
      reset: vi.fn()
    });
    render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });
  it('renders UserButton when user is signed in', () => {
    render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>
    );
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
  it('renders sign-in buttons in the signed-out context', () => {
    render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>
    );
    expect(screen.getByTestId('signed-out')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-buttons')).toBeInTheDocument();
  });
});
