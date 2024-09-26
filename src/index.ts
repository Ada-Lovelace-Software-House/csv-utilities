import { CSVUtilities } from "./CSVUtilities";

export { CSVUtilities } from "./CSVUtilities";
export { oldGenerateCSV } from "./old/generateCsv";

const csvUtils = new CSVUtilities(
  "D:/Development/personal-projects/csv-utilities/cord_19_embeddings_2022-06-02.csv",
  ","
);

(async () => {
  await csvUtils.generateJsonFile("output.json");
})();
