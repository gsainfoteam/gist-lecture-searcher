import { dataToSSV, extractDatasets, ssvToData } from '@/utils/ssv';

export const listQuery = async <T>(action: string, body: object) => {
  const result = await fetch(
    `https://zeus.gist.ac.kr/uls/ulsOpenListQ/${action}.do`,
    {
      method: 'POST',
      body: JSON.stringify(
        dataToSSV({
          variables: Object.entries(body).map(([id, value]) => ({
            id,
            value,
          })),
        }),
      ),
    },
  );
  const data = await result.text();
  return extractDatasets(ssvToData(data)) as T;
};
