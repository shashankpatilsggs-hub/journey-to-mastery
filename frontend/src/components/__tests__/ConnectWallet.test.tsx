import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectWallet } from '../ConnectWallet';
import { useWallet } from '@/contexts/WalletContext';

// Mock the context
jest.mock('@/contexts/WalletContext', () => ({
  useWallet: jest.fn(),
}));

describe('ConnectWallet Component', () => {
  it('renders Connect Wallet button when disconnected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      address: null,
      isConnecting: false,
      connect: jest.fn(),
    });

    render(<ConnectWallet />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('renders Connecting state', () => {
    (useWallet as jest.Mock).mockReturnValue({
      address: null,
      isConnecting: true,
      connect: jest.fn(),
    });

    render(<ConnectWallet />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('renders formatted address and disconnect button when connected', () => {
    const mockDisconnect = jest.fn();
    (useWallet as jest.Mock).mockReturnValue({
      address: 'GCO2YQ3J2B3U567890ABCDEF1234567890ABCDEF1234567890ABCD',
      isConnecting: false,
      disconnect: mockDisconnect,
    });

    render(<ConnectWallet />);
    // "GCO2Y...ABCD"
    expect(screen.getByText('GCO2Y...ABCD')).toBeInTheDocument();
    
    const disconnectBtn = screen.getByText('Disconnect');
    expect(disconnectBtn).toBeInTheDocument();
    
    fireEvent.click(disconnectBtn);
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
