import QueryBuilderArea from "@/components/query-builder/QueryBuilderArea";
import TableSelector from "@/components/TableSelector";
import DataTable from "@/components/DataTable";
import { tableConfig } from "@/constants";
import { capitalize } from "@/lib/utils";

type Props = {
  searchParams: Promise<{
    table: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  // Use URL state management for table name. Useful for keeping this as a server component.
  const { defaultTable } = tableConfig;
  const { table: currentTable = defaultTable } = await searchParams;

  return (
    <div>
      <main>
        <TableSelector />
        <h1>{capitalize(currentTable)}</h1>
        <QueryBuilderArea />
        <DataTable />
      </main>
    </div>
  );
}
