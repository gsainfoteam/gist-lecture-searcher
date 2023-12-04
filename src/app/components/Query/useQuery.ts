import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import useQueryServer from "./useQueryServer";

const useQuery = (rawData: Parameters<typeof useQueryServer>[0]) => {
  const searchParams = useSearchParams();
  const { data, query: initialQuery } = useQueryServer(rawData, searchParams);
  const { replace } = useRouter();
  const [query, setQuery] = useState(initialQuery);
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
