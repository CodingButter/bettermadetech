/**
 * Accessibility tests for the spinner component
 * Tests ARIA attributes and keyboard navigation
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Spinner } from '../src/spinner';
import { Spinner3D } from '../src/3d-spinner';
import { SpinnerSegment } from '../src/types';

// Add the custom matcher
expect.extend(toHaveNoViolations);

// Sample spinner segments for testing
const testSegments: SpinnerSegment[] = [
  { id: '1', label: 'Option 1', value: 'one' },
  { id: '2', label: 'Option 2', value: 'two' },
  { id: '3', label: 'Option 3', value: 'three' },
  { id: '4', label: 'Option 4', value: 'four' },
];

describe('Spinner Accessibility', () => {
  
  test('Spinner should have no accessibility violations', async () => {
    const { container } = render(
      <Spinner
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
      />
    );
    
    // Run axe on the rendered component
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('Spinner should have proper ARIA attributes', () => {
    render(
      <Spinner
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
      />
    );
    
    // Check for proper ARIA roles and labels
    const regionElement = screen.getByRole('region');
    expect(regionElement).toHaveAttribute('aria-label', 'Spinner wheel');
    expect(regionElement).toHaveAttribute('aria-live', 'polite');
    
    // Check for img role on the wheel
    const wheelElement = screen.getByRole('img');
    expect(wheelElement).toHaveAttribute('aria-label', expect.stringContaining('Spinner wheel with'));
  });
  
  test('Spinner should have screen reader text', () => {
    render(
      <Spinner
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
      />
    );
    
    // Check for screen reader text
    const srElement = screen.getByText('Spinner ready to spin');
    expect(srElement).toHaveClass('sr-only');
  });
  
  test('Spinner should update ARIA attributes when spinning', () => {
    const { rerender } = render(
      <Spinner
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
        isSpinning={false}
      />
    );
    
    // Check initial state
    const regionElement = screen.getByRole('region');
    expect(regionElement).toHaveAttribute('aria-live', 'polite');
    
    // Update to spinning state
    rerender(
      <Spinner
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
        isSpinning={true}
      />
    );
    
    // Check updated attributes
    expect(regionElement).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByText('Spinner is currently spinning')).toBeInTheDocument();
  });
});

describe('3D Spinner Accessibility', () => {
  
  test('3D Spinner should have no accessibility violations', async () => {
    const { container } = render(
      <Spinner3D
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
      />
    );
    
    // Run axe on the rendered component
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('3D Spinner should have proper ARIA attributes', () => {
    render(
      <Spinner3D
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
      />
    );
    
    // Check for proper ARIA roles and labels
    const regionElement = screen.getByRole('region');
    expect(regionElement).toHaveAttribute('aria-label', '3D Spinner wheel');
    expect(regionElement).toHaveAttribute('aria-live', 'polite');
    
    // Check for img role on the wheel
    const wheelElement = screen.getByRole('img');
    expect(wheelElement).toHaveAttribute('aria-label', expect.stringContaining('3D Spinner wheel with'));
  });
  
  test('3D Spinner should have screen reader text', () => {
    render(
      <Spinner3D
        segments={testSegments}
        duration={5}
        primaryColor="#4f46e5"
        secondaryColor="#f97316"
      />
    );
    
    // Check for screen reader text
    const srElement = screen.getByText('Spinner ready to spin');
    expect(srElement).toHaveClass('sr-only');
  });
});