//#region TYPES
import { csvStreams } from "./CSVStreams";
//#endregion

export class CSVUtilities {
  private asyncPipeline;
  private readCSVLine;
  private transformLine;

  constructor(filePath: string, delimiter: string) {
    this.asyncPipeline = csvStreams.asyncPipeline();
    this.readCSVLine = csvStreams.readCSVLine(filePath);
    this.transformLine = csvStreams.transformLine(delimiter);
  }

  async readLineByLine(callback: (data: any) => void) {
    await this.asyncPipeline(
      this.readCSVLine,
      this.transformLine,
      csvStreams.readLineByLine(callback)
    );
  }

  async generateJsonFile(outputFilePath: string) {
    let isFistLine = true;

    const jsonWriteStream = csvStreams.writeStream(outputFilePath);

    jsonWriteStream.write("[\n");

    await this.asyncPipeline(
      this.readCSVLine,
      this.transformLine,
      csvStreams.readLineByLine((data: any) => {
        if (!isFistLine) {
          jsonWriteStream.write(",\n");
        } else {
          isFistLine = false;
        }

        jsonWriteStream.write(JSON.stringify(data));
      })
    );
    jsonWriteStream.write("\n]\n");
    jsonWriteStream.end();
  }
}
