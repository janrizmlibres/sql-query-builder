'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TABLE_CONFIG } from '@/constants';
import { capitalize } from '@/lib/utils';

const TableSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { queryParam, defaultTable, tables } = TABLE_CONFIG;
  const currentTable = searchParams.get(queryParam) || defaultTable;

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTable = e.target.value;

    const params = new URLSearchParams(searchParams.toString());
    params.set(queryParam, newTable);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <span>Generate Query for</span>
      <select value={currentTable} onChange={handleTableChange}>
        {tables.map((table) => (
          <option key={table} value={table}>{capitalize(table)}</option>
        ))}
      </select>
    </div>
  );
};

export default TableSelector;