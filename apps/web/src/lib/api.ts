/**
 * API Configuration
 * Handles API URL based on environment
 */

// Get API URL from environment variable or fallback to relative path
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Make an API request
 * @param endpoint - API endpoint (e.g., '/health', '/test')
 * @param options - Fetch options
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * API endpoints
 */
export const api = {
  // Health check
  health: () => apiRequest('/health'),
  
  // Test endpoint
  test: () => apiRequest('/test'),
  
  // Add more endpoints as needed
  // Example:
  // getProjects: () => apiRequest('/projects'),
  // createProject: (data) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(data) }),
};

export default api;
