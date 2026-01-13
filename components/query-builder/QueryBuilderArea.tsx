'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import QueryBuilderActions from "./QueryBuilderActions";
import { Field, RuleGroupType } from "react-querybuilder";

const QueryBuilderPanel = dynamic(() => import("./QueryBuilderPanel"), {
  ssr: false,
});

type Props = {
  dataCount: number;
  fields: Field[];
  initialQuery?: RuleGroupType | null;
  currentTable: string;
}

const QueryBuilderArea = ({ dataCount, fields, initialQuery, currentTable }: Props) => {
  const [showFilter, setShowFilter] = useState(true);

  return (
    <div>
      <QueryBuilderActions dataCount={dataCount} showFilter={showFilter} setShowFilter={setShowFilter} />
      {showFilter && (
        <QueryBuilderPanel
          key={currentTable}
          fields={fields}
          initialQuery={initialQuery}
          currentTable={currentTable}
        />
      )}
    </div>
  )
};

export default QueryBuilderArea;