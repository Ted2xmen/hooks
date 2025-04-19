import { useMemo } from 'react';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  isLast?: boolean;
  isQueryParam?: boolean;
}

export interface UseBreadcrumbOptions {
  /**
   * Current pathname (from router)
   */
  pathname: string;
  
  /**
   * Optional search/query parameters
   */
  searchParams?: Record<string, string>;
  
  /**
   * Optional function to get a label for a path segment
   */
  getLabelForSegment?: (segment: string) => string;
  
  /**
   * Optional function to get an icon for a path segment
   */
  getIconForSegment?: (segment: string) => React.ReactNode | undefined;
  
  /**
   * Optional function to handle query parameters
   */
  getQueryParamLabel?: (key: string, value: string) => string;
  
  /**
   * Whether to include the home path (empty path) in the breadcrumbs
   * @default false
   */
  includeHome?: boolean;
  
  /**
   * Label for the home breadcrumb (if includeHome is true)
   * @default "Home"
   */
  homeLabel?: string;
  
  /**
   * Icon for the home breadcrumb (if includeHome is true)
   */
  homeIcon?: React.ReactNode;
}

/**
 * A hook that generates breadcrumb navigation items based on the current path
 * 
 * @param options - Configuration options for the breadcrumb
 * @returns An array of breadcrumb items
 */
const useBreadcrumb = (options: UseBreadcrumbOptions): BreadcrumbItem[] => {
  const {
    pathname,
    searchParams = {},
    getLabelForSegment,
    getIconForSegment,
    getQueryParamLabel,
    includeHome = false,
    homeLabel = 'Home',
    homeIcon,
  } = options;

  return useMemo(() => {
    // Split the path into segments and filter out empty segments
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Initialize breadcrumbs array
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Add home breadcrumb if requested
    if (includeHome) {
      breadcrumbs.push({
        label: homeLabel,
        path: '/',
        icon: homeIcon,
        isLast: pathSegments.length === 0,
      });
    }
    
    // Generate breadcrumbs for each path segment
    pathSegments.forEach((segment, index) => {
      // Build the path for this breadcrumb
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      
      // Format the segment for display (convert kebab-case to Title Case)
      const defaultLabel = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Get the label and icon using the provided functions or fallback to defaults
      const label = getLabelForSegment ? getLabelForSegment(segment) : defaultLabel;
      const icon = getIconForSegment ? getIconForSegment(segment) : undefined;
      
      breadcrumbs.push({
        label,
        path,
        icon,
        isLast: index === pathSegments.length - 1 && Object.keys(searchParams).length === 0,
      });
    });
    
    // Add query parameters as a non-clickable item if they exist and a handler is provided
    const queryParamEntries = Object.entries(searchParams);
    if (queryParamEntries.length > 0 && getQueryParamLabel) {
      const [key, value] = queryParamEntries[0];
      
      breadcrumbs.push({
        label: getQueryParamLabel(key, value),
        path: '',
        isLast: true,
        isQueryParam: true,
      });
      
      // Update the previous item's isLast status
      if (breadcrumbs.length > 1) {
        breadcrumbs[breadcrumbs.length - 2].isLast = false;
      }
    }
    
    return breadcrumbs;
  }, [
    pathname,
    searchParams,
    getLabelForSegment,
    getIconForSegment,
    getQueryParamLabel,
    includeHome,
    homeLabel,
    homeIcon,
  ]);
};

export default useBreadcrumb;
