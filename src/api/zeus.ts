export const listQuery = async <T>(action: string, body: object) => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/zeus-proxy?path=${action}.do`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  const json = await result.json();
  return json as T;
};
