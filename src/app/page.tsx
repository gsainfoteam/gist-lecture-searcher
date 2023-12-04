import fetchData from '@/api/data';

export default async function Home() {
  const data = await fetchData();
  const semesters = [
    ...data.semesters.filter((s) => !s.code),
    ...[...Array(10)]
      .map((_, i) => 2023 - i)
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
  return <main>{JSON.stringify(semesters)}</main>;
}
