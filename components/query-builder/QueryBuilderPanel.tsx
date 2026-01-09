'use client';

import { useState } from 'react';
import { Field, QueryBuilder, RuleGroupType, defaultOperators } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

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

const defaultQuery: RuleGroupType = {
  combinator: 'and',
  rules: [],
}

type Props = {
  fields: Field[];
}

const QueryBuilderPanel = ({ fields }: Props) => {
  const [query, setQuery] = useState<RuleGroupType>(defaultQuery);

  return (
    <div>
      <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} getOperators={getOperators} />
    </div>
  );
};

export default QueryBuilderPanel;