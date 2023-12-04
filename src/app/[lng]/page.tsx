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
    <main>
      <div className="sticky top-0 bg-white p-2 dark:bg-neutral-900">
        <Query lng={lng} />
      </div>
      <Lectures searchParams={searchParams} lng={lng} />
    </main>
  );
}
