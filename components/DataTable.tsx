import { capitalize, formatDate } from "@/lib/utils";

type Props<T> = {
  response: ActionResponse<PaginatedResponse<T>>;
  columns: string[];
}

const DataTable = async <T extends { id: string },>({ response, columns }: Props<T>) => {
  const { success, error, data } = response;
  const { items } = data || {};

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-mp-border">
        <thead className="bg-mp-bg-page">
          <tr>
            {columns.map((col) => (
              <th 
                key={col} 
                className="px-6 py-3 text-left text-xs font-semibold text-mp-text-secondary uppercase tracking-wider whitespace-nowrap"
              >
                {capitalize(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-mp-bg-card divide-y divide-mp-border">
          {(!success || !items || items.length === 0) ? (
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
    </div>
  );
};

export default DataTable;
