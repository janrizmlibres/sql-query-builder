import { capitalize, formatDate } from "@/lib/utils";

type Props<T> = {
  response: ActionResponse<PaginatedResponse<T>>;
  columns: string[];
}

const DataTable = async <T extends { id: string },>({ response, columns }: Props<T>) => {
  const { success, error, data } = response;
  const { items } = data || {};

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{capitalize(col)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(!success || !items || items.length === 0) ? (
          <tr>
            <td colSpan={columns.length}>
              {!success ? (
                <div>
                  <p>{error?.message || "Something Went Wrong"}</p>
                  <p>
                    {error?.details
                      ? JSON.stringify(error.details, null, 2)
                      : "Please try again."}
                  </p>
                </div>
              ) : (
                <div>
                  <p>{"No Data Found"}</p>
                  <p>{"The table is empty. Try adjusting your query."}</p>
                </div>
              )}
            </td>
          </tr>
        ): (
          items.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col}>
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
  );
};

export default DataTable;