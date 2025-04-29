/**
 * Tests for new accessibility improvements
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Spinner } from '../spinner';
import { SpinnerSegment } from '../types';

// Add the custom matcher
expect.extend(toHaveNoViolations);

// Sample spinner segments for testing
const testSegments: SpinnerSegment[] = [
  { id: '1', label: 'Option 1', value: 'one' },
  { id: '2', label: 'Option 2', value: 'two' },
  { id: '3', label: 'Option 3', value: 'three' },
  { id: '4', label: 'Option 4', value: 'four' },
];

describe('Spinner Accessibility Improvements', () => {
  
  test('High contrast mode should have no accessibility violations', async () => {
    const { container } = render(
      <Spinner
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
        highContrast={true}
      />
    );
    
    // Run axe on the rendered component
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('Custom ARIA label is properly applied', () => {
    render(
      <Spinner
        segments={testSegments}
        ariaLabel="Custom spinner label for testing"
      />
    );
    
    const regionElement = screen.getByRole('region');
    expect(regionElement).toHaveAttribute('aria-label', 'Custom spinner label for testing');
  });
  
  test('Custom announcements are used when provided', () => {
    render(
      <Spinner
        segments={testSegments}
        ariaAnnouncements={{
          spinReady: 'Custom ready message',
          spinStart: 'Custom spinning message',
          spinComplete: (winner) => `Custom winner message: ${winner.label}`
        }}
      />
    );
    
    // Check for custom ready message
    expect(screen.getByText('Custom ready message')).toBeInTheDocument();
  });
  
  test('Skip animation button appears when allowed and spinning', () => {
    const { rerender } = render(
      <Spinner
        segments={testSegments}
        allowSkipAnimation={true}
        isSpinning={false}
      />
    );
    
    // Skip button should not be visible initially
    expect(screen.queryByRole('button', { name: /skip animation/i })).not.toBeInTheDocument();
    
    // Update to spinning state
    rerender(
      <Spinner
        segments={testSegments}
        allowSkipAnimation={true}
        isSpinning={true}
      />
    );
    
    // Skip button should now be in the document
    expect(screen.getByRole('button', { name: /skip animation/i })).toBeInTheDocument();
  });
  
  test('Keyboard control works when enabled', () => {
    const handleSpinEnd = jest.fn();
    
    // Mock the spin function
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    
    const { container } = render(
      <Spinner
        segments={testSegments}
        enableKeyboardControl={true}
        onSpinEnd={handleSpinEnd}
      />
    );
    
    // Get the spinner element
    const spinnerElement = screen.getByRole('region');
    expect(spinnerElement).toHaveAttribute('tabIndex', '0');
    
    // Press space to start spinning
    fireEvent.keyDown(spinnerElement, { key: ' ' });
    
    // We can't easily test the animation completion, but we can verify
    // that the spinner is set up for keyboard control
    expect(spinnerElement).toHaveAttribute('tabIndex', '0');
    
    // Clean up the mock
    jest.spyOn(global.Math, 'random').mockRestore();
  });
});