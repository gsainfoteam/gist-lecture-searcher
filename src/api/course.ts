import { listQuery } from './zeus';

interface CourseCommonData {
  /** 년도 */
  YY: string;
  /** 학기 */
  SHTM_CD: string;
  /** 분반 */
  DCLSS_NO: string;
  /** 개설부서코드 */
  SUST_MJ_CD: string;
  /** 대학분류 */
  UNIV_CLSF_CD: string;
  /** 교과목코드 */
  SBJT_NO: string;
  /** 개설부서 */
  SUST_MJ_NM: string;
  /** 교과목명 */
  SBJT_NM: string;
  PANEL: string;
  CRUD_TXT: string;
}

interface CourseMainData extends CourseCommonData {
  /** 학기 이름 */
  SHTM_NM: string;
  /** 교과목-분반 */
  SNJT_DCLSS_NO: string;
  /** 이수구분 */
  CPTN_DIV_NM: string;
  /** 교과연구 */
  CURS_RECH_DIV_NM: string;
  /** 담당교수[번호] */
  LT_SPRF_NM: string;
  /** 과정구분 */
  CORS_DETL_DIV_NM: string;
  /** 강/실/학 */
  PNT: string;
  /** 강의실 */
  ROOM_NM: string;
  /** 시간표 */
  TMTBL_NM: string;
  /** 수강 정원 */
  TLSN_CAPA: string;
  /** 수강 인원 */
  TLSN_CNT: string;
  CNCLLT_YN: string;
  LT_SHARE_RPST: string;
  FORS_SBJT_INFO: string;
  LT_SHARE_SUST_MJ_NM: string;
  RETLSN_EXCPT_YN: string;
  /** 강의 언어 */
  LT_LANG: string;
  /** 설명 영상 */
  DESC_VIDEO: string;
  VIDEO_CNT: string;
  /** 세부분류 */
  DETA_CLSF: string;
  /** 수업 구분 코드 (대면/비대면) */
  LT_MTHD_CD: string;
  LT_MTHD_NM: string;
  CHOICE_MOOC: string;
}

interface CourseTmpData extends CourseCommonData {
  /** 교수 번호 */
  LT_SPRF_NO: string;
  /** 담당교수 */
  LT_SPRF_NM: string;
  /** 이메일 */
  EMAIL: string;
  /** 파일 등록여부 */
  FILE_YN: string;
}

const courseTransform = (data: {
  dsMain: CourseMainData[];
  dsMainTmp: CourseTmpData[];
}) =>
  data.dsMain.map((course) => ({
    subjectCode: course.SBJT_NO,
    university: course.UNIV_CLSF_CD,
    year: course.YY,
    semester: course.SHTM_CD,
    classCode: course.DCLSS_NO,
    departmentCode: course.SUST_MJ_CD,
    department: course.SUST_MJ_NM,
    code: course.SNJT_DCLSS_NO,
    name: course.SBJT_NM,
    creditType: course.CPTN_DIV_NM,
    detailType: course.DETA_CLSF,
    research: course.CURS_RECH_DIV_NM,
    professor: course.LT_SPRF_NM,
    level: course.CORS_DETL_DIV_NM,
    pnt: course.PNT,
    timeTable: course.TMTBL_NM,
    room: course.ROOM_NM,
    capacity: Number.parseInt(course.TLSN_CAPA),
    count: course.TLSN_CNT ? Number.parseInt(course.TLSN_CNT) : 0,
    language: course.LT_LANG,
  }));

const fetchCourse = (params?: {
  semester: string;
  department: string;
  university: string;
  year: string;
  language: string;
  creditType: string;
  research: string;
  level: string;
}) =>
  listQuery<Parameters<typeof courseTransform>[0]>('/zeus/select', {
    univ_clsf_cd: params?.university, // 대학분류
    yy: params?.year,
    shtm_cd: params?.semester, // 학기
    sust_mj_cd: params?.department, // 개설부서
    cptn_div_cd: params?.creditType, // 이수구분
    curs_rech_div_cd: params?.research, // 교과연구
    cors_detl_div_cd: params?.level, // 과정구분
    lang_div: 'kor', // 응답언어
    user_div: 'lec', // 고정
    cncllt_yn: 'N', // 고정값
    sbjt_nm: '', // 강의명
    lt_lang: params?.language, // 강의언어
  }).then(courseTransform);

export default fetchCourse;
