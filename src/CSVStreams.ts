import * as readline from "readline";
import { Transform, Writable, pipeline } from "stream";
import * as fs from "fs";
import { promisify } from "util";
import { csvUtils } from "./CSVUtils";
import { IObjectAndKeys } from "./types";

class CSVStreams {
  isHeader = true;
  objectReference: IObjectAndKeys;

  constructor() {
    this.isHeader = true;
    this.objectReference = {};
  }

  public asyncPipeline() {
    return promisify(pipeline);
  }

  public readCSVLine(filePath: string) {
    return readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });
  }

  public transformLine(delimiter: string) {
    const self = this;
    return new Transform({
      transform(line, _encoding, callback) {
        const transformedLine = csvUtils.transformLine(
          line.toString(),
          delimiter
        );

        if (self.isHeader) {
          self.isHeader = false;
          self.objectReference =
            csvUtils.createObjectReference(transformedLine);
          return callback();
        }

        const object: IObjectAndKeys = { ...self.objectReference };

        for (let i = 0; i < transformedLine.length; i++) {
          const key = Object.keys(object)[i];
          object[key] = transformedLine[i];
        }
        callback(null, JSON.stringify(object) + "\n");
      },
    });
  }

  public writeStream(filePath: string) {
    return fs.createWriteStream(filePath, { encoding: "utf8" });
  }

  public readLineByLine(callback: (data: any) => void) {
    return new Writable({
      write(chunk, _encoding, cb) {
        callback(JSON.parse(chunk.toString()));
        cb();
      },
    });
  }
}

export const csvStreams = new CSVStreams();
