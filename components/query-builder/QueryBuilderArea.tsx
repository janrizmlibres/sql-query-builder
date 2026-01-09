'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import QueryBuilderActions from "./QueryBuilderActions";
import { Field } from "react-querybuilder";

const QueryBuilderPanel = dynamic(() => import("./QueryBuilderPanel"), {
  ssr: false,
});

type Props = {
  dataCount: number;
  fields: Field[];
}

const QueryBuilderArea = ({ dataCount, fields }: Props) => {
  const [showFilter, setShowFilter] = useState(true);

  return (
    <div>
      <QueryBuilderActions dataCount={dataCount} showFilter={showFilter} setShowFilter={setShowFilter} />
      {showFilter && <QueryBuilderPanel fields={fields} />}
    </div>
  )
};

export default QueryBuilderArea;