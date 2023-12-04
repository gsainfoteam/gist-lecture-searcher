import fetchData from '@/api/data';
import { Suspense, use } from 'react';

const Inner = () => {
  const data = use(fetchData());
  const semesters = [
    ...data.semesters.filter((s) => !s.code),
    ...[...Array(10)]
      .map((_, i) => new Date().getFullYear() - i)
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

  return <>{JSON.stringify({ ...data, semesters })}</>;
};

const Query = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner />
    </Suspense>
  );
};

export default Query;
