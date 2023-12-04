import { ReadonlyURLSearchParams } from "next/navigation";

import type fetchData from "@/api/data";

type QueryData = Awaited<ReturnType<typeof fetchData>>;
const getInitialData = (data: QueryData) => {
  const year = new Date().getFullYear();
  const semesters = [...Array(10)]
    .map((_, i) => year - i)
    .flatMap((y) =>
      data.semesters
        .filter((s) => s.code)
        .reverse()
        .map((s) => ({
          label: `${y}/${s.label}`,
          code: `${y}/${s.code}`,
        })),
    );
  const month = new Date().getMonth();
  const semester = [1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 4][month];
  const universities = data.universities.filter((u) => u.code);

  return {
    data: { ...data, universities, semesters },
    initialData: {
      university: universities[universities.length - 1].code,
      department: "",
      semester: `${year}/${data.semesters[semester].code}`,
      creditType: "",
      research: "",
      level: "",
      language: "",
    },
  };
};

const useQueryServer = (
  rawData: QueryData,
  searchParams: ReadonlyURLSearchParams,
) => {
  const { data, initialData } = getInitialData(rawData);
  const query = {
    ...initialData,
    ...Object.fromEntries(
      Array.from(searchParams.entries()).filter(([, v]) => v),
    ),
  };
  const filteredData = {
    ...data,
    types: data.types.filter((t) => t.school === query.university || !t.code),
  };

  return { data: filteredData, query };
};

export default useQueryServer;
