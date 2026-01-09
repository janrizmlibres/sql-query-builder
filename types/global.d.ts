type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type ErrorResponse = ActionResponse<undefined> & { success: false };

interface PaginatedResponse<T> {
  items: T[];
  isNext: boolean;
}

interface RouteParams {
  searchParams: Promise<{
    table: string;
  }>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}