import fetchData from '@/api/data';
import { Suspense, use } from 'react';
import Inner from './Inner';

const Loader = async () => {
  const data = await fetchData();
  return <Inner data={data} />;
};

const Query = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loader />
    </Suspense>
  );
};

export default Query;
