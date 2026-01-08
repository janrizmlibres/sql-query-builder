'use client';

import { useState } from "react";
import QueryBuilderActions from "./QueryBuilderActions";
import QueryBuilderPanel from "./QueryBuilderPanel";

const QueryBuilderArea = () => {
  const [showFilter, setShowFilter] = useState(true);

  return (
    <div>
      <QueryBuilderActions showFilter={showFilter} setShowFilter={setShowFilter} />
      {showFilter && <QueryBuilderPanel />}
    </div>
  )
};

export default QueryBuilderArea;