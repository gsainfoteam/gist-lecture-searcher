import { Suspense } from "react";

import fetchData from "@/api/data";

import Inner from "./Inner";

const Loader = async () => {
  const data = await fetchData();
  return <Inner data={data} />;
};

const Query = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loader />
    </Suspense>
  );
};

export default Query;
