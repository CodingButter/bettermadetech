/**
 * Spinner Settings Component
 * 
 * This component provides a UI for configuring spinner settings.
 * It uses the SpinnerContext to interact with the current client implementation.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { SpinnerSegment, SpinnerSettings } from './types';
import { useSpinner } from './spinner-context';

/**
 * Props for the segment editor component
 */
interface SegmentEditorProps {
  segments: SpinnerSegment[];
  onChange: (segments: SpinnerSegment[]) => void;
}

/**
 * Component for editing spinner segments
 */
function SegmentEditor({ segments, onChange }: SegmentEditorProps) {
  const addSegment = () => {
    const newId = `segment-${Date.now()}`;
    onChange([
      ...segments,
      { id: newId, label: `Option ${segments.length + 1}`, value: newId }
    ]);
  };

  const updateSegment = (index: number, field: keyof SpinnerSegment, value: string) => {
    const newSegments = [...segments];
    if (newSegments[index]) {
      // Ensure required fields are present
      const segmentId = newSegments[index].id || `segment-${Date.now()}-${Math.random()}`;
      const segmentLabel = newSegments[index].label || `Option ${index + 1}`;
      const segmentValue = newSegments[index].value || `${index + 1}`;
      
      const updatedSegment: SpinnerSegment = { 
        ...newSegments[index],
        id: segmentId,
        label: segmentLabel,
        value: segmentValue,
        [field]: value 
      };
      newSegments[index] = updatedSegment;
      onChange(newSegments);
    }
  };

  const removeSegment = (index: number) => {
    if (segments.length <= 2) {
      alert('A spinner must have at least 2 segments');
      return;
    }
    const newSegments = [...segments];
    newSegments.splice(index, 1);
    onChange(newSegments);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Segments</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addSegment}
        >
          Add Segment
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {segments.map((segment, index) => (
          <div 
            key={segment.id} 
            className="flex items-center gap-2 p-2 border rounded"
          >
            <input
              type="text"
              value={segment.label}
              onChange={(e) => updateSegment(index, 'label', e.target.value)}
              className="flex-1 p-1 border rounded"
              placeholder="Label"
            />
            <input
              type="text"
              value={segment.value}
              onChange={(e) => updateSegment(index, 'value', e.target.value)}
              className="w-24 p-1 border rounded"
              placeholder="Value"
            />
            <input
              type="color"
              value={segment.color || '#4f46e5'}
              onChange={(e) => updateSegment(index, 'color', e.target.value)}
              className="w-10 h-8 rounded border"
            />
            <button 
              onClick={() => removeSegment(index)}
              className="text-red-500 hover:text-red-700"
              aria-label="Remove segment"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Props for the spinner settings form
 */
interface SpinnerSettingsFormProps {
  initialSettings?: Partial<SpinnerSettings>;
  onSave: (settings: SpinnerSettings) => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

/**
 * Form component for editing spinner settings
 */
export function SpinnerSettingsForm({ 
  initialSettings = {}, 
  onSave,
  onCancel,
  isSaving = false
}: SpinnerSettingsFormProps) {
  const defaultSettings: SpinnerSettings = {
    name: 'New Spinner',
    segments: [
      { id: 'segment-1', label: 'Option 1', value: '1' },
      { id: 'segment-2', label: 'Option 2', value: '2' },
      { id: 'segment-3', label: 'Option 3', value: '3' },
      { id: 'segment-4', label: 'Option 4', value: '4' },
    ],
    duration: 5,
    primaryColor: '#4f46e5',
    secondaryColor: '#f97316',
    showConfetti: false,
    ...initialSettings
  };

  const [settings, setSettings] = useState<SpinnerSettings>(defaultSettings);

  const handleChange = (field: keyof SpinnerSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium">
          Spinner Name
        </label>
        <input
          id="name"
          type="text"
          value={settings.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-2 rounded border bg-background"
          required
        />
      </div>

      <div>
        <label htmlFor="duration" className="block mb-2 text-sm font-medium">
          Spin Duration (seconds)
        </label>
        <input
          id="duration"
          type="number"
          min="1"
          max="30"
          value={settings.duration}
          onChange={(e) => handleChange('duration', parseInt(e.target.value))}
          className="w-full p-2 rounded border bg-background"
        />
      </div>

      <div>
        <label htmlFor="primaryColor" className="block mb-2 text-sm font-medium">
          Primary Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="primaryColor"
            type="color"
            value={settings.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="w-12 h-10 rounded border"
          />
          <input
            type="text"
            value={settings.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="w-32 p-2 rounded border bg-background"
          />
        </div>
      </div>

      <div>
        <label htmlFor="secondaryColor" className="block mb-2 text-sm font-medium">
          Secondary Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="secondaryColor"
            type="color"
            value={settings.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            className="w-12 h-10 rounded border"
          />
          <input
            type="text"
            value={settings.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            className="w-32 p-2 rounded border bg-background"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="showConfetti"
          type="checkbox"
          checked={settings.showConfetti}
          onChange={(e) => handleChange('showConfetti', e.target.checked)}
          className="mr-2 h-4 w-4"
        />
        <label htmlFor="showConfetti" className="text-sm font-medium">
          Show confetti effect when winner is revealed
        </label>
      </div>

      <SegmentEditor 
        segments={settings.segments} 
        onChange={(segments) => handleChange('segments', segments)} 
      />

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}

/**
 * Spinner settings manager component that uses the SpinnerContext
 */
export function SpinnerSettingsManager() {
  const { 
    spinnerSettings, 
    isLoadingSettings, 
    refreshSettings, 
    client, 
    activeSpinnerId,
    setActiveSpinner
  } = useSpinner();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const handleSaveSettings = async (settings: SpinnerSettings) => {
    if (!client) return;
    
    try {
      setIsSaving(true);
      const result = await client.saveSpinnerSettings(settings);
      
      if (result.success) {
        // If this is a new spinner, mark it as active
        if (!isEditing && result.id) {
          await setActiveSpinner(result.id);
        }
        
        await refreshSettings();
        setIsCreating(false);
        setIsEditing(null);
      } else {
        alert(`Failed to save settings: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving spinner settings:', error);
      alert('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSettings = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spinner?') || !client) {
      return;
    }
    
    try {
      setIsDeleting(id);
      const result = await client.deleteSpinnerSettings(id);
      
      if (result.success) {
        // If deleting the active spinner, set a new active one if available
        if (id === activeSpinnerId && spinnerSettings && spinnerSettings.length > 1) {
          const remainingSpinners = spinnerSettings.filter(s => s.id !== id);
          const firstSpinner = remainingSpinners.length > 0 ? remainingSpinners[0] : null;
          if (firstSpinner && firstSpinner.id) {
            await setActiveSpinner(firstSpinner.id);
          }
        }
        
        await refreshSettings();
      } else {
        alert(`Failed to delete settings: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting spinner settings:', error);
      alert('An error occurred while deleting settings');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoadingSettings) {
    return <div className="text-center py-4">Loading spinner settings...</div>;
  }

  if (isCreating || isEditing) {
    let initialSettings = {};
    
    if (isEditing && spinnerSettings) {
      const settingToEdit = spinnerSettings.find(s => s.id === isEditing);
      if (settingToEdit) {
        initialSettings = { ...settingToEdit };
      }
    }
    
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isCreating ? 'Create New Spinner' : 'Edit Spinner'}
        </h2>
        <SpinnerSettingsForm
          initialSettings={initialSettings}
          onSave={handleSaveSettings}
          onCancel={() => {
            setIsCreating(false);
            setIsEditing(null);
          }}
          isSaving={isSaving}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Spinners</h2>
        <Button onClick={() => setIsCreating(true)}>
          Create New Spinner
        </Button>
      </div>
      
      {(!spinnerSettings || spinnerSettings.length === 0) ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>You don't have any spinners yet.</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => setIsCreating(true)}
          >
            Create Your First Spinner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {spinnerSettings.map((setting) => (
            <Card 
              key={setting.id} 
              className={`p-4 ${setting.id === activeSpinnerId ? 'border-primary' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{setting.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {setting.segments.length} segments
                    {setting.id === activeSpinnerId && 
                      <span className="ml-2 text-primary">(Active)</span>
                    }
                  </p>
                </div>
                <div className="flex space-x-2">
                  {setting.id !== activeSpinnerId && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setting.id && setActiveSpinner(setting.id)}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(setting.id!)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setting.id && handleDeleteSettings(setting.id)}
                    disabled={isDeleting === setting.id}
                  >
                    {isDeleting === setting.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}