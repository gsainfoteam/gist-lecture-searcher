"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { Syllabuses as SyllabusesType } from "@/app/api/syllabuses/route";

import Syllabuses from "../Syllabus";

const SyllabusesModal = ({
  title,
  syllabuses,
  onClose: propOnClose,
}: {
  title?: string;
  syllabuses?: SyllabusesType;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const onClose = () => {
    setOpen(false);
    setShowOriginal(false);
    setTimeout(propOnClose, 500);
  };

  useEffect(() => {
    if (!title) return;
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
        <div className="box-border flex h-screen items-center justify-center p-2 md:p-8">
          <div
            className="animate-bottomUp max-h-full overflow-auto rounded-lg bg-white p-2 shadow-lg scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-full dark:bg-neutral-800 dark:scrollbar-thumb-neutral-700 md:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex justify-between font-bold">
              <div className="mr-4">{title}</div>
              <button onClick={onClose}>X</button>
            </div>
            {syllabuses?.pages.length ? (
              showOriginal ? (
                <Syllabuses pages={syllabuses.pages} />
              ) : (
                <div>
                  <div>title(korean): {syllabuses.title.korean}</div>
                  <div>title(english): {syllabuses.title.english}</div>
                  <div>classification: {syllabuses.classification}</div>
                  <div>code: {syllabuses.code}</div>
                  <div>pnt: {syllabuses.pnt}</div>
                  <div>instructor: {syllabuses.instructor}</div>
                  <div>language: {syllabuses.language}</div>
                  <div className="whitespace-pre-wrap">
                    outline: {syllabuses.outline}
                  </div>
                  <div className="whitespace-pre-wrap">
                    prerequisite: {syllabuses.prerequisite}
                  </div>
                  <div className="whitespace-pre-wrap">
                    references: {syllabuses.references}
                  </div>
                  <div className="whitespace-pre-wrap">
                    lectureMethod: {syllabuses.lectureMethod}
                  </div>
                  <div>grading: {syllabuses.grading}</div>
                  <div>etc: {syllabuses.etc}</div>
                  <div>schedules</div>
                  <ul className="list-disc pl-4">
                    {syllabuses.schedules.map((schedule) => (
                      <li key={schedule.week}>
                        {schedule.week}: {schedule.description} /{" "}
                        {schedule.remarks} ({schedule.onoff})
                      </li>
                    ))}
                  </ul>
                </div>
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
    </div>,
    document.body,
  );
};

export default SyllabusesModal;
