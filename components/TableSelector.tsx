'use client';

import { tableConfig } from '@/constants';
import { capitalize } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const TableSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { queryParam, defaultTable, tables } = tableConfig;
  const currentTable = searchParams.get(queryParam) || defaultTable;

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTable = e.target.value;

    const params = new URLSearchParams(searchParams.toString());
    params.set(queryParam, newTable);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select value={currentTable} onChange={handleTableChange}>
      {tables.map((table) => (
        <option key={table} value={table}>{capitalize(table)}</option>
      ))}
    </select>
  );
};

export default TableSelector;