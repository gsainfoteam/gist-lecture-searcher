import Lectures from "../components/Lectures";
import Query from "../components/Query";
import { PropsWithLng } from "../i18next";

export default async function Home({
  params: { lng },
  searchParams,
}: {
  params: PropsWithLng;
  searchParams: Record<string, string>;
}) {
  return (
    <main className="flex max-h-screen flex-col overflow-hidden">
      <div className="sticky top-0 bg-white p-2 dark:bg-neutral-900">
        <Query lng={lng} />
      </div>
      <div className="flex-1 p-2">
        <Lectures searchParams={searchParams} lng={lng} />
      </div>
    </main>
  );
}
