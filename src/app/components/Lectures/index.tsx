import { ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";

import fetchCourse from "@/api/course";
import fetchData from "@/api/data";
import { createTranslation, PropsWithLng } from "@/app/i18next";

import useQueryServer from "../Query/useQueryServer";
import Inner from "./Inner";

const Loader = async ({
  lng,
  searchParams,
}: PropsWithLng<{
  searchParams: Record<string, string>;
}>) => {
  const { t } = await createTranslation(lng);
  const data = await fetchData(lng);
  const {
    query: { semester, ...query },
  } = useQueryServer(
    data,
    new URLSearchParams(searchParams) as ReadonlyURLSearchParams,
  );
  const courses = await fetchCourse(lng, {
    ...query,
    year: semester.split("/")[0],
    semester: semester.split("/")[1],
  });

  return <Inner courses={courses} lng={lng} />;
};

const Lectures = ({
  lng,
  searchParams,
}: PropsWithLng<{
  searchParams: Record<string, string>;
}>) => {
  return (
    <Suspense
      fallback={<div>Loading...</div>}
      key={JSON.stringify(searchParams)}
    >
      <Loader searchParams={searchParams} lng={lng} />
    </Suspense>
  );
};

export default Lectures;
