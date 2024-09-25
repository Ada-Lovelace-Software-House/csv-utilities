import { IObjectAndKeys } from "./types";

class CSVUtils {
  public createObjectReference(header: string[]) {
    const obj: IObjectAndKeys = {};
    for (let i = 0; i < header.length; i++) {
      const key = header[i];
      obj[key] = null;
    }

    return obj;
  }

  public transformLine(line: string, delimiter: string) {
    let data = "";
    const parsedLine = [];

    let quoteCount = 0;

    for (let i = 0; i < line.length; i++) {
      if (line[i] !== delimiter && line[i] !== '"') data += line[i];

      if (line[i] === '"') quoteCount++;

      if (quoteCount === 1 && line[i] !== '"') {
        continue;
      }

      if (quoteCount === 2) {
        parsedLine.push(data);
        quoteCount = 0;
        data = "";
        continue;
      }

      if (data && (line[i] === delimiter || i === line.length - 1)) {
        parsedLine.push(data);
        data = "";
      }
    }

    return parsedLine;
  }
}

export const csvUtils = new CSVUtils();
