export const listQuery = async <T>(action: string, body: object) => {
  const result = await fetch(
    `${process.env.API_BASE_URL}/zeus-proxy?path=${action}.do`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return result.json() as T;
};