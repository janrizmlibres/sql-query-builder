'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Field, QueryBuilder, RuleGroupType, defaultOperators, add } from 'react-querybuilder';
import { useDebounce } from 'use-debounce';
import { Plus } from 'lucide-react';
import { saveQuery } from '@/lib/actions/query.action';
import { QUERY_CONFIG } from '@/constants';
import {
  AddFilterAction,
  RemoveRuleAction,
  RemoveGroupAction,
  InlineCombinatorDropdown,
  HiddenAddGroup,
  FieldSelector,
  OperatorSelector,
  ValueEditor,
} from './QueryBuilderControls';
import './QueryBuilder.css';

const getOperators = (_fieldName: string, { fieldData }: { fieldData: Field }) => {
  switch (fieldData.datatype) {
    case 'text':
      return [
        { name: '=', label: 'is' },
        { name: '!=', label: 'is not' },
        ...defaultOperators.filter(op =>
          [
            'contains',
            'beginsWith',
            'endsWith',
            'doesNotContain',
            'doesNotBeginWith',
            'doesNotEndWith',
            'doesNotEndWith',
            'null',
            'notNull',
          ].includes(op.name)
        ),
      ];
    case 'number':
      return [
        ...defaultOperators.filter(op => ['=', '!='].includes(op.name)),
        { name: '<', label: 'less than' },
        { name: '<=', label: 'less than or equal to' },
        { name: '>', label: 'greater than' },
        { name: '>=', label: 'greater than or equal to' },
        ...defaultOperators.filter(op => ['null', 'notNull'].includes(op.name)),
      ];
    case 'date':
      return [
        { name: '=', label: 'on' },
        { name: '!=', label: 'not on' },
        { name: '<', label: 'before' },
        { name: '<=', label: 'on or before' },
        { name: '>', label: 'after' },
        { name: '>=', label: 'on or after' },
      ];
    case 'datetime-local':
      return [
        { name: '<', label: 'before' },
        { name: '>', label: 'after' },
      ];
    case 'boolean':
      return [
        { name: '=', label: 'is' },
        { name: '!=', label: 'is not' },
        ...defaultOperators.filter(op => ['null', 'notNull'].includes(op.name)),
      ];
  }
  return defaultOperators;
};

const controlElements = {
  addRuleAction: AddFilterAction,
  addGroupAction: HiddenAddGroup,
  removeRuleAction: RemoveRuleAction,
  removeGroupAction: RemoveGroupAction,
  combinatorSelector: InlineCombinatorDropdown,
  fieldSelector: FieldSelector,
  operatorSelector: OperatorSelector,
  valueEditor: ValueEditor,
  dragHandle: null,
  cloneRuleAction: null,
  cloneGroupAction: null,
  lockRuleAction: null,
  lockGroupAction: null,
  shiftActions: null,
};

type Props = {
  fields: Field[];
  initialQuery?: RuleGroupType | null;
  currentTable?: string;
}
  
const QueryBuilderPanel = ({
  fields, 
  initialQuery, 
  currentTable,
}: Props) => {
  const { queryParam, defaultQuery, debounceTime } = QUERY_CONFIG;

  const [query, setQuery] = useState<RuleGroupType>(initialQuery || defaultQuery);
  const [debouncedQuery] = useDebounce(query, debounceTime);

  const lastQuery = useRef<RuleGroupType | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const syncQuery = async () => {
      if (JSON.stringify(debouncedQuery) === JSON.stringify(lastQuery.current)) return;
      lastQuery.current = debouncedQuery;

      const params = new URLSearchParams(searchParams.toString());

      if (debouncedQuery.rules.length === 0) {
        params.delete(queryParam);
      } else {
        const hash = await saveQuery(debouncedQuery);
        params.set(queryParam, hash);
      }

      router.push(`${pathname}?${params.toString()}`);
    };

    syncQuery();
  }, [debouncedQuery, pathname, router, searchParams, queryParam]);

  const handleAddGroup = () => {
    const newGroup: RuleGroupType = {
      combinator: 'and',
      rules: [],
    };
    setQuery((prev) => add(prev, newGroup, []));
  };

  const handleClearAll = () => {
    setQuery(defaultQuery);
  };

  const tableLabel = currentTable ? `All ${currentTable.charAt(0).toUpperCase() + currentTable.slice(1)}` : 'All Users';
  const hasRules = query.rules.length > 0;

  return (
    <>
      <div className="bg-mp-bg-card p-6 mt-4 rounded-lg border border-mp-border shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-mp-text-secondary uppercase tracking-wide">
            {tableLabel}
          </span>
        </div>

        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={setQuery}
          getOperators={getOperators}
          controlElements={controlElements}
          showCombinatorsBetweenRules
        />
      </div>

      {hasRules && (
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={handleAddGroup}
            className="flex items-center gap-1.5 text-sm font-medium text-mp-text-secondary hover:text-mp-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Group</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-medium text-mp-text-secondary hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </>
  );
};

export default QueryBuilderPanel;
