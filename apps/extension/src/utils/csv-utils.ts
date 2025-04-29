/**
 * CSV parsing and handling utilities
 * Provides functionality for parsing, validating, and transforming CSV data
 * for use with the Winner Spinner extension
 */

import { type SpinnerSegment } from '@repo/spinner';

/**
 * Represents a successfully parsed CSV file
 */
export interface ParsedCSV {
  /** Column headers from the CSV */
  headers: string[];
  /** Row data as arrays of strings */
  rows: string[][];
  /** Original raw CSV text */
  rawCSV: string;
}

/**
 * Result of a CSV parse operation
 */
export interface CSVParseResult {
  /** Whether parsing was successful */
  success: boolean;
  /** Parsed CSV data if successful */
  data?: ParsedCSV;
  /** Error message if unsuccessful */
  error?: string;
}

/**
 * Configuration for mapping CSV columns to spinner segments
 */
export interface CSVMappingConfig {
  /** Column index to use for segment labels */
  labelColumn: number;
  /** Column index to use for segment values (optional) */
  valueColumn?: number;
  /** Column index to use for segment weights (optional) */
  weightColumn?: number;
  /** Whether to skip the header row */
  skipHeader: boolean;
}

/**
 * Extended spinner segment with optional weight property
 */
export interface ExtendedSpinnerSegment extends SpinnerSegment {
  /** Optional weight for determining segment size */
  weight?: number;
}

/**
 * Parse a CSV string into structured data
 * 
 * @param csvText - Raw CSV text to parse
 * @param delimiter - Character used to separate values (default: comma)
 * @returns Result of the parsing operation
 */
export function parseCSV(csvText: string, delimiter = ','): CSVParseResult {
  try {
    if (!csvText || typeof csvText !== 'string') {
      return {
        success: false,
        error: 'No CSV content provided'
      };
    }

    // Split into rows and handle different line endings
    const rows = csvText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .filter(row => row.trim() !== ''); // Remove empty rows

    if (rows.length === 0) {
      return {
        success: false,
        error: 'CSV contains no data'
      };
    }

    // Parse rows into columns
    const parsedRows = rows.map(row => {
      // Handle quoted values with embedded delimiters
      const result: string[] = [];
      let inQuote = false;
      let currentValue = '';
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        const nextChar = row[i + 1];
        
        if (char === '"' && !inQuote) {
          inQuote = true;
          continue;
        }
        
        if (char === '"' && inQuote) {
          // Handle escaped quotes (two double quotes in a row)
          if (nextChar === '"') {
            currentValue += '"';
            i++; // Skip the next quote
          } else {
            inQuote = false;
          }
          continue;
        }
        
        if (char === delimiter && !inQuote) {
          result.push(currentValue);
          currentValue = '';
          continue;
        }
        
        currentValue += char;
      }
      
      // Push the last value
      result.push(currentValue);
      
      return result;
    });

    const headers = parsedRows[0];
    
    // Validate that all rows have the same number of columns
    const headerCount = headers.length;
    const invalidRows = parsedRows.slice(1).filter(row => row.length !== headerCount);
    
    if (invalidRows.length > 0) {
      return {
        success: false,
        error: `CSV contains rows with inconsistent column counts. Expected ${headerCount} columns in each row.`
      };
    }

    return {
      success: true,
      data: {
        headers,
        rows: parsedRows.slice(1),
        rawCSV: csvText
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Convert parsed CSV data to spinner segments using column mapping
 * 
 * @param csvData - Parsed CSV data
 * @param mapping - Configuration for mapping columns to segment properties
 * @returns Array of SpinnerSegment objects
 */
export function csvToSpinnerSegments(csvData: ParsedCSV, mapping: CSVMappingConfig): SpinnerSegment[] {
  if (!csvData || !csvData.rows || !Array.isArray(csvData.rows)) {
    throw new Error('Invalid CSV data');
  }

  // Validate column indexes
  const columnCount = csvData.headers.length;
  if (
    mapping.labelColumn < 0 || 
    mapping.labelColumn >= columnCount ||
    (mapping.valueColumn !== undefined && (mapping.valueColumn < 0 || mapping.valueColumn >= columnCount)) ||
    (mapping.weightColumn !== undefined && (mapping.weightColumn < 0 || mapping.weightColumn >= columnCount))
  ) {
    throw new Error('Invalid column mapping: column index out of range');
  }

  // Process rows and convert to segments
  const rows = mapping.skipHeader ? csvData.rows : [csvData.headers, ...csvData.rows];
  
  return rows.map((row, index) => {
    // Create segment with required properties
    const segment: SpinnerSegment = {
      id: `segment-${index}`,
      label: row[mapping.labelColumn] || `Item ${index + 1}`,
      value: mapping.valueColumn !== undefined ? row[mapping.valueColumn] : `Item ${index + 1}`
    };

    // Create extended segment to handle weight if needed
    const extendedSegment: ExtendedSpinnerSegment = segment;

    // Add optional weight if specified in mapping
    if (mapping.weightColumn !== undefined) {
      const weightValue = row[mapping.weightColumn];
      if (weightValue && !isNaN(Number(weightValue))) {
        extendedSegment.weight = Number(weightValue);
      }
    }

    return segment;
  });
}

/**
 * Read a CSV file and parse it
 * 
 * @param file - CSV file to read
 * @returns Promise resolving to the parse result
 */
export function readCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    if (!file) {
      resolve({
        success: false,
        error: 'No file provided'
      });
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      resolve({
        success: false,
        error: 'File must be a CSV'
      });
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(parseCSV(content));
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read file'
      });
    };
    
    reader.readAsText(file);
  });
}