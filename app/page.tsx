import QueryBuilderArea from "@/components/query-builder/QueryBuilderArea";
import TableSelector from "@/components/TableSelector";
import DataTable from "@/components/DataTable";
import { TABLE_CONFIG } from "@/constants";
import { capitalize } from "@/lib/utils";
import { ModelFactory } from "@/lib/strategies/model.strategy";
import { getTableFields } from "@/lib/actions/schema.action";

export default async function Home({ searchParams }: RouteParams) {
  // Use URL state management for table name. Useful for keeping this as a server component.
  const { defaultTable } = TABLE_CONFIG;
  const { table: currentTable = defaultTable } = await searchParams;

  const model = ModelFactory.getModel(currentTable);
  const dbTableName = model.getTableName();

  const [ response, fields ] = await Promise.all([
    model.fetchData({}),
    getTableFields(dbTableName),
  ]);

  const columns = model.getColumns();

  return (
    <div>
      <main>
        <TableSelector />
        <h1>{capitalize(currentTable)}</h1>
        <QueryBuilderArea dataCount={response.data?.items.length || 0} fields={fields} />
        <DataTable response={response} columns={columns} />
      </main>
    </div>
  );
}
