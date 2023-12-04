import { ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";

import fetchCourse from "@/api/course";
import fetchData from "@/api/data";
import { createTranslation, PropsWithLng } from "@/app/i18next";

import useQueryServer from "../Query/useQueryServer";

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
  return (
    <section>
      <table>
        <thead>
          <tr>
            <th>{t("code")}</th>
            <th>{t("title")}</th>
            <th>{t("creditTypes")}</th>
            <th>{t("professor")}</th>
            <th>{t("pnt")}</th>
            <th>{t("timeTables")}</th>
            <th>{t("room")}</th>
            <th>{t("count")}</th>
            <th>{t("languages")}</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.code}>
              <td className="whitespace-pre">{course.code}</td>
              <td>{course.name}</td>
              <td>{course.creditType}</td>
              <td>
                {course.professor
                  .replace(/\[.+\]/g, "")
                  .split("\n")
                  .join(", ")}
              </td>
              <td>{course.pnt.replaceAll("/", "")}</td>
              <td className="whitespace-pre">
                {Object.entries(
                  course.timeTable
                    .split("\n")
                    .filter(Boolean)
                    .map((v) => v.split(" "))
                    .reduce<Record<string, string[]>>(
                      (prev, curr) => ({
                        ...prev,
                        [curr[1]]: [...(prev[curr[1]] ?? []), curr[0]],
                      }),
                      {},
                    ),
                )
                  .map(([time, days]) => `${days.join(", ")} ${time}`)
                  .join("\n")}
              </td>
              <td>{course.room}</td>
              <td className="whitespace-pre">{`${course.count}/${course.capacity}`}</td>
              <td>{course.language}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const Lectures = ({
  lng,
  searchParams,
}: PropsWithLng<{
  searchParams: Record<string, string>;
}>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loader searchParams={searchParams} lng={lng} />
    </Suspense>
  );
};

export default Lectures;
