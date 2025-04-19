import { useState, useEffect } from 'react';

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  created_at: string;
  updated_at: string;
};

export interface GitHubReposOptions {
  language?: string;
  perPage?: number;
  sort?: 'stars' | 'forks' | 'updated' | 'help-wanted-issues';
  order?: 'desc' | 'asc';
  timeRange?: 'day' | 'week' | 'month';
}

interface UseGitHubReposResult {
  repos: GitHubRepo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Calculate date range based on timeRange
 * @param timeRange - Time range to calculate date from
 * @returns ISO date string for the calculated date
 */
export function calculateDateRange(timeRange: 'day' | 'week' | 'month' = 'week'): string {
  const currentDate = new Date();
  let pastDate: Date;

  switch (timeRange) {
    case 'day':
      pastDate = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      pastDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'week':
    default:
      pastDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
  }

  return pastDate.toISOString().split('T')[0];
}

/**
 * Core function to fetch GitHub repositories based on provided options
 * This can be used in both client components and API routes
 * 
 * @param options - Configuration options for the GitHub API request
 * @returns Promise resolving to an array of GitHubRepo objects
 */
export async function fetchGitHubRepos(options: GitHubReposOptions = {}): Promise<GitHubRepo[]> {
  const {
    language,
    perPage = 10,
    sort = 'stars',
    order = 'desc',
    timeRange = 'week'
  } = options;

  const url = new URL('https://api.github.com/search/repositories');
  
  // Add query parameters
  url.searchParams.append('sort', sort);
  url.searchParams.append('order', order);
  url.searchParams.append('per_page', perPage.toString());
  
  // Build the q parameter
  let query = '';
  
  if (language) {
    query += `language:${language}`;
  }
  
  query += ` created:>${calculateDateRange(timeRange)}`;
  url.searchParams.append('q', query.trim());

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.items;
}

/**
 * React hook for fetching trending GitHub repositories
 * Uses the core fetchGitHubRepos function and adds React state management
 * 
 * @param options - Configuration options for the GitHub API request
 * @returns Object containing repos, loading state, error state, and refetch function
 */
export function useGitHubRepos(options: GitHubReposOptions = {}): UseGitHubReposResult {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRepos = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchGitHubRepos(options);
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [
    options.language, 
    options.perPage, 
    options.sort, 
    options.order, 
    options.timeRange
  ]);

  return { repos, isLoading, error, refetch: fetchRepos };
}
