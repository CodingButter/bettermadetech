// Utility for interacting with Directus API
import { getUserSettings } from './storage';
import { DIRECTUS_CONFIG } from './env-config';

interface DirectusAuthResponse {
  data: {
    access_token: string;
    expires: number;
    refresh_token: string;
  };
}

interface SpinnerData {
  id: string;
  name: string;
  segments: {
    id: string;
    label: string;
    value: string;
    color?: string;
  }[];
}

// Get headers with authentication
const getHeaders = async (userToken?: string) => {
  const settings = await getUserSettings();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // If there's a user authentication token, use that
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  } 
  // Otherwise, use the admin token if available
  else if (settings.directusToken) {
    headers['Authorization'] = `Bearer ${settings.directusToken}`;
  }
  
  return headers;
};

// Login to Directus
export const loginToDirectus = async (email: string, password: string): Promise<string | null> => {
  try {
    const settings = await getUserSettings();
    const response = await fetch(`${settings.directusUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }
    
    const data = await response.json() as DirectusAuthResponse;
    return data.data.access_token;
  } catch (error) {
    console.error('Failed to login to Directus:', error);
    return null;
  }
};

// Fetch user's spinners
export const fetchUserSpinners = async (userToken: string): Promise<SpinnerData[]> => {
  try {
    const settings = await getUserSettings();
    const headers = await getHeaders(userToken);
    
    const response = await fetch(`${settings.directusUrl}/items/spinners?fields=*,segments.*`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch spinners with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch user spinners:', error);
    return [];
  }
};

// Create a new spinner
export const createSpinner = async (
  userToken: string,
  name: string,
  segments: { label: string; value: string; color?: string }[]
): Promise<SpinnerData | null> => {
  try {
    const settings = await getUserSettings();
    const headers = await getHeaders(userToken);
    
    // First create the spinner
    const spinnerResponse = await fetch(`${settings.directusUrl}/items/spinners`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name,
      }),
    });
    
    if (!spinnerResponse.ok) {
      throw new Error(`Failed to create spinner with status: ${spinnerResponse.status}`);
    }
    
    const spinnerData = await spinnerResponse.json();
    const spinnerId = spinnerData.data.id;
    
    // Create segments for the spinner
    for (const segment of segments) {
      const segmentResponse = await fetch(`${settings.directusUrl}/items/segments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          spinner_id: spinnerId,
          label: segment.label,
          value: segment.value,
          color: segment.color,
        }),
      });
      
      if (!segmentResponse.ok) {
        console.error(`Failed to create segment with status: ${segmentResponse.status}`);
      }
    }
    
    // Fetch the created spinner with segments
    return (await fetchUserSpinners(userToken)).find(spinner => spinner.id === spinnerId) || null;
  } catch (error) {
    console.error('Failed to create spinner:', error);
    return null;
  }
};

// Update an existing spinner
export const updateSpinner = async (
  userToken: string,
  spinnerId: string,
  updates: {
    name?: string;
    segments?: { id?: string; label: string; value: string; color?: string }[];
  }
): Promise<boolean> => {
  try {
    const settings = await getUserSettings();
    const headers = await getHeaders(userToken);
    
    // Update spinner name if provided
    if (updates.name) {
      const spinnerResponse = await fetch(`${settings.directusUrl}/items/spinners/${spinnerId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          name: updates.name,
        }),
      });
      
      if (!spinnerResponse.ok) {
        throw new Error(`Failed to update spinner with status: ${spinnerResponse.status}`);
      }
    }
    
    // Update segments if provided
    if (updates.segments && updates.segments.length > 0) {
      // First get existing segments
      const segmentsResponse = await fetch(`${settings.directusUrl}/items/segments?filter[spinner_id][_eq]=${spinnerId}`, {
        method: 'GET',
        headers,
      });
      
      if (!segmentsResponse.ok) {
        throw new Error(`Failed to fetch segments with status: ${segmentsResponse.status}`);
      }
      
      const existingSegments = await segmentsResponse.json();
      const existingSegmentIds = existingSegments.data.map((segment: any) => segment.id);
      
      // Process each segment
      for (const segment of updates.segments) {
        if (segment.id) {
          // Update existing segment
          await fetch(`${settings.directusUrl}/items/segments/${segment.id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              label: segment.label,
              value: segment.value,
              color: segment.color,
            }),
          });
          
          // Remove from existingSegmentIds so we know we've handled it
          const index = existingSegmentIds.indexOf(segment.id);
          if (index > -1) {
            existingSegmentIds.splice(index, 1);
          }
        } else {
          // Create new segment
          await fetch(`${settings.directusUrl}/items/segments`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              spinner_id: spinnerId,
              label: segment.label,
              value: segment.value,
              color: segment.color,
            }),
          });
        }
      }
      
      // Delete segments that weren't included in the update
      for (const segmentId of existingSegmentIds) {
        await fetch(`${settings.directusUrl}/items/segments/${segmentId}`, {
          method: 'DELETE',
          headers,
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update spinner:', error);
    return false;
  }
};

// Delete a spinner
export const deleteSpinner = async (userToken: string, spinnerId: string): Promise<boolean> => {
  try {
    const settings = await getUserSettings();
    const headers = await getHeaders(userToken);
    
    const response = await fetch(`${settings.directusUrl}/items/spinners/${spinnerId}`, {
      method: 'DELETE',
      headers,
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to delete spinner:', error);
    return false;
  }
};