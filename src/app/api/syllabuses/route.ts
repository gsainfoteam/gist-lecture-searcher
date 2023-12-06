import axios from "axios";
import Excel from "exceljs";
import { NextRequest, NextResponse } from "next/server";

const clipApi = axios.create({
  baseURL: "https://zeus.gist.ac.kr/ClipReport4",
});

const exportOption = (pages: number) => ({
  exportType: 10,
  name: "cmVwb3J0",
  pageType: 1,
  startNum: 1,
  endNum: pages,
  option: {
    exportMethod: "3",
    mergeCell: true,
    mergeEmptyCell: true,
    splitCellAtPageSize: true,
    rightToLeft: false,
    widthRate: 100,
    heightRate: 100,
    coordinateErrorLimit: 10,
    processGerenalFormat: 1,
    printingMagnification: 100,
    fitToPageWhenPrinting: false,
    removeHyperlink: false,
    repeatPageSectionWhenAllSectionInOneSheet: false,
    type: "xlsx",
    splitPage: 0,
  },
});

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

  const viewerRes = await clipApi.post("/reportViewer.jsp", params);
  const uid = (viewerRes.data as string).match(/'uid':'([^']*)'/)?.[1];
  return uid;
};

const getPages = async (uid: string): Promise<number> => {
  const params = new URLSearchParams();
  params.set("ClipID", "R03");
  params.set("uid", uid);
  const res = await clipApi.post("/Clip.jsp", params);
  const data = eval(res.data);
  if (data.endReport) return data.count;
  await new Promise((resolve) => setTimeout(resolve, 100));
  return getPages(uid);
};

const getPage = async (uid: string, pageNumber: number) => {
  const params = new URLSearchParams();
  params.set("ClipID", "R02");
  params.set("pageNumber", `${pageNumber}`);
  params.set("uid", uid);
  params.set("html5", "true");
  params.set("DPI", "96");
  const res = await clipApi.post("/Clip.jsp", params);
  const resData = (res.data as string).split("{clipreport_separator}")[1];
  return resData;
};

const generateFile = async (uid: string, exportOption: object) => {
  const params = new URLSearchParams();
  params.set("ClipID", "R09S1");
  params.set("clipUID", uid);
  params.set("uid", uid);
  params.set("path", "/ClipReport4");
  params.set("optionValue", JSON.stringify(exportOption));
  params.set("is_ie", "true");
  params.set("exportN", "cmVwb3J0");
  params.set("exportType", "10");
  const res = await clipApi.post("/Clip.jsp", params);
  const data = eval(res.data);
  if (!data.status) throw new Error("Failed to generate file");
  return data;
};

const waitFile = async (uid: string): Promise<unknown> => {
  const params = new URLSearchParams();
  params.set("ClipID", "R09S2");
  params.set("clipUID", uid);
  params.set("uid", uid);
  const res = await clipApi.post("/Clip.jsp", params);
  const data = eval(res.data);
  if (data.status) return data;
  await new Promise((resolve) => setTimeout(resolve, 100));
  return waitFile(uid);
};

const getFile = async (uid: string, exportOption: object) => {
  const params = new URLSearchParams();
  params.set("ClipID", "R09S3");
  params.set("uid", uid);
  params.set("path", "/ClipReport4");
  params.set("optionValue", JSON.stringify(exportOption));
  params.set("is_ie", "true");
  params.set("exportN", "cmVwb3J0");
  params.set("exportType", "10");
  const res = await clipApi.post("/Clip.jsp", params, {
    responseType: "arraybuffer",
  });
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(res.data);
  return workbook;
};

export interface Syllabuses {
  pages: string[];
  classification: string;
  code: string;
  pnt: string;
  instructor: string;
  language: string;
  title: {
    korean: string;
    english: string;
  };
  outline: string;
  prerequisite: string;
  references: string;
  lectureMethod: string;
  grading: string;
  etc: string;
  schedules: {
    week: string;
    description: string;
    remarks: string;
    onoff: string;
  }[];
}

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
  const option = exportOption(pageCount);
  await generateFile(uid, option);
  await waitFile(uid);
  const wb = await getFile(uid, option);
  const ws = wb.worksheets[0];
  const data = {
    pages,
    classification: ws.getCell("B4").text,
    code: ws.getCell("E4").text,
    pnt: ws.getCell("G4").text,
    instructor: ws.getCell("I4").text,
    language: ws.getCell("L4").text,
    title: {
      korean: ws.getCell("D5").text,
      english: ws.getCell("D6").text,
    },
    outline: ws.getCell("B7").text,
    prerequisite: ws.getCell("B8").text,
    references: ws.getCell("B9").text,
    lectureMethod: ws.getCell("B10").text,
    grading: ws.getCell("B11").text,
    etc: ws.getCell("B12").text,
    schedules: ws
      .getRows(15, 20)
      ?.map((row) => ({
        week: row.getCell(1).text.trim(),
        description: row.getCell(2).text,
        remarks: row.getCell(8).text,
        onoff: row.getCell(11).text,
      }))
      .filter(({ week }) => /^\d{1,2}/.test(week)),
  };
  return NextResponse.json(data);
}
