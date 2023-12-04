import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type fetchData from "@/api/data";

type QueryData = Awaited<ReturnType<typeof fetchData>>;
const getInitialData = (data: QueryData) => {
  const year = new Date().getFullYear();
  const semesters = [
    ...data.semesters.filter((s) => !s.code),
    ...[...Array(10)]
      .map((_, i) => year - i)
      .flatMap((y) =>
        data.semesters
          .filter((s) => s.code)
          .reverse()
          .map((s) => ({
            label: `${y}/${s.label}`,
            code: `${y}/${s.code}`,
          })),
      ),
  ];
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

const useQuery = (rawData: QueryData) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const { data, initialData } = useMemo(
    () => getInitialData(rawData),
    [rawData],
  );
  const [query, setQuery] = useState({
    ...initialData,
    ...Object.fromEntries(searchParams.entries()),
  });
  const filteredData = {
    ...data,
    types: data.types.filter((t) => t.school === query.university || !t.code),
  };

  useEffect(() => {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v),
    );
    replace(`?${params.toString()}`);
  }, [query, replace, searchParams]);

  const updateQuery = (key: keyof typeof query, value = "") =>
    setQuery((prev) => ({ ...prev, [key]: value }));

  return {
    data: filteredData,
    query,
    updateQuery,
  };
};

export default useQuery;
