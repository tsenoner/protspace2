import { PCA } from "ml-pca";
// @ts-expect-error No types available
import { DataFrame } from "pandas-js";

const generatePCA = (data: number[][]): DataFrame => {
  const fit = new PCA(data);
  const calculation = fit.predict(data, { nComponents: 3 });
  // @ts-expect-error No types available
  return calculation.data;
};

export default generatePCA;
