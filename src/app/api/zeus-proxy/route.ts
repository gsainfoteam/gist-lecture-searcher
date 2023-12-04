import { dataToSSV, extractDatasets, ssvToData } from '@/utils/ssv';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  const res = await axios.post(
    `https://zeus.gist.ac.kr/${path}`,
    dataToSSV({
      variables: Object.entries(await request.json()).map(([id, value]) => ({
        id,
        value,
      })),
    }),
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  );

  return NextResponse.json(extractDatasets(ssvToData(res.data)));
}
