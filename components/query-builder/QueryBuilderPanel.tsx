'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Field, QueryBuilder, RuleGroupType, defaultOperators } from 'react-querybuilder';
import { useDebounce } from 'use-debounce';
import { saveQuery } from '@/lib/actions/query.action';
import { QUERY_CONFIG } from '@/constants';
import { ModelFactory } from '@/lib/strategies/model.strategy';

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
            'null',
            'notNull',
            'in',
            'notIn',
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
        ...defaultOperators.filter(op => ['null', 'notNull'].includes(op.name)),
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

type Props = {
  fields: Field[];
  initialQuery?: RuleGroupType | null;
}
  
const QueryBuilderPanel = ({ fields, initialQuery }: Props) => {
  const { queryParam, defaultQuery, debounceTime } = QUERY_CONFIG;

  const [query, setQuery] = useState<RuleGroupType>(initialQuery || defaultQuery);
  const [debouncedQuery] = useDebounce(query, debounceTime);

  const lastHash = useRef<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const syncQuery = async () => {
      const params = new URLSearchParams(searchParams.toString());

      if (debouncedQuery.rules.length === 0) {
        params.delete(queryParam);
      } else {
        const hash = await saveQuery(debouncedQuery);
        params.set(queryParam, hash);
      }

      const currentHash = params.get(queryParam);
      if (currentHash === lastHash.current) return;
      lastHash.current = currentHash;

      router.push(`${pathname}?${params.toString()}`);
    };

    syncQuery();
  }, [debouncedQuery, pathname, router, searchParams, queryParam]);

  return (
    <div>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={setQuery}
        getOperators={getOperators}
      />
    </div>
  );
};

export default QueryBuilderPanel;