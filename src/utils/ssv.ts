const rs = "\u001e";
const us = "\u001f";

interface DataType {
  id: string;
  type?: string;
  length?: number;
}

interface Variable extends DataType {
  value: unknown;
}

interface RowType extends DataType {
  sumType?: string;
  sumText?: string;
}

enum RecordType {
  normal = "N",
  inserted = "I",
  updated = "U",
  deleted = "D",
  original = "O",
}

interface Record {
  type: RecordType;
  value: unknown[];
}

interface Dataset {
  id: string;
  constColumnInfos?: Variable[][];
  columnInfos?: Variable[][];
  records?: Record[];
}

const serializeData = ({ id, type, length }: DataType) => {
  const resolvedType = type ?? (length ? "STRING" : undefined);
  const typeText = resolvedType ? `:${resolvedType}` : "";
  const lengthText = length ? `(${length})` : "";
  return `${id}${typeText}${lengthText}`;
};

const serializeVariable = ({ value, ...data }: Variable) => {
  const valueText = `=${String(value || "")}`;
  return `${serializeData(data)}${valueText}`;
};

const serializeRowType = ({ sumType, sumText, ...data }: RowType) => {
  const sumTypeText = sumType ? `:${sumType}` : "";
  const sumTextText = sumText ? `:${sumText}` : "";
  return `${serializeData(data)}${sumTypeText}${sumTextText}`;
};

const deserializeData = (data: string) => {
  const [id, typeLength] = data.split(":");
  const [type, length] = typeLength.split(/[()]/);
  return {
    id,
    type: type || undefined,
    length: length ? Number.parseInt(length) : undefined,
  };
};

const deserializeVariable = (variable: string) => {
  const [data, value] = variable.split("=");
  return {
    ...deserializeData(data),
    value: value || undefined,
  };
};

export const dataToSSV = ({
  variables = [],
  codePage = "utf-8",
  datasets = [],
}: {
  variables?: Variable[];
  codePage?: string;
  datasets?: Dataset[];
}) => {
  const headerText = `SSV:${codePage}${rs}`;
  const variablesText = variables
    .map(serializeVariable)
    .map((t) => `${t}${rs}`)
    .join("");
  const datasetsText = datasets
    .map(({ id, constColumnInfos, columnInfos, records }) => {
      const header = `Dataset:${id}${rs}`;
      const constColumnInfosText = (constColumnInfos ?? [])
        .map((constColumnInfo) => {
          const constColumnInfoText = constColumnInfo
            .map(serializeVariable)
            .join(us);
          return `_Const_${us}${constColumnInfoText}${rs}`;
        })
        .join("");
      const columnInfosText = (columnInfos ?? [])
        .map((columnInfo) => {
          const columnInfoText = columnInfo.map(serializeRowType).join(us);
          return `_RowType_${us}${columnInfoText}${rs}`;
        })
        .join("");
      const recordsText = (records ?? [])
        .map(({ type, value }) => `${type}${us}${value.join(us)}${rs}`)
        .join("");
      return `${header}${constColumnInfosText}${columnInfosText}${recordsText}`;
    })
    .join(rs);
  return `${headerText}${variablesText}${datasetsText}${rs}`;
};

export const ssvToData = (ssv: string) => {
  const [header, ...datasets] = ssv.split("Dataset:");
  const [streamHeader, ...variables] = header.split(rs).slice(0, -1);
  const [, codePage] = streamHeader.split(":");

  const parsedVariables: Variable[] = variables.map((variable) => {
    const [head, value] = variable.split("=");
    const [id, typeLength] = head.split(":");
    const [type, length] = typeLength.split(/[()]/);

    return {
      id,
      value,
      type,
      length: length ? Number.parseInt(length) : undefined,
    };
  });
  const parsedDatasets: Dataset[] = datasets.map((datasetText) => {
    const [id, ...records] = datasetText.split(rs);
    const constColumnInfos = records
      .filter((record) => record.startsWith("_Const_"))
      .map(
        (string) =>
          string.split(us).slice(1).map(deserializeVariable) as Variable[],
      );
    const columnInfos = records
      .filter((record) => record.startsWith("_RowType_"))
      .map(
        (string) =>
          string.split(us).slice(1).map(deserializeVariable) as Variable[],
      );
    const parsedRecords: Record[] = records
      .filter((record) => !record.startsWith("_") && record)
      .map((record) => {
        const [type, ...value] = record.split(us);
        return {
          type: type as RecordType,
          value,
        };
      });

    return {
      id,
      constColumnInfos,
      columnInfos,
      records: parsedRecords,
    };
  });

  return {
    codePage,
    variables: parsedVariables,
    datasets: parsedDatasets,
  };
};

export const extractDatasets = ({ datasets }: ReturnType<typeof ssvToData>) =>
  datasets.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.id]: curr.records?.map((record) =>
        Object.fromEntries(
          record.value.map((value, index) => [
            curr.columnInfos?.[0][index].id,
            value,
          ]),
        ),
      ),
    }),
    {},
  );
