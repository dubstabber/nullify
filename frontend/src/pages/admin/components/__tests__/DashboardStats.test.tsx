import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardStats from '../DashboardStats';
import { useMusicStore } from '@/stores/useMusicStore';

// Mock the useMusicStore hook
vi.mock('@/stores/useMusicStore', () => ({
  useMusicStore: vi.fn()
}));

describe('DashboardStats', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });
  
  it('displays all stat cards with correct data', () => {
    // Mock the stats from useMusicStore
    (useMusicStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      stats: {
        totalSongs: 150,
        totalAlbums: 25,
        totalArtists: 40,
        totalUsers: 1200
      }
    });
    
    render(<DashboardStats />);
    
    // Check if all stat labels are rendered
    expect(screen.getByText('Total Songs')).toBeInTheDocument();
    expect(screen.getByText('Total Albums')).toBeInTheDocument();
    expect(screen.getByText('Total Artists')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    
    // Check if stat values are rendered correctly
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument(); // Uses toLocaleString()
  });
  
  it('displays zeros when stats are not available', () => {
    // Mock empty stats
    (useMusicStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      stats: undefined
    });
    
    render(<DashboardStats />);
    
    // Each stat should display "0" as default
    expect(screen.getAllByText('0')).toHaveLength(4);
  });
});
