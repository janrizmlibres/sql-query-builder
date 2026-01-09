'use client';

import { useSearchParams } from 'next/navigation';
import { capitalize } from '@/lib/utils';
import { TABLE_CONFIG } from '@/constants';

type Props = {
  dataCount: number;
  showFilter: boolean;
  setShowFilter: (showFilter: (prev: boolean) => boolean) => void;
}

const QueryBuilderActions = ({ dataCount, showFilter, setShowFilter }: Props) => {
  const searchParams = useSearchParams();

  const { queryParam, defaultTable } = TABLE_CONFIG;
  const currentTable = searchParams.get(queryParam) || defaultTable;

  return (
    <div className="flex justify-between gap-6">
      <div className="flex gap-2">
        <span>{dataCount}</span>
        <span>{capitalize(currentTable)}</span>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setShowFilter((prev: boolean) => !prev)}>{showFilter ? 'Hide' : 'Show'} Filter</button>
      </div>
    </div>
  );
}

export default QueryBuilderActions;