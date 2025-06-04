/**
 * Utility function to make fetch requests with CORS headers
 * 
 * @param url - The URL to fetch from
 * @param options - Optional fetch options
 * @returns Promise with fetch response
 */
export async function fetchWithCors(url: string, options: RequestInit = {}) {
  // Try alternative CORS proxy format
  // Using allorigins.win which has a more reliable URL format
  const corsProxyUrl = 'https://api.allorigins.win/raw?url=';
  
  return fetch(`${corsProxyUrl}${encodeURIComponent(url)}`, options);
}

// Base URLs for the blockchain APIs
export const REST_API_URL = 'http://153.92.210.96:1317';
export const RPC_API_URL = 'http://153.92.210.96:26657';