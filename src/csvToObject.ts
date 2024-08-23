import { readFile } from "fs";

function generateObject(header: string[]) {
  const obj: { [key: string]: any } = {};
  for (let index = 0; index < header.length; index++) {
    const key = header[index].split('"')[1];
    obj[key] = null;
  }
  return obj;
}

function processValues(values: string[]) {
  return values.map((value) => {
    const newValue = value
      .trim()
      .replace(/\r$/, "")
      .replace(/^"(.*)"$/, "$1");

    if (!newValue) return null;

    return newValue;
  });
}

function processLines(
  template: { [key: string]: any },
  lines: string[],
  delimiter: string
) {
  const keys = Object.keys(template);

  const result: { [key: string]: any }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const values = processValues(lines[i].split(delimiter));
    if (values.length !== keys.length) continue;
    const obj: { [key: string]: any } = { ...template };

    keys.forEach((key, index) => {
      obj[key] = values[index];
    });

    result.push(obj);
  }

  return result;
}

function processCSV(data: any, delimiter: string) {
  const dataSplited = data.split("\n");

  const header = dataSplited[0].split(delimiter);
  const lines = dataSplited.slice(1);
  const template = generateObject(header);

  return processLines(template, lines, delimiter);
}

export function csvToObject<T>(
  filePath: string,
  delimiter: string
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf8", (err: any, data: any) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        reject(err);
        return;
      }
      const result = processCSV(data, delimiter) as T[];

      resolve(result);
    });
  });
}
