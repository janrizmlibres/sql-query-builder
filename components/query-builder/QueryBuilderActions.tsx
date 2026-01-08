'use client';

import { useSearchParams } from 'next/navigation';
import { capitalize } from '@/lib/utils';
import { tableConfig } from '@/constants';

const QueryBuilderActions = ({ showFilter, setShowFilter }: { showFilter: boolean, setShowFilter: (showFilter: boolean | ((prev: boolean) => boolean)) => void }) => {
  const searchParams = useSearchParams();

  const { queryParam, defaultTable } = tableConfig;
  const currentTable = searchParams.get(queryParam) || defaultTable;

  return (
    <div className="flex justify-between gap-6">
      <div className="flex gap-2">
        <span>2</span>
        <span>{capitalize(currentTable)}</span>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setShowFilter((prev) => !prev)}>{showFilter ? 'Hide' : 'Show'} Filter</button>
      </div>
    </div>
  );
}

export default QueryBuilderActions;