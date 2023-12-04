import Lectures from "../components/Lectures";
import Query from "../components/Query";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <main>
      <div className="sticky top-0 bg-white p-2 dark:bg-neutral-900">
        <Query />
      </div>
      <Lectures searchParams={searchParams} />
    </main>
  );
}
