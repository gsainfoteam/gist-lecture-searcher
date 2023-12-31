"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import { PropsWithLng } from "@/app/i18next";
import { useTranslation } from "@/app/i18next/client";

import useQuery from "./useQuery";

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
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-1/2 top-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 transform items-center p-8"
            >
              <div className="max-h-full w-max overflow-y-auto rounded-lg bg-white shadow-lg scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-full dark:bg-neutral-800 dark:scrollbar-thumb-neutral-700">
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

const Inner = ({
  data: rawData,
  lng,
}: PropsWithLng<{ data: Parameters<typeof useQuery>[0] }>) => {
  const { data, query, updateQuery } = useQuery(rawData);
  const { t } = useTranslation(lng);

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
      onChangeValue={(v) => updateQuery(valueField, v)}
    />
  );
  const [showDetail, setShowDetail] = useState(false);

  return (
    <section className="flex flex-wrap gap-2 rounded-lg border border-neutral-400 p-2 dark:border-neutral-600">
      <SC title={t("departments")} data="departments" value="department" />
      <SC title={t("semesters")} data="semesters" value="semester" />
      {showDetail && (
        <>
          <SC
            title={t("universities")}
            data="universities"
            value="university"
          />
          <SC title={t("creditTypes")} data="credits" value="creditType" />
          <SC title={t("researches")} data="researches" value="research" />
          <SC title={t("levels")} data="types" value="level" />
          <SC title={t("languages")} data="languages" value="language" />
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
