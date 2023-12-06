import { useEffect, useState } from "react";

import { Course } from "./course";

const useSyllabuses = (course?: Course) => {
  const [pages, setPages] = useState<string[]>();

  useEffect(() => {
    if (!course) {
      setPages(undefined);
      return () => {};
    }
    let cancelled = false;

    fetch("/api/syllabuses", {
      method: "POST",
      body: JSON.stringify(course),
    }).then(async (res) => {
      const data = await res.json();
      if (cancelled) return;
      setPages(data.pages);
    });
    return () => (cancelled = true);
  }, [course]);

  return course ? { pages } : undefined;
};

export default useSyllabuses;
