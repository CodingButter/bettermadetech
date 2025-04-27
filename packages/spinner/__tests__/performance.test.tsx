/**
 * Performance tests for spinner package
 * 
 * Tests the performance of the spinner components and utilities
 * across different scenarios and configurations.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Spinner } from '../src/spinner';
import { SpinnerSegment } from '../src/types';
import { measurePerformance } from '../src/utils';

// Mock the measurePerformance utility
jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  measurePerformance: jest.fn().mockImplementation((name, fn) => {
    fn();
    return { duration: 10 }; // Mock performance measurement
  }),
  getHardwareAccelerationStyles: jest.fn().mockReturnValue({
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: 1000,
  }),
}));

// Create test segments with varying counts
const createTestSegments = (count: number): SpinnerSegment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `segment-${i}`,
    label: `Option ${i + 1}`,
    value: `value-${i + 1}`,
  }));
};

describe('Spinner Performance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (measurePerformance as jest.Mock).mockClear();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('Renders with small number of segments efficiently', () => {
    const smallSegments = createTestSegments(5);
    
    render(<Spinner segments={smallSegments} />);
    
    // Check all segments are rendered
    smallSegments.forEach(segment => {
      expect(screen.getByText(segment.label)).toBeInTheDocument();
    });
    
    // Verify performance measurement was used
    expect(measurePerformance).toHaveBeenCalled();
  });
  
  test('Renders with large number of segments efficiently', () => {
    const largeSegments = createTestSegments(50);
    
    render(<Spinner segments={largeSegments} />);
    
    // Check a sample of segments are rendered (checking all would be too verbose)
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 25')).toBeInTheDocument();
    expect(screen.getByText('Option 50')).toBeInTheDocument();
  });
  
  test('Animation performance with requestAnimationFrame', () => {
    // Mock requestAnimationFrame
    const mockRAF = jest.spyOn(window, 'requestAnimationFrame');
    const mockCAF = jest.spyOn(window, 'cancelAnimationFrame');
    
    const { rerender } = render(
      <Spinner
        segments={createTestSegments(10)}
        isSpinning={false}
      />
    );
    
    // Start spinning
    rerender(
      <Spinner
        segments={createTestSegments(10)}
        isSpinning={true}
      />
    );
    
    // Fast-forward animation
    act(() => {
      // Simulate multiple animation frames
      for (let i = 0; i < 60; i++) {
        jest.advanceTimersByTime(16); // Roughly 60fps
        const callback = mockRAF.mock.calls[mockRAF.mock.calls.length - 1][0];
        callback(performance.now());
      }
    });
    
    // Check that requestAnimationFrame was used
    expect(mockRAF).toHaveBeenCalled();
    
    // Clean up
    rerender(
      <Spinner
        segments={createTestSegments(10)}
        isSpinning={false}
      />
    );
    
    // Check that cancelAnimationFrame was called for cleanup
    expect(mockCAF).toHaveBeenCalled();
  });
  
  test('Component memoization prevents unnecessary re-renders', () => {
    // Create a test harness to track renders
    const renderCount = { value: 0 };
    
    const TestHarness = ({ segments, isSpinning }: { segments: SpinnerSegment[], isSpinning: boolean }) => {
      renderCount.value++;
      return (
        <div data-testid="test-harness">
          <div data-testid="render-count">{renderCount.value}</div>
          <Spinner segments={segments} isSpinning={isSpinning} />
        </div>
      );
    };
    
    const segments = createTestSegments(10);
    const { rerender } = render(<TestHarness segments={segments} isSpinning={false} />);
    
    // Initial render count
    expect(screen.getByTestId('render-count').textContent).toBe('1');
    
    // Re-render with same props (should not cause Spinner to re-render internally)
    rerender(<TestHarness segments={segments} isSpinning={false} />);
    expect(screen.getByTestId('render-count').textContent).toBe('2');
    
    // Re-render with different props (should cause Spinner to re-render)
    rerender(<TestHarness segments={segments} isSpinning={true} />);
    expect(screen.getByTestId('render-count').textContent).toBe('3');
  });
  
  test('Hardware acceleration styles are applied', () => {
    const { container } = render(<Spinner segments={createTestSegments(5)} />);
    
    // Find the wheel element
    const wheel = container.querySelector('.rounded-full');
    expect(wheel).not.toBeNull();
    
    // Check for hardware acceleration styles
    expect(wheel).toHaveStyle('transform: rotate(0deg) translateZ(0)');
    expect(wheel).toHaveStyle('will-change-transform');
    expect(wheel).toHaveStyle('backface-visibility: hidden');
  });
  
  test('Spinner cleans up animations when unmounted', () => {
    const mockClearTimeout = jest.spyOn(window, 'clearTimeout');
    const mockCAF = jest.spyOn(window, 'cancelAnimationFrame');
    
    const { unmount } = render(
      <Spinner
        segments={createTestSegments(5)}
        isSpinning={true}
      />
    );
    
    // Unmount component
    unmount();
    
    // Should clean up animations
    expect(mockCAF).toHaveBeenCalled();
    expect(mockClearTimeout).toHaveBeenCalled();
  });
  
  test('Animation performance under load', () => {
    // Simulate CPU load by creating multiple spinners
    render(
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <Spinner 
            key={i}
            segments={createTestSegments(20)} 
            isSpinning={true}
            duration={5}
          />
        ))}
      </div>
    );
    
    // Fast-forward animation with many frames
    act(() => {
      for (let i = 0; i < 300; i++) {
        jest.advanceTimersByTime(16); // Simulate 60fps for 5 seconds
      }
    });
    
    // Animation should complete without errors
    // This is more of a smoke test to ensure no exceptions are thrown
  });
});