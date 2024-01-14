import h5wasm from "h5wasm";
import generatePCA from "../helpers/pca";
import { generateTSNE } from "../helpers/tsne";
import { generateUMAP } from "../helpers/umap";

const Reader = () => {
  const pca = async () => {
    const filePath = "3FTx_mature_esm2.h5";
    fetch(filePath)
      .then(function (response) {
        return response.arrayBuffer();
      })
      .then(async function (buffer) {
        const h = await h5wasm.ready;
        const { FS } = h;
        FS.writeFile("test.h5", new Uint8Array(buffer));
        const f = new h5wasm.File("test.h5", "r");
        const identifiers = f.keys();
        const embeddings = [];
        for (const identifier of identifiers) {
          const embd = f.get(identifier);
          // @ts-expect-error no need to check for null
          const values = embd.value;
          embeddings.push(values);
        }
        const t1 = Date.now();
        console.log("Started", t1);
        console.log(generatePCA(embeddings));
        const t2 = Date.now();
        console.log("Finished", t2);
        console.log("Time in seconds: ", (t2 - t1) / 1000);
      });
  };
  const umap = async () => {
    const filePath = "3FTx_mature_esm2.h5";
    fetch(filePath)
      .then(function (response) {
        return response.arrayBuffer();
      })
      .then(async function (buffer) {
        const h = await h5wasm.ready;
        const { FS } = h;
        FS.writeFile("test.h5", new Uint8Array(buffer));
        const f = new h5wasm.File("test.h5", "r");
        const identifiers = f.keys();
        const embeddings = [];
        for (const identifier of identifiers) {
          const embd = f.get(identifier);
          // @ts-expect-error no need to check for null
          const values = embd.value;
          embeddings.push(values);
        }
        const t1 = Date.now();
        console.log("Started", t1);
        console.log(generateUMAP(embeddings));
        const t2 = Date.now();
        console.log("Finished", t2);
        console.log("Time in seconds: ", (t2 - t1) / 1000);
      });
  };
  const tsne = async () => {
    const filePath = "3FTx_mature_esm2.h5";
    fetch(filePath)
      .then(function (response) {
        return response.arrayBuffer();
      })
      .then(async function (buffer) {
        const h = await h5wasm.ready;
        const { FS } = h;
        FS.writeFile("test.h5", new Uint8Array(buffer));
        const f = new h5wasm.File("test.h5", "r");
        const identifiers = f.keys();
        const embeddings = [];
        for (const identifier of identifiers) {
          const embd = f.get(identifier);
          // @ts-expect-error no need to check for null
          const values = embd.value;
          embeddings.push(values);
        }
        const t1 = Date.now();
        console.log("Started", t1);
        console.log(generateTSNE(embeddings));
        const t2 = Date.now();
        console.log("Finished", t2);
        console.log("Time in seconds: ", (t2 - t1) / 1000);
      });
  };
  return (
    <div>
      <h1 onClick={pca}>PCA</h1>
      <h1 onClick={umap}>UMAP</h1>
      <h1 onClick={tsne}>TSNE</h1>
    </div>
  );
};

export default Reader;
