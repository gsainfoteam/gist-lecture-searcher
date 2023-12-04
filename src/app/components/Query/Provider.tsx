"use client";

import { createContext, useContext, useState } from "react";

import type fetchData from "@/api/data";

type QueryData = Awaited<ReturnType<typeof fetchData>>;
interface CodeLabel {
  code: string;
  label: string;
}

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
      semester: `${year}/${semester}`,
      creditType: "",
      research: "",
      level: "",
      language: "",
    },
  };
};

const context = createContext<ReturnType<typeof useQueryProvider> | undefined>(
  undefined,
);

const useQueryProvider = (rawData: QueryData) => {
  const { data, initialData } = getInitialData(rawData);
  const [query, setQuery] = useState(initialData);
  const filteredData = {
    ...data,
    types: data.types.filter((t) => t.school === query.university || !t.code),
  };
  const updateQuery = (key: keyof typeof initialData, value: string) =>
    setQuery({ ...query, [key]: value ?? "" });
  return {
    data: filteredData,
    query,
    updateQuery,
  };
};

export const useQuery = () => {
  const provider = useContext(context);
  if (!provider) throw new Error("QueryProvider not found");
  return provider;
};

export const QueryProvider = ({
  data: rawData,
  children,
}: React.PropsWithChildren<{ data: QueryData }>) => {
  const provider = useQueryProvider(rawData);
  return <context.Provider value={provider}>{children}</context.Provider>;
};
