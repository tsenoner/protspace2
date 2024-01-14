export const generateTSNE = async (data: any[]) => {
  console.log(data);
  // Initialize t-SNE with your data
  // @ts-expect-error No types available
  const tsne = new tsnejs.tSNE({
    epsilon: 10, // Learning rate
    perplexity: 30, // Perplexity
    dim: 3, // Number of dimensions for output, adjust as needed
  });
  tsne.initDataRaw(data); // Here data should be an array of arrays

  // Run t-SNE for a certain number of steps
  for (let k = 0; k < 1000; k++) {
    tsne.step(); // Every call to step makes the solution a bit better
  }

  const Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot

  console.log(Y);
  return Y;
};
