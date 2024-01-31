import { Button, FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { ChangeEvent, useState } from "react";
import { defaultDatasets } from "../data";
import { useAppDispatch } from "../helpers/hooks";
import {
  setCSVFilePath,
  setPdbExists,
  setTechnique,
  setThreeD,
} from "../redux/actions/settings";

export function FileUploadFormModal({
  fileUploadShown,
  setFileUploadShown,
}: any) {
  const [dataset, setDataset] = useState(defaultDatasets[0]);
  const [threedDefaultSet, setThreedDefaultSet] = useState(true);
  const dispatch = useAppDispatch();
  const [selectedTechniqueDefault, setSelectedTechniqueDefault] =
    useState<string>("umap");

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
