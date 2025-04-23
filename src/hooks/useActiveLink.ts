// src/hooks/useActiveLink.ts
import { usePathname } from 'next/navigation';

export const useActiveLink = () => {
  const pathname = usePathname();

  const isActiveLink = (itemUrl: string) => {
    // Special case for home route
    if (itemUrl === '/') {
      return pathname === '/';
    }

    // For other routes, remove trailing slash and check if pathname starts with the route
    const cleanItemUrl = itemUrl.replace(/\/$/, '');
    const cleanPathname = pathname.replace(/\/$/, '');
    return cleanPathname === cleanItemUrl || cleanPathname.startsWith(cleanItemUrl);
  };

  return isActiveLink;
};