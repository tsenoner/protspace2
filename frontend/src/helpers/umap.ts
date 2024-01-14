// import { UMAP } from "umap-js";
export const generateUMAP = (data: number[][]): number[][] => {
  // @ts-expect-error No types available
  const umap = new window.UMAP({
    nComponents: 3,
    minDist: 0.5,
    nNeighbors: 25,
    metric: "euclidean",
  });
  const nEpochs = umap.initializeFit(data);
  for (let i = 0; i <= nEpochs; i++) {
    umap.step();
  }
  const result = umap.getEmbedding();
  return result;
};
