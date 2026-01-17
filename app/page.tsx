import QueryBuilderArea from "@/components/query-builder/QueryBuilderArea";
import TableSelector from "@/components/TableSelector";
import DataTable from "@/components/DataTable";
import { PAGINATION_CONFIG, TABLE_CONFIG } from "@/constants";
import { ModelFactory } from "@/lib/strategies/model.strategy";
import { getQuery } from "@/lib/actions/query.action";

export default async function Home({ searchParams }: RouteParams) {
  // Use URL state management for table name. Useful for keeping this as a server component.
  const { defaultTable } = TABLE_CONFIG;
  const { defaultPage } = PAGINATION_CONFIG;

  const params = await searchParams;
  const { table: currentTable = defaultTable, q: hash } = params;
  const page = Number(params.page) || defaultPage;

  const model = ModelFactory.getModel(currentTable);

  const [query, fields] = await Promise.all([
    hash ? await getQuery(hash) : null,
    model.getQueryFields(),
  ]);

  const fieldsWithValidators = model.getQueryFieldsWithValidators(fields);
  const columns = model.getColumns();

  const [response, dataCount] = await Promise.all([
    model.fetchData(query, { page }, fieldsWithValidators),
    model.fetchDataCount(query),
  ]);

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <TableSelector />

        <QueryBuilderArea
          dataCount={dataCount.data?.count || 0}
          fields={fields}
          initialQuery={query}
          currentTable={currentTable}
        />

        <DataTable
          response={response}
          columns={columns}
          page={page}
          searchParams={params}
        />
      </main>
    </div>
  );
}
