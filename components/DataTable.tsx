import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGINATION_CONFIG } from "@/constants";
import { toTitleCase, formatDate, buildPageUrl } from "@/lib/utils";

type Props<T> = {
  response: ActionResponse<PaginatedResponse<T>>;
  columns: string[];
  page: number;
  searchParams: SearchParams;
}

const DataTable = async <T extends { id: string },>({ response, columns, page, searchParams }: Props<T>) => {
  const { success, error, data } = response;
  const { items = [], isNext } = data || {};
  
  const hasItems = items.length > 0;

  const { defaultPage } = PAGINATION_CONFIG;

  return (
    <div className="bg-mp-bg-card rounded-lg border border-mp-border shadow-sm overflow-x-auto overflow-hidden">
      <table className="min-w-full divide-y divide-mp-border">
        <thead className="bg-mp-bg-page">
          <tr>
            {columns.map((col) => (
              <th 
                key={col} 
                className="px-6 py-3 text-left text-xs font-semibold text-mp-text-secondary tracking-wider whitespace-nowrap uppercase"
              >
                {toTitleCase(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-mp-bg-card divide-y divide-mp-border">
          {(!success || !hasItems) ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                {!success ? (
                  <div className="flex flex-col items-center justify-center text-red-500">
                    <p className="font-medium text-lg">{error?.message || "Something Went Wrong"}</p>
                    <p className="text-sm text-mp-text-secondary mt-1">
                      {error?.details
                        ? JSON.stringify(error.details, null, 2)
                        : "Please try again."}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-mp-text-secondary">
                    <p className="font-medium text-lg text-mp-text-primary">{"No Data Found"}</p>
                    <p className="mt-1">{"The table is empty. Try adjusting your query."}</p>
                  </div>
                )}
              </td>
            </tr>
          ): (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-mp-bg-page transition-colors">
                {columns.map((col) => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-mp-text-primary">
                    {col === "createdAt" || col === "updatedAt"
                      ? formatDate(item[col as keyof typeof item] as string)
                      : item[col as keyof typeof item]?.toString() ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {success && hasItems && (
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-mp-border bg-mp-bg-page">
          {page > defaultPage ? (
            <Link
              href={buildPageUrl(searchParams, page - 1)}
              className="p-2 rounded-md border border-mp-border bg-white text-mp-text-primary hover:text-mp-primary hover:border-mp-primary transition-colors"
              aria-label="Previous page"
              scroll={false}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-2 rounded-md border border-mp-border bg-mp-bg-page text-mp-text-secondary cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </span>
          )}

          {page > defaultPage && (
            <Link
              href={buildPageUrl(searchParams, page - 1)}
              className="px-3 py-1.5 min-w-[32px] text-sm font-semibold rounded-md border border-mp-border bg-white text-mp-text-primary hover:text-mp-primary hover:border-mp-primary transition-colors text-center"
              scroll={false}
            >
              {page - 1}
            </Link>
          )}

          <span className="px-3 py-1.5 min-w-[32px] text-sm font-semibold rounded-md border border-mp-primary bg-mp-primary text-white text-center">
            {page}
          </span>

          {isNext && (
            <Link
              href={buildPageUrl(searchParams, page + 1)}
              className="px-3 py-1.5 min-w-[32px] text-sm font-semibold rounded-md border border-mp-border bg-white text-mp-text-primary hover:text-mp-primary hover:border-mp-primary transition-colors text-center"
              scroll={false}
            >
              {page + 1}
            </Link>
          )}

          {isNext ? (
            <Link
              href={buildPageUrl(searchParams, page + 1)}
              className="p-2 rounded-md border border-mp-border bg-white text-mp-text-primary hover:text-mp-primary hover:border-mp-primary transition-colors"
              aria-label="Next page"
              scroll={false}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-2 rounded-md border border-mp-border bg-mp-bg-page text-mp-text-secondary cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
