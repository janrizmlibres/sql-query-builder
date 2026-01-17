'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { PAGINATION_CONFIG, QUERY_CONFIG, TABLE_CONFIG } from '@/constants';
import { capitalize } from '@/lib/utils';
import { useRef, useState, useEffect } from 'react';

const TableSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTable = useRef<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { queryParam, defaultTable, tables } = TABLE_CONFIG;
  const currentTable = searchParams.get(queryParam) || defaultTable;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTableSelect = (newTable: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(queryParam, newTable);

    if (newTable !== lastTable.current) {
      params.delete(QUERY_CONFIG.queryParam);
      params.delete(PAGINATION_CONFIG.pageParam);
    }

    lastTable.current = newTable;
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-mp-text-secondary">Generate Query for</span>
      <div className="relative" ref={containerRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 text-base font-semibold transition-colors rounded-md border bg-white min-w-[120px] justify-between cursor-pointer
            ${isOpen 
              ? 'text-mp-primary border-mp-primary' 
              : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
            }`}
        >
          <span>{capitalize(currentTable)}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150">
            {tables.map((table) => {
              const isSelected = table === currentTable;
              return (
                <button
                  key={table}
                  onClick={() => handleTableSelect(table)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors last:mb-0
                    ${isSelected 
                      ? 'bg-mp-primary text-white' 
                      : 'text-mp-text-primary hover:text-mp-primary hover:bg-mp-primary/5'
                    }`}
                >
                  {capitalize(table)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSelector;
