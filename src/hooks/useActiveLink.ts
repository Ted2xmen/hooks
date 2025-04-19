// src/hooks/useActiveLink.ts
import { useCallback } from "react";

/**
 * A hook that checks if a given link is active based on the current pathname
 * @param currentPathname - The current pathname (from router or window.location)
 * @returns A function that checks if a given URL is active
 */
export const useActiveLink = (currentPathname: string) => {
  /**
   * Checks if a given URL is active
   * @param itemUrl - The URL to check
   * @param exact - Whether to check for exact match (default: false)
   * @returns Whether the URL is active
   */
  const isActiveLink = useCallback(
    (itemUrl: string, exact: boolean = false): boolean => {
      // Special case for home route
      if (itemUrl === '/') {
        return currentPathname === '/';
      }

      // For other routes, remove trailing slash for consistent comparison
      const cleanItemUrl = itemUrl.replace(/\/$/, '');
      const cleanPathname = currentPathname.replace(/\/$/, '');
      
      // If exact match is required, compare paths directly
      if (exact) {
        return cleanPathname === cleanItemUrl;
      }
      
      // Otherwise check if pathname starts with the route (for nested routes)
      return cleanPathname === cleanItemUrl || cleanPathname.startsWith(`${cleanItemUrl}/`);
    },
    [currentPathname]
  );

  return isActiveLink;
};