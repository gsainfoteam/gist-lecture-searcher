'use client';

import type fetchData from '@/api/data';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
            label: `${y}년도 ${s.label}`,
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
      department: '',
      semester: `${year}/${semester}`,
      creditType: '',
      research: '',
      level: '',
      language: '',
    },
  };
};

const SelectChip = ({
  title,
  value,
  onChangeValue,
  items,
  notUnselectable,
}: {
  title: string;
  value: string;
  onChangeValue: (value?: string) => void;
  items: CodeLabel[];
  notUnselectable?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const selected = items.find((v) => v.code === value);
  return (
    <div onClick={() => setOpen(true)} role="button">
      <div className="hidden">{title}</div>
      <div
        className={`bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg shadow-lg ${
          selected?.code ? '' : 'text-neutral-600 dark:text-neutral-400'
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
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            onClick={(e) => {
              setOpen(false);
              e.stopPropagation();
            }}
            tabIndex={-1}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full p-8">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-y-scroll h-full w-max">
                <div className="flex flex-col gap-2 p-4">
                  {items.map(({ code, label }) => (
                    <button
                      key={code}
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg p-2"
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
      {/* <Chip
        label={value && label ? `${title}: ${label}` : title}
        onClick={() => setOpen(true)}
        onDelete={
          !notUnselectable && value ? () => onChangeValue('') : undefined
        }
      /> */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {items
              .filter((v) => (notUnselectable ? v.code : true))
              .map(({ code, label }) => (
                <FormControlLabel
                  key={code}
                  value={code}
                  control={<Radio />}
                  label={label}
                />
              ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleOk}>확인</Button>
        </DialogActions>
      </Dialog> */}
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
      onChangeValue={(v) => setQuery({ ...query, [valueField]: v ?? '' })}
    />
  );
  return (
    <section className="flex gap-2 p-2">
      <SC title="대학분류" dataField="universities" valueField="university" />
      <SC title="개설부서" dataField="departments" valueField="department" />
      <SC title="년도/학기" dataField="semesters" valueField="semester" />
      <SC title="이수" dataField="credits" valueField="creditType" />
      <SC title="교과연구" dataField="researches" valueField="research" />
      <SC title="과정" dataField="types" valueField="level" />
      <SC title="언어" dataField="languages" valueField="language" />
    </section>
  );
};

export default Inner;
