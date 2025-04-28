import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Spinner } from '../src/spinner';
import { SpinnerSegment } from '../src/types';

// Mock for setTimeout
jest.useFakeTimers();

describe('Spinner Component', () => {
  const mockSegments: SpinnerSegment[] = [
    { id: '1', label: 'Option 1', value: '1' },
    { id: '2', label: 'Option 2', value: '2' },
    { id: '3', label: 'Option 3', value: '3' },
    { id: '4', label: 'Option 4', value: '4' },
  ];
  
  const mockOnSpinEnd = jest.fn();
  
  beforeEach(() => {
    mockOnSpinEnd.mockReset();
    jest.clearAllTimers();
  });
  
  test('renders spinner with correct segments', () => {
    render(
      <Spinner
        segments={mockSegments}
        primaryColor="#ff0000"
        secondaryColor="#00ff00"
        duration={5}
      />
    );
    
    // Check that all segment labels are rendered
    mockSegments.forEach(segment => {
      expect(screen.getByText(segment.label)).toBeInTheDocument();
    });
  });
  
  test('updates animation state when isSpinning changes', () => {
    const { rerender } = render(
      <Spinner
        segments={mockSegments}
        isSpinning={false}
        onSpinEnd={mockOnSpinEnd}
      />
    );
    
    // Initially not spinning
    expect(mockOnSpinEnd).not.toHaveBeenCalled();
    
    // Set to spinning
    rerender(
      <Spinner
        segments={mockSegments}
        isSpinning={true}
        onSpinEnd={mockOnSpinEnd}
      />
    );
    
    // Fast-forward animation duration wrapped in act
    act(() => {
      jest.advanceTimersByTime(5000); // Default duration is 5 seconds
    });
    
    // Should have called the spin end callback
    expect(mockOnSpinEnd).toHaveBeenCalledTimes(1);
    expect(mockOnSpinEnd.mock.calls[0][0]).toHaveProperty('id');
    expect(mockOnSpinEnd.mock.calls[0][0]).toHaveProperty('label');
    expect(mockOnSpinEnd.mock.calls[0][0]).toHaveProperty('value');
  });
  
  test('shows winner when showWinner is true and spinning has completed', () => {
    const { rerender } = render(
      <Spinner
        segments={mockSegments}
        isSpinning={true}
        onSpinEnd={mockOnSpinEnd}
        showWinner={true}
      />
    );
    
    // Winner should not be visible while spinning
    expect(screen.queryByText('Winner!')).not.toBeInTheDocument();
    
    // Fast-forward animation duration wrapped in act
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Force re-render to simulate the component updating after state changes
    // This is needed because we're using fake timers and the component state
    // update triggered by setTimeout doesn't automatically cause a re-render in tests
    rerender(
      <Spinner
        segments={mockSegments}
        isSpinning={false}
        onSpinEnd={mockOnSpinEnd}
        showWinner={true}
      />
    );
    
    // Winner should be visible after spinning completes
    expect(screen.getByText('Winner!')).toBeInTheDocument();
  });
  
  test('applies custom styles and classes', () => {
    const customClassName = 'custom-spinner-class';
    const customPrimaryColor = '#123456';
    const customSecondaryColor = '#654321';
    
    const { container } = render(
      <Spinner
        segments={mockSegments}
        primaryColor={customPrimaryColor}
        secondaryColor={customSecondaryColor}
        className={customClassName}
      />
    );
    
    // Check if custom class is applied to the container
    expect(container.firstChild).toHaveClass('relative');
    expect(container.firstChild).toHaveClass(customClassName);
    
    // Check that segments are rendered
    mockSegments.forEach(segment => {
      expect(screen.getByText(segment.label)).toBeInTheDocument();
    });
  });
});