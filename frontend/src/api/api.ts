import { csvToJson } from "../helpers/csvToJson";
import store from "../redux/store";

export const fetchData = async () => {
  const csvFilePath = store.getState().settings.csvFilePath;
  try {
    const response = await fetch(csvFilePath);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const text = await response.text();
    const json = csvToJson(text);
    const data = JSON.parse(JSON.stringify(json, null, 2));
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
