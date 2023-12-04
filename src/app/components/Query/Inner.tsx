"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

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

const SelectChip = ({
  title,
  value,
  onChangeValue,
  items,
}: {
  title: string;
  value: string;
  onChangeValue: (value?: string) => void;
  items: CodeLabel[];
}) => {
  const [open, setOpen] = useState(false);
  const selected = items.find((v) => v.code === value);
  return (
    <div onClick={() => setOpen(true)} role="button">
      <div className="hidden">{title}</div>
      <div
        className={`rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800 ${
          selected?.code ? "" : "text-neutral-600 dark:text-neutral-400"
        }`}
      >
        {selected?.code ? selected.label : title}
      </div>

      <select
        className="hidden"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        disabled
        role="button"
      >
        {items.map(({ code, label }) => (
          <option key={code} value={code}>
            {code ? label : title}
          </option>
        ))}
      </select>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50"
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            onClick={(e) => {
              setOpen(false);
              e.stopPropagation();
            }}
            tabIndex={-1}
          >
            <div className="absolute left-1/2 top-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 transform items-center p-8">
              <div
                className="scrollbar-thumb-rounded-full max-h-full w-max overflow-y-auto rounded-lg bg-white shadow-lg scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 dark:bg-neutral-800
               dark:scrollbar-thumb-neutral-700"
              >
                <div className="flex flex-col gap-2 p-4">
                  {items.map(({ code, label }) => (
                    <button
                      key={code}
                      className={`rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 ${
                        code === value
                          ? "bg-neutral-100 dark:bg-neutral-700"
                          : ""
                      }`}
                      onClick={() => {
                        setOpen(false);
                        onChangeValue(code);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

const Inner = ({ data: rawData }: { data: QueryData }) => {
  const { data, initialData } = getInitialData(rawData);
  const [query, setQuery] = useState(initialData);
  const filteredData = {
    ...data,
    types: data.types.filter((t) => t.school === query.university || !t.code),
  };
  const SC = ({
    title,
    dataField,
    valueField,
  }: {
    title: string;
    dataField: keyof typeof data;
    valueField: keyof typeof initialData;
  }) => (
    <SelectChip
      title={title}
      items={filteredData[dataField]}
      value={query[valueField]}
      onChangeValue={(v) => setQuery({ ...query, [valueField]: v ?? "" })}
    />
  );
  const [showDetail, setShowDetail] = useState(false);

  return (
    <section className="m-2 flex flex-wrap gap-2 rounded-lg border border-neutral-400 p-2 dark:border-neutral-600">
      <SC title="개설부서" dataField="departments" valueField="department" />
      <SC title="년도/학기" dataField="semesters" valueField="semester" />
      {showDetail && (
        <>
          <SC
            title="대학분류"
            dataField="universities"
            valueField="university"
          />
          <SC title="이수" dataField="credits" valueField="creditType" />
          <SC title="교과연구" dataField="researches" valueField="research" />
          <SC title="과정" dataField="types" valueField="level" />
          <SC title="언어" dataField="languages" valueField="language" />
        </>
      )}
      <button
        className="rounded-lg bg-neutral-100 p-2 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
        onClick={() => setShowDetail(!showDetail)}
      >
        {showDetail ? "-" : "+"}
      </button>
    </section>
  );
};

export default Inner;
