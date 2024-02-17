"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import type { Course } from "@/api/course";
import useSyllabuses from "@/api/syllabuses";
import { PropsWithLng } from "@/app/i18next";
import { useTranslation } from "@/app/i18next/client";

import RegistrationInfoModal from "./RegistrationInfoModal";
import SyllabusesModal from "./SyllabusesModal";

const columnHelper = createColumnHelper<Course>();

export interface CountStamp {
  time: string;
  count: number;
}

export interface RegistrationInfo extends Course {
  countStamps: CountStamp[];
}

const Inner = ({ courses, lng }: PropsWithLng<{ courses: Course[] }>) => {
  const { t } = useTranslation(lng);
  const [selectedSyllabusCourse, setSelectedSyllabusCourse] =
    useState<Course>();
  const syllabuses = useSyllabuses(selectedSyllabusCourse);

  const [selectedRegistrationInfoCourse, setSelectedRegistrationInfoCourse] =
    useState<Course>();

  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>();

  useEffect(() => {
    const fileAllocator = () => {
      if (
        selectedRegistrationInfoCourse?.year === "2023" &&
        selectedRegistrationInfoCourse?.semester === "USR03.20"
      ) {
        return "2023-fall.json";
      }

      if (
        selectedRegistrationInfoCourse?.year === "2024" &&
        selectedRegistrationInfoCourse?.semester === "USR03.10"
      ) {
        return "2024-spring.json";
      }

      return null;
    };

    const allocatedFile = fileAllocator();

    const registrationInfoFile: RegistrationInfo[] = allocatedFile
      ? require(`@/../public/${allocatedFile}`)
      : null;

    if (registrationInfoFile && selectedRegistrationInfoCourse) {
      const registrationInfo = registrationInfoFile.find(
        (registrationInfo) =>
          selectedRegistrationInfoCourse.subjectCode +
            selectedRegistrationInfoCourse.classCode ===
          registrationInfo.subjectCode + registrationInfo.classCode,
      );

      setRegistrationInfo(registrationInfo);
      console.log(registrationInfo);
    } else {
      setRegistrationInfo(undefined);
    }
  }, [selectedRegistrationInfoCourse]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("code", {
        header: t("code"),
        cell: (cell) => (
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setSelectedSyllabusCourse(cell.row.original)}
          >
            {cell.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor("name", {
        header: t("title"),
        cell: (cell) => (
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setSelectedRegistrationInfoCourse(cell.row.original)}
          >
            {cell.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor("creditType", { header: t("creditTypes") }),
      columnHelper.accessor("professor", {
        header: t("professor"),
        cell: (cell) =>
          cell
            .getValue()
            .replace(/\[.+\]/g, "")
            .split("\n")
            .join(", "),
      }),
      columnHelper.accessor("pnt", { header: t("pnt") }),
      columnHelper.accessor("timeTable", {
        header: t("timeTables"),
        cell: (cell) =>
          Object.entries(
            cell
              .getValue()
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
            .join("\n"),
      }),
      columnHelper.accessor("room", { header: t("room") }),
      columnHelper.accessor("count", {
        header: t("count"),
        cell: (cell) => `${cell.getValue()}/${cell.row.original.capacity}`,
      }),
      columnHelper.accessor("language", {
        header: t("languages"),
        cell: (cell) =>
          cell.getValue().replace("Korean", "K").replace("English", "E"),
      }),
    ],
    [t],
  );
  const table = useReactTable({
    data: courses,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <section className="block min-h-full min-w-full flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-full dark:scrollbar-thumb-neutral-700">
        <table className="border border-gray-200 dark:border-gray-600">
          <thead className="bg-white dark:bg-neutral-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="group relative whitespace-pre border-b border-r border-gray-200 dark:border-gray-600"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-black/50 dark:bg-white/50 ${
                          header.column.getIsResizing()
                            ? "bg-blue-500 opacity-100 dark:bg-blue-500"
                            : "group-hover:opacity-100 hover-hover:opacity-0"
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="h-12 whitespace-pre border-b border-r border-gray-200 dark:border-gray-600"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <SyllabusesModal
        lng={lng}
        title={selectedSyllabusCourse?.name}
        syllabuses={syllabuses}
        onClose={() => setSelectedSyllabusCourse(undefined)}
      />
      <RegistrationInfoModal
        registrationInfo={registrationInfo}
        onClose={() => setSelectedRegistrationInfoCourse(undefined)}
      />
    </>
  );
};

export default Inner;
