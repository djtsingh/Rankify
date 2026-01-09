// API Base URL - Production Azure Functions endpoint
// No local development fallback - production only
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rankify-v1-src.azurewebsites.net';

// Production logging only for errors
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[API Client] Production URL:', API_BASE_URL);
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Make an API request with automatic error handling and retries
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeout = 30000,
    retries = 3,
    headers = {},
    ...fetchOptions
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  // Add default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        headers: defaultHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || errorData.error || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      // Parse response
      const data = await response.json();
      return data as T;

    } catch (error) {
      lastError = error as Error;

      // Don't retry on 4xx errors (client errors)
      if (error instanceof APIError && error.statusCode && error.statusCode < 500) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === retries - 1) {
        break;
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  // All retries failed
  throw new APIError(
    lastError?.message || 'Request failed after multiple retries',
    lastError instanceof APIError ? lastError.statusCode : undefined
  );
}

/**
 * GET request
 */
export async function get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request
 */
export async function post<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function put<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<{ status: string; service: string }> {
  return get('/health');
}
