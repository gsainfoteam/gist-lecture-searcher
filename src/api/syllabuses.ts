import { useEffect, useState } from "react";

import type { Syllabuses } from "@/app/api/syllabuses/route";

import { Course } from "./course";

const useSyllabuses = (course?: Course) => {
  const [syllabuses, setSyllabuses] = useState<Syllabuses>();

  useEffect(() => {
    if (!course) return setSyllabuses(undefined);
    let cancelled = false;

    fetch("/api/syllabuses", {
      method: "POST",
      body: JSON.stringify(course),
    }).then(async (res) => {
      const data = await res.json();
      if (cancelled) return;
      setSyllabuses(data);
    });
    return () => {
      cancelled = true;
    };
  }, [course]);

  return syllabuses;
};

export default useSyllabuses;
