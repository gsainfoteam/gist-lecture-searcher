import { Suspense } from "react";

import fetchData from "@/api/data";
import { PropsWithLng } from "@/app/i18next";

import Inner from "./Inner";

const Loader = async ({ lng }: PropsWithLng) => {
  const data = await fetchData(lng);
  return <Inner data={data} lng={lng} />;
};

const Query = ({ lng }: PropsWithLng) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loader lng={lng} />
    </Suspense>
  );
};

export default Query;
