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

interface RouteParams {
  searchParams: Promise<{
    table?: string;
    q?: string;
  }>;
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