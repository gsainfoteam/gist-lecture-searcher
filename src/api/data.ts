import { listQuery } from "./zeus";

interface OptionCode {
  CD: string;
  CD_NM: string;
}

interface Option extends OptionCode {
  KOR_CD_NM: string;
  ENG_CD_NM: string;
  CONN_1_CD: string;
  CONN_2_CD: string;
  CONN_3_CD: string;
  CONN_4_CD: string;
  CONN_5_CD: string;
  KOR_ALIAS_1_NM: string;
  KOR_ALIAS_2_NM: string;
  KOR_ALIAS_3_NM: string;
  ENG_ALIAS_1_NM: string;
  ENG_ALIAS_2_NM: string;
  ENG_ALIAS_3_NM: string;
  PANEL: string;
  CRUD_TXT: string;
}

interface Data {
  /** 과정구분 */
  dsCorsDetlDivCd: Option[];
  /** 이수구분 */
  dsCptnDivCd: Option[];
  /** 교과연구 */
  dsCursRechDivCd: Option[];
  /** 강의 언어 */
  dsLectureLangForm: Option[];
  /** 학기 */
  dsShtmCd: Option[];
  /** 개설부서 */
  dsSustMjCd: Array<
    OptionCode & {
      CD_NM_FULL: string;
      ENG_ORGN_NM: string;
      CD_NM_ALI: string;
      ORGN_CLSF_CD: string;
      UP_ORGN_CD: string;
      SBJT_CD_DIV: string;
      SUST_CHAR_CD: string;
      DIPS_YN: string;
      UNIV_GRSC_UNIFY_DEPT_YN: string;
      PANEL: string;
      CRUD_TXT: string;
    }
  >;
  /** 대학분류 */
  dsUnivClsfCd: Option[];
}

const labelCode = (item: OptionCode) => ({
  label: item.CD_NM,
  code: item.CD,
});

const dataTransformer = (data: Data) => ({
  types: data.dsCorsDetlDivCd.map((t) => ({
    ...labelCode(t),
    school: t.CONN_2_CD,
  })),
  languages: data.dsLectureLangForm.map(labelCode),
  semesters: data.dsShtmCd.map(labelCode),
  universities: data.dsUnivClsfCd.map(labelCode),
  departments: data.dsSustMjCd
    .filter((v) => v.UNIV_GRSC_UNIFY_DEPT_YN === "Y" || v.CD === "")
    .map(labelCode),
  researches: data.dsCursRechDivCd.map(labelCode),
  credits: data.dsCptnDivCd.map(labelCode),
});

const fetchData = () =>
  listQuery<Data>("/uls/ulsOpenListQ/onload", { lang_div: "kor" }).then(
    dataTransformer,
  );

export default fetchData;
