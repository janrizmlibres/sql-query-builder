'use client';

import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
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
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-2 text-sm font-medium ">
        <span className="text-mp-text-primary tracking-tight font-bold">{dataCount.toLocaleString()}</span>
        <span className="text-mp-text-secondary">{capitalize(currentTable)}</span>
      </div>

      <div className="flex gap-6">
        <button 
            onClick={() => setShowFilter((prev: boolean) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-mp-text-primary hover:text-mp-primary hover:bg-mp-primary/5 rounded-lg transition-all cursor-pointer"
        >
            <Filter className="w-4 h-4" />
            <span>{showFilter ? 'Hide' : 'Show'} Filter</span>
        </button>
      </div>
    </div>
  );
}

export default QueryBuilderActions;
