import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardStats from '../DashboardStats';
import { useMusicStore } from '@/stores/useMusicStore';
vi.mock('@/stores/useMusicStore', () => ({
  useMusicStore: vi.fn()
}));
describe('DashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('displays all stat cards with correct data', () => {
    (useMusicStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      stats: {
        totalSongs: 150,
        totalAlbums: 25,
        totalArtists: 40,
        totalUsers: 1200
      }
    });
    render(<DashboardStats />);
    expect(screen.getByText('Total Songs')).toBeInTheDocument();
    expect(screen.getByText('Total Albums')).toBeInTheDocument();
    expect(screen.getByText('Total Artists')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
  });
  it('displays zeros when stats are not available', () => {
    (useMusicStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      stats: undefined
    });
    render(<DashboardStats />);
    expect(screen.getAllByText('0')).toHaveLength(4);
  });
});
