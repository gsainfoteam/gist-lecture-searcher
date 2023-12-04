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
    <section>
      <table>
        <thead>
          <tr>
            <th>코드</th>
            <th>교과목명</th>
            <th>이수</th>
            <th>담당교수</th>
            <th>강실학</th>
            <th>시간표</th>
            <th>강의실</th>
            <th>인원</th>
            <th>언어</th>
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
