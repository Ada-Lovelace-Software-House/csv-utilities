/* eslint-disable no-console */
import { EOL } from "os";

interface IGenerateCSV {
  header: string[];
  rows: string[][];
  delimiter: string;
}

interface IGenerateHeader {
  header: string[];
  delimiter: string;
}

interface IGenerateRows {
  rows: string[][];
  delimiter: string;
}
function generateHeader({ header, delimiter }: IGenerateHeader) {
  return Buffer.from(`${header.join(delimiter)}${EOL}`);
}

function generateRows({ rows, delimiter }: IGenerateRows) {
  const buffers: Buffer[] = [];

  rows.forEach((row) => {
    const line = row.join(delimiter);
    buffers.push(Buffer.from(`${line}${EOL}`));
  });

  return buffers;
}

export async function oldGenerateCSV({
  header,
  rows,
  delimiter = ";",
}: IGenerateCSV) {
  try {
    const buffers: Buffer[] = [
      generateHeader({ header, delimiter }),
      ...generateRows({ rows, delimiter }),
    ];

    return Buffer.concat(buffers);
  } catch (error) {
    throw new Error("Error generating CSV.");
  }
}
