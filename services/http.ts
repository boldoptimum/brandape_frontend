import { config } from '../config';

const API_URL = config.API_URL;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const request = async <T>(endpoint: string, options: RequestInit = {}, retries = 3, backoff = 300): Promise<T> => {
    try {
        // Create a controller to allow timing out the request
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        clearTimeout(id);

        if (!response.ok) {
            // Handle Rate Limiting (429) or Server Errors (5xx) with retries
            if (response.status === 429 || response.status >= 500) {
                 if (retries > 0) {
                    console.warn(`Request to ${endpoint} failed with ${response.status}. Retrying in ${backoff}ms...`);
                    await wait(backoff);
                    return request<T>(endpoint, options, retries - 1, backoff * 2);
                }
            }
            
            const errorText = await response.text();
            throw new Error(`API error for ${endpoint}: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        // Handle cases where response might be empty (e.g., DELETE)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        }
        // @ts-ignore
        return;
    } catch (error: any) {
        // Retry on network errors (e.g., offline, DNS failure)
        if (retries > 0 && (error.name === 'AbortError' || error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
            console.warn(`Network request to ${endpoint} failed. Retrying in ${backoff}ms...`);
            await wait(backoff);
            return request<T>(endpoint, options, retries - 1, backoff * 2);
        }
        throw error;
    }
};

export const apiClient = {
  get: <T>(endpoint: string): Promise<T> => request<T>(endpoint),
  post: <T>(endpoint: string, body: any): Promise<T> => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any): Promise<T> => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any): Promise<T> => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint:string): Promise<T> => request<T>(endpoint, { method: 'DELETE' }),
};