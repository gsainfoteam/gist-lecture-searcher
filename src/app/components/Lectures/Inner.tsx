"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import type { Course } from "@/api/course";
import useSyllabuses from "@/api/syllabuses";
import { PropsWithLng } from "@/app/i18next";
import { useTranslation } from "@/app/i18next/client";

import Syllabuses from "../Syllabus";

const columnHelper = createColumnHelper<Course>();

const Inner = ({ courses, lng }: PropsWithLng<{ courses: Course[] }>) => {
  const { t } = useTranslation(lng);
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const syllabuses = useSyllabuses(selectedCourse);

  const columns = useMemo(
    () => [
      columnHelper.accessor("code", {
        header: t("code"),
        cell: (cell) => (
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setSelectedCourse(cell.row.original)}
          >
            {cell.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor("name", { header: t("title") }),
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
      <section className="block">
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
          <tbody className="overflow-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-full  dark:scrollbar-thumb-neutral-700">
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
        pages={syllabuses?.pages ?? (selectedCourse ? [] : undefined)}
        onClose={() => setSelectedCourse(undefined)}
      />
    </>
  );
};

const SyllabusesModal = ({
  pages,
  onClose,
}: {
  pages?: string[];
  onClose: () => void;
}) => {
  const [memoizedPages, setMemoizedPages] = useState(pages);

  useEffect(() => {
    if (pages) {
      setMemoizedPages(pages);
      return;
    }
    let cancelled = false;
    setTimeout(() => {
      if (cancelled) return;
      setMemoizedPages(undefined);
    }, 500);
    return () => {
      cancelled = true;
    };
  }, [pages]);

  if (!memoizedPages) return null;
  return createPortal(
    <div
      className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-500 ${
        pages ? "opacity-100" : "opacity-0"
      }`}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      onClick={(e) => {
        onClose();
        e.stopPropagation();
      }}
      tabIndex={-1}
    >
      <div className="absolute left-1/2 top-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 transform items-center p-8">
        <div className="h-full" onClick={(e) => e.stopPropagation()}>
          <div className="animate-bottomUp max-h-full w-max overflow-y-auto rounded-lg bg-white shadow-lg scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-full dark:bg-neutral-800 dark:scrollbar-thumb-neutral-700">
            {memoizedPages.length ? (
              <Syllabuses pages={memoizedPages} />
            ) : (
              <svg
                className="m-4 h-5 w-5 animate-spin text-black dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Inner;
