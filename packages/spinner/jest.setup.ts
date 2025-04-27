import '@testing-library/jest-dom';

// Mock localStorage for tests
class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};
  
  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
  
  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Set up localStorage mock
global.localStorage = new LocalStorageMock();

// Silence React 18 console errors/warnings for tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning: ReactDOM.render is no longer supported/.test(args[0]) ||
    /Warning: An update to Component inside a test was not wrapped in act/.test(args[0]) ||
    /Warning: The current testing environment is not configured to support act/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args: any[]) => {
  if (
    /Warning: ReactDOM.render is no longer supported/.test(args[0]) ||
    /Warning: An update to Component inside a test was not wrapped in act/.test(args[0])
  ) {
    return;
  }
  originalConsoleWarn(...args);
};