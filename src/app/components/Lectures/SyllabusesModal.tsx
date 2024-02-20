"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { Syllabuses as SyllabusesType } from "@/app/api/syllabuses/route";
import { PropsWithLng } from "@/app/i18next";
import { useTranslation } from "@/app/i18next/client";

import Syllabuses from "../Syllabus";

const SyllabusesModal = ({
  title,
  syllabuses,
  onClose: propOnClose,
  lng,
}: PropsWithLng<{
  title?: string;
  syllabuses?: SyllabusesType;
  onClose: () => void;
}>) => {
  const { t } = useTranslation(lng);
  const [open, setOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const onClose = () => {
    setOpen(false);
    setTimeout(propOnClose, 500);
  };

  useEffect(() => {
    if (!title) return;
    setShowOriginal(false);
    setOpen(true);
  }, [title]);

  if (!title) return null;
  return createPortal(
    <div
      className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-500 ${
        open ? "opacity-100" : "pointer-events-none select-none opacity-0"
      }`}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      onClick={(e) => {
        onClose();
        e.stopPropagation();
      }}
      tabIndex={-1}
    >
      <div className="absolute w-screen ">
        <div className="box-border flex h-screen w-screen items-center justify-center md:p-8">
          <div
            className="animate-bottomUp flex max-h-full max-w-full flex-col bg-white p-2 shadow-lg dark:bg-neutral-800 md:rounded-lg md:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex gap-2 px-2">
              <div className="mr-4 font-bold">{title}</div>
              <div className="flex-1" />
              <button
                className="rounded-lg bg-neutral-200 p-1 dark:bg-neutral-600"
                onClick={() => setShowOriginal((prev) => !prev)}
              >
                show {showOriginal ? "summary" : "original"}
              </button>
              <button onClick={onClose}>X</button>
            </div>
            <div className="h-auto flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-full dark:scrollbar-thumb-neutral-700">
              {syllabuses?.pages.length ? (
                showOriginal ? (
                  <Syllabuses pages={syllabuses.pages} />
                ) : (
                  <table className="border-2 [&_td]:border [&_th]:border">
                    <tr>
                      <th>{t("universities")}</th>
                      <td>{syllabuses.classification}</td>
                      <th>{t("code")}</th>
                      <td>{syllabuses.code}</td>
                      <th>{t("pnt")}</th>
                      <td>{syllabuses.pnt}</td>
                      <th>{t("professor")}</th>
                      <td>{syllabuses.instructor}</td>
                      <th>{t("languages")}</th>
                      <td>{syllabuses.language}</td>
                    </tr>
                    <tr>
                      <th rowSpan={2}>{t("title")}</th>
                      <th>Korean</th>
                      <td colSpan={8}>{syllabuses.title.korean}</td>
                    </tr>
                    <tr>
                      <th>English</th>
                      <td colSpan={8}>{syllabuses.title.english}</td>
                    </tr>
                    <tr>
                      <th>{t("outline")}</th>
                      <td colSpan={9} className="whitespace-pre-wrap">
                        {syllabuses.outline}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("prerequisite")}</th>
                      <td colSpan={9} className="whitespace-pre-wrap">
                        {syllabuses.prerequisite}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("references")}</th>
                      <td colSpan={9} className="whitespace-pre-wrap">
                        {syllabuses.references}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("lectureMethod")}</th>
                      <td colSpan={9} className="whitespace-pre-wrap">
                        {syllabuses.lectureMethod}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("grading")}</th>
                      <td colSpan={9} className="whitespace-pre-wrap">
                        {syllabuses.grading}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("etc")}</th>
                      <td colSpan={9} className="whitespace-pre-wrap">
                        {syllabuses.etc}
                      </td>
                    </tr>
                    <tr className="border-y-2">
                      <th colSpan={10}>{t("schedules")}</th>
                    </tr>
                    <tr className="border-y-2">
                      <th>{t("week")}</th>
                      <th colSpan={7}>{t("description")}</th>
                      <th colSpan={1}>{t("remarks")}</th>
                      <th colSpan={1}>{t("onoff")}</th>
                    </tr>
                    {syllabuses.schedules.map((schedule) => (
                      <tr key={schedule.week}>
                        <td className="text-center">{schedule.week}</td>
                        <td colSpan={7}>{schedule.description}</td>
                        <td colSpan={1}>{schedule.remarks}</td>
                        <td colSpan={1}>{schedule.onoff}</td>
                      </tr>
                    ))}
                  </table>
                )
              ) : (
                <div className="flex items-center justify-center">
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
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SyllabusesModal;
