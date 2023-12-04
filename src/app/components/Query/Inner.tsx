"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import { useQuery } from ".";

interface CodeLabel {
  code: string;
  label: string;
}

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
                className="max-h-full w-max overflow-y-auto rounded-lg bg-white shadow-lg scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-full dark:bg-neutral-800
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

const Inner = () => {
  const { data, query, updateQuery } = useQuery();
  const SC = ({
    title,
    data: dataField,
    value: valueField,
  }: {
    title: string;
    data: keyof typeof data;
    value: keyof typeof query;
  }) => (
    <SelectChip
      title={title}
      items={data[dataField]}
      value={query[valueField]}
      onChangeValue={(v) => updateQuery(valueField, v ?? "")}
    />
  );
  const [showDetail, setShowDetail] = useState(false);

  return (
    <section className="flex flex-wrap gap-2 rounded-lg border border-neutral-400 p-2 dark:border-neutral-600">
      <SC title="개설부서" data="departments" value="department" />
      <SC title="년도/학기" data="semesters" value="semester" />
      {showDetail && (
        <>
          <SC title="대학분류" data="universities" value="university" />
          <SC title="이수" data="credits" value="creditType" />
          <SC title="교과연구" data="researches" value="research" />
          <SC title="과정" data="types" value="level" />
          <SC title="언어" data="languages" value="language" />
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
