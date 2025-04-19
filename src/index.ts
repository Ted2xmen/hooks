export { useActiveLink } from './hooks/useActiveLink';
export { useShuffleData } from './hooks/useShuffleData';
export { default as useBreadcrumb } from './hooks/useBreadcrumb';
export type { BreadcrumbItem, UseBreadcrumbOptions } from './hooks/useBreadcrumb';
export { default as useDateFunctions } from './hooks/useDateFunctions';
export type { 
  DateInput, 
  DateFormatType, 
  DateUnit, 
  SortOrder,
  DateSortable 
} from './hooks/useDateFunctions';
export { 
  useGitHubRepos, 
  fetchGitHubRepos, 
  calculateDateRange 
} from './hooks/useGitHubRepos';
export type { 
  GitHubRepo, 
  GitHubReposOptions 
} from './hooks/useGitHubRepos';
export { useKeyPress } from './hooks/useKeyPress';
