import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Button } from '@repo/ui/button';
import { readCSVFile, type ParsedCSV, type CSVMappingConfig, csvToSpinnerSegments } from '../utils/csv-utils';
import { SpinnerSegment } from '@repo/spinner';

interface CSVUploadProps {
  /** Callback function triggered when segments are generated */
  onSegmentsGenerated: (segments: SpinnerSegment[]) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * CSV upload component with drag and drop functionality
 * Provides a user interface for uploading, parsing, and mapping CSV files
 * to spinner segments.
 */
export const CSVUpload: React.FC<CSVUploadProps> = ({ onSegmentsGenerated, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapping, setMapping] = useState<CSVMappingConfig>({
    labelColumn: 0,
    valueColumn: 1,
    skipHeader: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input change
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    try {
      const result = await readCSVFile(file);
      
      if (!result.success || !result.data) {
        setError(result.error || 'Failed to parse CSV file');
        setCsvData(null);
        return;
      }
      
      setCsvData(result.data);
      
      // Default mapping to first column for label, second for value if available
      setMapping({
        labelColumn: 0,
        valueColumn: result.data.headers.length > 1 ? 1 : undefined,
        skipHeader: true
      });
    } catch (error) {
      setError(`Error processing file: ${error instanceof Error ? error.message : String(error)}`);
      setCsvData(null);
    }
  };

  // Handle file drag events
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const file = event.dataTransfer.files?.[0];
    
    if (!file) return;
    
    try {
      const result = await readCSVFile(file);
      
      if (!result.success || !result.data) {
        setError(result.error || 'Failed to parse CSV file');
        setCsvData(null);
        return;
      }
      
      setCsvData(result.data);
      
      // Default mapping to first column for label, second for value if available
      setMapping({
        labelColumn: 0,
        valueColumn: result.data.headers.length > 1 ? 1 : undefined,
        skipHeader: true
      });
    } catch (error) {
      setError(`Error processing file: ${error instanceof Error ? error.message : String(error)}`);
      setCsvData(null);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle column selection change
  const handleMappingChange = (field: keyof CSVMappingConfig, value: number | boolean) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate spinner segments from CSV data
  const handleGenerateSegments = () => {
    if (!csvData) return;
    
    try {
      const segments = csvToSpinnerSegments(csvData, mapping);
      onSegmentsGenerated(segments);
    } catch (error) {
      setError(`Error generating segments: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className={`csv-upload ${className || ''}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      
      {/* Drag and drop area */}
      {!csvData && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center
            transition-colors duration-200 ease-in-out cursor-pointer
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          role="button"
          aria-label="Upload CSV file"
          tabIndex={0}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-10 w-10 text-muted-foreground"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-base font-medium text-foreground">
              Drag and drop your CSV file here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select a file
            </p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* CSV data preview and mapping */}
      {csvData && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-semibold">CSV Data Preview</h3>
          
          {/* Mapping options */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="labelColumn" className="text-sm font-medium">
                Label Column
              </label>
              <select 
                id="labelColumn"
                className="p-2 border rounded-md bg-background"
                value={mapping.labelColumn}
                onChange={(e) => handleMappingChange('labelColumn', Number(e.target.value))}
              >
                {csvData.headers.map((header, index) => (
                  <option key={`label-${index}`} value={index}>
                    {header} (Column {index + 1})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="valueColumn" className="text-sm font-medium">
                Value Column (Optional)
              </label>
              <select
                id="valueColumn"
                className="p-2 border rounded-md bg-background"
                value={mapping.valueColumn !== undefined ? mapping.valueColumn : ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  handleMappingChange('valueColumn', value as number);
                }}
              >
                <option value="">None</option>
                {csvData.headers.map((header, index) => (
                  <option key={`value-${index}`} value={index}>
                    {header} (Column {index + 1})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="weightColumn" className="text-sm font-medium">
                Weight Column (Optional)
              </label>
              <select
                id="weightColumn"
                className="p-2 border rounded-md bg-background"
                value={mapping.weightColumn !== undefined ? mapping.weightColumn : ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  handleMappingChange('weightColumn', value as number);
                }}
              >
                <option value="">None</option>
                {csvData.headers.map((header, index) => (
                  <option key={`weight-${index}`} value={index}>
                    {header} (Column {index + 1})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="skipHeader"
                type="checkbox"
                checked={mapping.skipHeader}
                onChange={(e) => handleMappingChange('skipHeader', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="skipHeader" className="text-sm font-medium">
                Skip header row
              </label>
            </div>
          </div>
          
          {/* Data preview table */}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Row</th>
                  {csvData.headers.map((header, index) => (
                    <th key={`header-${index}`} className="px-4 py-2 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.rows.slice(0, 5).map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="border-t">
                    <td className="px-4 py-2 text-muted-foreground">{rowIndex + 1}</td>
                    {row.map((cell, cellIndex) => (
                      <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {csvData.rows.length > 5 && (
                <tfoot>
                  <tr>
                    <td colSpan={csvData.headers.length + 1} className="px-4 py-2 text-center text-muted-foreground">
                      {csvData.rows.length - 5} more rows not shown
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleGenerateSegments}>
              Generate Segments
            </Button>
            <Button variant="outline" onClick={handleButtonClick}>
              Choose Different File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUpload;