import QueryBuilderArea from "@/components/query-builder/QueryBuilderArea";
import TableSelector from "@/components/TableSelector";
import DataTable from "@/components/DataTable";
import { TABLE_CONFIG } from "@/constants";
import { capitalize } from "@/lib/utils";
import { ModelFactory } from "@/lib/strategies/model.strategy";
import { getQuery } from "@/lib/actions/query.action";

export default async function Home({ searchParams }: RouteParams) {
  // Use URL state management for table name. Useful for keeping this as a server component.
  const { defaultTable } = TABLE_CONFIG;
  const { table: currentTable = defaultTable, q: hash } = await searchParams;

  const model = ModelFactory.getModel(currentTable);

  const [query, fields] = await Promise.all([
    hash ? await getQuery(hash) : null,
    model.getQueryFields(),
  ]);

  const fieldsWithValidators = model.getQueryFieldsWithValidators(fields);
  const response = await model.fetchData(query, undefined, fieldsWithValidators);
  const columns = model.getColumns();

  return (
    <div>
      <main>
        <TableSelector />
        <h1>{capitalize(currentTable)}</h1>
        <QueryBuilderArea
          dataCount={response.data?.items.length || 0}
          fields={fields}
          initialQuery={query}
          currentTable={currentTable}
        />
        <DataTable response={response} columns={columns} />
      </main>
    </div>
  );
}
