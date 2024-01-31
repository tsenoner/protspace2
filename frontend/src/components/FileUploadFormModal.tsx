import { AttachmentIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ThunkDispatch } from "@reduxjs/toolkit";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { defaultDatasets } from "../data";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import processData from "../helpers/processData";
import {
  fetchAndSetData,
  setCSVFilePath,
  setData,
  setErrorMessage,
  setIsLoading,
  setPDB,
  setPdbExists,
  setSelectedMols,
  setTechnique,
  setThreeD,
} from "../redux/actions/settings";
import TechniquesDropdown from "./TechniquesDropdown";
import JSZip from "jszip";

const backendUrl = "http://localhost:8000";

export function FileUploadFormModal({
  fileUploadShown,
  setFileUploadShown,
}: any) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdbFile, setPdbFile] = useState<File | null>(null);
  const [h5File, setH5File] = useState<File | null>(null);
  const [fastaFile] = useState<File | null>(null);
  const [csvSep] = useState(",");
  const [uidCol] = useState(0);
  const [iterations, setIterations] = useState(1000);
  const [perplexity, setPerplexity] = useState(30);
  const [learningRate, setLearningRate] = useState(10);
  const [reset] = useState(false);
  const [tsneMetric, setTsneMetric] = useState("euclidean");
  const [metric, setMetric] = useState("euclidean");
  const [nNeighbours, setNNeighbours] = useState(25);
  const [minDist, setMinDist] = useState(0.5);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [useDefault] = useState(false);
  const [dataset, setDataset] = useState(defaultDatasets[0]);
  const [threeD, setSwitchThreeD] = useState(true);
  const [threedDefaultSet, setThreedDefaultSet] = useState(true);
  const dispatch = useAppDispatch();
  const { technique } = useAppSelector((state) => state.settings);
  const [selectedTechnique, setSelectedTechnique] = useState<string>(technique);
  const [selectedTechniqueDefault, setSelectedTechniqueDefault] =
    useState<string>("umap");

  const [processedData, setProcessedData] = useState<any>(null);
  const [useBackend, setUseBackend] = useState(false);
  const dispatchThunk = useDispatch<ThunkDispatch<any, any, any>>();
  function readFileContent(file: Blob): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const result = event?.target?.result as string;
        resolve(result);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files) {
      if (useBackend) {
        setter(event.target.files[0]);
      } else {
        const fileExtension = event.target.files[0].name.split(".").pop();
        if (fileExtension === "csv") {
          readFileContent(event.target.files[0]).then((textFile) => {
            let content = textFile.split("\n");
            let headers = content.shift()?.split(","); // split the header row to get individual column names
            if (headers) {
              console.log(headers);
              let dataObjects = content.map((row) => {
                // Split the row by comma but not those inside quotes
                let values = row.split(",");
                if (values) {
                  let dataObject = {};
                  // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                  headers.forEach((header, index) => {
                    if (values[index] === undefined || values[index] === "") {
                      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                      dataObject[header] = "NaN";
                    } else {
                      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                      dataObject[header] = values[index].replace(/"/g, ""); // remove quotes from data
                    }
                    // dataObject[header] = values[index]?.replace(/"/g, ""); // remove quotes from data
                  });
                  return dataObject;
                }
              });
              console.log(dataObjects);
              setProcessedData(dataObjects);
            }
          });
        }
        setter(event.target.files[0]);
      }
    }
  };

  const handleFileChangePDB = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files) {
      setter(event.target.files[0]);
    }
    var new_zip = new JSZip();
    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    new_zip.loadAsync(event.target.files[0]).then(function (zip) {
      let localPDB: { relativePath: string; fileData: string }[] = [];

      // Create an array of promises for the file data
      let filePromises = Object.keys(zip.files).map((relativePath) => {
        return zip.files[relativePath].async("string").then((fileData) => {
          return { relativePath, fileData };
        });
      });

      // Wait for all file data to be processed
      Promise.all(filePromises).then((filesData) => {
        // Add each file's data to the pdb array
        localPDB = filesData;
        dispatch(setPDB(localPDB));
      });
    });
  };
  const uploadPdb = async (pdbFile: File) => {
    const formDataPdb = new FormData();
    formDataPdb.append("zipFile", pdbFile);

    try {
      await axios.post(`${backendUrl}/uploadZip`, formDataPdb);

      // Handle the response from the server
      dispatch(setPdbExists(true));
    } catch (error) {
      // Handle error
      dispatch(setPdbExists(true));
      return;
    }
  };

  const uploadData = (formData: FormData) => {
    // Make a network request to upload the data
    dispatch(setIsLoading(true));
    fetch(`http://localhost:8000/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Handle the response from the server
        if (data.result?.includes("error")) {
        } else {
          dispatch(setCSVFilePath(`http://localhost:8000/csv/${data.result}`));
          dispatch(setPdbExists(pdbFile !== null));
          dispatch(setTechnique(selectedTechnique));
          dispatch(setThreeD(threeD));
        }
        dispatch(setIsLoading(false));
      })
      .catch(() => {
        // Handle error
        dispatch(setIsLoading(false));
        dispatch(setErrorMessage("Error uploading data"));
        return;
      });
  };

  function combineArrays(
    coordinatesArray: string | any[],
    objectsArray: any[]
  ) {
    if (
      (coordinatesArray && coordinatesArray.length) !==
      (objectsArray && objectsArray.length)
    ) {
      throw new Error("Arrays must be of the same length");
    }

    // Combine the arrays
    const combinedArray = objectsArray.map((object, index) => {
      const coordinates = coordinatesArray[index];
      return {
        ...object,
        x_umap_3D: coordinates[0],
        y_umap_3D: coordinates[1],
        z_umap_3D: coordinates[2],
      };
    });

    return combinedArray;
  }
  const handleUpload = async () => {
    if (!h5File && !useDefault) {
      // Display an error message or prevent the upload
      setFormErrorMessage("H5 file is required");
      return;
    }
    setFormErrorMessage("");
    setFileUploadShown(false);
    dispatch(setIsLoading(true));
    if (!useBackend) {
      let result = null;
      switch (selectedTechnique) {
        case "umap":
          result = await processData(h5File, "umap");
          break;
        case "tsne":
          result = await processData(h5File, "tsne");
          break;
        case "pca":
          result = await processData(h5File, "pca");
          break;
        default:
          break;
      }
      if (
        (result && result.length) !== (processedData && processedData.length)
      ) {
        setProcessedData(processedData && processedData.pop());
      }
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      dispatch(setData(combineArrays(result, processedData)));
      const localData = combineArrays(result, processedData);
      dispatchThunk(fetchAndSetData(localData));
      setFileUploadShown(false);
      dispatch(setIsLoading(false));
    } else {
      const formData = new FormData();
      if (h5File) {
        formData.append("h5File", h5File);
      }
      if (csvFile) {
        formData.append("csvFile", csvFile);
      }
      if (fastaFile) {
        formData.append("fastaFile", fastaFile);
      }
      formData.append("csvSep", csvSep);
      formData.append("uidCol", uidCol.toString());
      formData.append("iterations", iterations.toString());
      formData.append("perplexity", perplexity.toString());
      formData.append("learningRate", learningRate.toString());
      formData.append("reset", reset ? "True" : "False");
      formData.append("tsneMetric", tsneMetric);
      formData.append("metric", metric);
      formData.append("nNeighbours", nNeighbours.toString());
      formData.append("minDist", minDist.toString());
      dispatch(setSelectedMols([]));
      dispatch(setIsLoading(true));

      if (pdbFile) {
        uploadPdb(pdbFile);
      } else {
        dispatch(setPdbExists(false));
      }
      uploadData(formData);
      setFileUploadShown(false);
    }
  };
  const handleSwitchServer = (event: ChangeEvent<HTMLInputElement>) => {
    setUseBackend(event.target.checked);
  };

  const handleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setSwitchThreeD(event.target.checked);
  };
  const handleSwitchDefaultSet = (event: ChangeEvent<HTMLInputElement>) => {
    setThreedDefaultSet(event.target.checked);
  };

  const handleTechniqueChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTechniqueDefault(event.target.value);
  };

  const techniqueList = ["umap", "pca", "tsne"];

  return (
    <div className={fileUploadShown ? "flex" : "hidden"}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto max-h-[80%]">
          <div className="modal-content py-4 text-left px-6">
            {/* Modal header */}
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold">File Settings</p>
              <button
                className="modal-close cursor-pointer z-50"
                onClick={() => setFileUploadShown(false)}
              >
                <XMarkIcon className="w-4" />
              </button>
            </div>
            <div className="mt-2">
              <div className="flex flex-col mb-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="defaultDataset"
                >
                  Dataset
                </label>
                <select
                  onChange={(event) => {
                    setDataset(event.target.value);
                  }}
                  id="defaultDataset"
                  className="min-w-100 bg-transparent"
                  value={dataset}
                >
                  {defaultDatasets.map((option: string, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FormControl display="flex" alignItems="center" mt={2}>
                  <FormLabel htmlFor="2D" mb="0">
                    2D
                  </FormLabel>
                  <Switch
                    defaultChecked={threedDefaultSet}
                    id="dimensions"
                    onChange={handleSwitchDefaultSet}
                  />
                  <FormLabel htmlFor="3D" mb="0" ml={3}>
                    3D
                  </FormLabel>
                </FormControl>
              </div>
              <div>
                <label
                  htmlFor="techniques"
                  className="text-gray-700 text-sm font-bold"
                >
                  Technique
                </label>
                <select
                  onChange={handleTechniqueChange}
                  id="techniques"
                  className="mt-2 min-w-100 bg-transparent"
                  value={selectedTechniqueDefault}
                >
                  {techniqueList.map((option, index) => (
                    <option key={index} value={option}>
                      {option.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <Button
                  className="mt-4"
                  colorScheme="blue"
                  onClick={() => {
                    if (dataset === defaultDatasets[0]) {
                      dispatch(setCSVFilePath("df_3FTx_mature_esm2.csv"));
                      dispatch(setPdbExists(true));
                    } else if (dataset === defaultDatasets[1]) {
                      dispatch(setCSVFilePath("df_KLK_esm2.csv"));
                      dispatch(setPdbExists(false));
                    }
                    dispatch(setThreeD(threedDefaultSet));
                    dispatch(setTechnique(selectedTechniqueDefault));
                    setFileUploadShown(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
