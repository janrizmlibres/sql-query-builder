/**
 * Standard response type for all data fetching actions.
 */
type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

/**
 * Standard error response type for all unsuccessful requests.
 */
type ErrorResponse = ActionResponse<undefined> & { success: false };

interface SearchParams {
  table?: string;
  q?: string;
  page?: string;
}

interface RouteParams {
  searchParams: Promise<SearchParams>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  isNext: boolean;
}

interface DataCountResponse {
  count: number;
}