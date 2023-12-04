import fetchData from "@/api/data";

import Query, { QueryProvider } from "./components/Query";

export default async function Home() {
  const data = await fetchData();
  return (
    <QueryProvider data={data}>
      <main>
        <div className="sticky top-0 bg-white p-2 dark:bg-neutral-900">
          <Query />
        </div>
      </main>
    </QueryProvider>
  );
}
