import { ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";

import fetchCourse from "@/api/course";
import fetchData from "@/api/data";

import useQueryServer from "../Query/useQueryServer";

const Loader = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const data = await fetchData();
  const {
    query: { semester, ...query },
  } = useQueryServer(
    data,
    new URLSearchParams(searchParams) as ReadonlyURLSearchParams,
  );
  const courses = await fetchCourse({
    ...query,
    year: semester.split("/")[0],
    semester: semester.split("/")[1],
  });
  return (
    <>
      <div>Query: {JSON.stringify(courses)}</div>
    </>
  );
};

const Lectures = ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loader searchParams={searchParams} />
    </Suspense>
  );
};

export default Lectures;
