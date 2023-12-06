import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const getUid = async (body: any) => {
  const params = new URLSearchParams();
  params.set("PG_TITLE", "SYLLABUS");
  params.set("UNIV_CLSF_CD", body.university);
  params.set("SUST_MJ_CD", body.departmentCode);
  params.set("YY", body.year);
  params.set("SHTM_CD", body.semester);
  params.set("SBJT_NO", body.subjectCode);
  params.set("DCLSS_NO", body.classCode);
  params.set("_path", "/uni/uls/UlsOpenSyllabusR");

  const viewerRes = await axios.post(
    "https://zeus.gist.ac.kr/ClipReport4/reportViewer.jsp",
    params,
  );
  const uid = (viewerRes.data as string).match(/'uid':'([^']*)'/)?.[1];
  return uid;
};

const getPages = async (uid: string): Promise<number> => {
  const params = new URLSearchParams();
  params.set("ClipID", "R03");
  params.set("uid", uid);
  const res = await axios.post(
    "https://zeus.gist.ac.kr/ClipReport4/Clip.jsp",
    params,
  );
  const resData = JSON.parse(
    (res.data as string).slice(1, -1).replace(/'/g, '"'),
  );
  if (!resData.endReport) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getPages(uid);
  }
  const count = resData.count;
  return count;
};

const getPage = async (uid: string, pageNumber: number) => {
  const params = new URLSearchParams();
  params.set("ClipID", "R02");
  params.set("pageNumber", `${pageNumber}`);
  params.set("uid", uid);
  params.set("html5", "true");
  params.set("DPI", "96");
  const res = await axios.post(
    "https://zeus.gist.ac.kr/ClipReport4/Clip.jsp",
    params,
  );
  const resData = (res.data as string).split("{clipreport_separator}")[1];
  return resData;
};

export async function POST(req: NextRequest) {
  const jsonBody = await req.json();
  const uid = await getUid(jsonBody);
  if (!uid) {
    return NextResponse.json({}, { status: 404 });
  }
  const pageCount = await getPages(uid);
  const pages = await Promise.all(
    [...Array(pageCount)].map(async (_, i) => await getPage(uid, i)),
  );
  return NextResponse.json({ pages });
}
