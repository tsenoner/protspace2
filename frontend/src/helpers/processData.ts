import h5wasm from "h5wasm";
import generatePCA from "./pca";
import { generateTSNE } from "./tsne";
import { generateUMAP } from "./umap";

// Function to process the file and return the results based on the specified technique
async function processData(file: File | null, technique: string) {
  // Convert the file to an ArrayBuffer
  console.log(file);
  const buffer = await file?.arrayBuffer();

  // Prepare the h5wasm and write the file
  const h = await h5wasm.ready;
  const { FS } = h;
  // @ts-expect-error No types available
  FS.writeFile("uploaded.h5", new Uint8Array(buffer));
  const f = new h5wasm.File("uploaded.h5", "r");

  // Extract data from the file
  const identifiers = f.keys();
  const embeddings = [];
  for (const identifier of identifiers) {
    const embd = f.get(identifier);
    // @ts-expect-error No types available
    const values = embd.value; // Assuming values are not null
    embeddings.push(values);
  }

  // Process data based on the technique
  let result;
  const t1 = Date.now();
  if (technique === "pca") {
    result = generatePCA(embeddings);
  } else if (technique === "umap") {
    result = generateUMAP(embeddings);
  } else if (technique === "tsne") {
    result = generateTSNE(embeddings);
  }
  const t2 = Date.now();

  console.log("Time in seconds: ", (t2 - t1) / 1000);

  // Return the result
  return result;
}

export default processData;
