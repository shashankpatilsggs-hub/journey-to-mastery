import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalanceDisplay } from '../src/components/BalanceDisplay';
import React from 'react';

describe('BalanceDisplay Component', () => {
  it('renders disconnected state correctly', () => {
    render(
      <BalanceDisplay 
        balance={null} 
        isFunded={false} 
        isLoading={false} 
        onRefresh={vi.fn()} 
        publicKey={null} 
      />
    );
    expect(screen.getByText(/Balance Unavailable/i)).toBeDefined();
  });

  it('renders balance correctly when funded', () => {
    render(
      <BalanceDisplay 
        balance="100.5" 
        isFunded={true} 
        isLoading={false} 
        onRefresh={vi.fn()} 
        publicKey="GAX..." 
      />
    );
    expect(screen.getByText('100.5')).toBeDefined();
    expect(screen.getByText('XLM')).toBeDefined();
  });

  it('renders unfunded warning correctly', () => {
    render(
      <BalanceDisplay 
        balance="0" 
        isFunded={false} 
        isLoading={false} 
        onRefresh={vi.fn()} 
        publicKey="GAX..." 
      />
    );
    expect(screen.getByText(/Account not activated/i)).toBeDefined();
  });
});
