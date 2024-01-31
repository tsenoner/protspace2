import {
  AdjustmentsVerticalIcon,
  ArrowDownOnSquareIcon,
  ArrowsPointingInIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentChartBarIcon,
  MapIcon,
} from "@heroicons/react/24/solid";
import React, {
  ChangeEvent,
  MutableRefObject,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { PropagateLoader } from "react-spinners";
import { CSSTransition } from "react-transition-group";
import { BsFiletypeSvg } from "react-icons/bs";

import { ScatterBoard, type ScatterBoardRef } from "scatter-board-library";
import { Vector3 } from "three";
import { colorList, shapeList } from "../helpers/constants";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import {
  fetchAndSetData,
  setCSVFilePath,
  setCameraPosition,
  setCameraRotation,
  setColorAndShapeKey,
  setColorKey,
  setColorParam,
  setColorParamList,
  setData,
  setDataItems,
  setErrorMessage,
  setIsLegendOpen,
  setIsLoading,
  setKeyList,
  setPdbExists,
  setSearchItems,
  setSelectedMols,
  setShapeKey,
  setShapeParam,
  setShapeParamList,
  setTechnique,
  setThreeD,
  setTwoLegend,
} from "../redux/actions/settings";
import EntitySearch from "./EntitySearch";
import ErrorModal from "./ErrorModal";
import { FileUploadFormModal } from "./FileUploadFormModal";
import Nav from "./Nav";
import SettingsModal from "./SettingsModal";
// import MoleculeViewer, { MoleculeViewerRef } from "./MoleculeViewer";
import { Box, Select } from "@chakra-ui/react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { TransitionChildren } from "react-transition-group/Transition";
import { Item } from "../data";
import { csvToJson } from "../helpers/csvToJson";
import MolstarViewer from "./MolstarViewer";
// import Reader from "./Reader";

const VisualizationComp = () => {
  const cameraRef = useRef() as MutableRefObject<THREE.PerspectiveCamera>;
  const scatterRef = createRef<ScatterBoardRef>();
  // const moleculeViewerRef = createRef<MoleculeViewerRef>();
  const [isFABOpen, setIsFABOpen] = useState(false);
  const [settingsShown, setSettingsShown] = useState(false);
  const [fileUploadShown, setFileUploadShown] = useState(true);
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    if (settings.csvFilePath !== "") {
      dispatchThunk(fetchAndSetData({}));
    }
  }, [settings.csvFilePath]);

  function exportFile() {
    const jsonData = {
      data: settings.data,
      keyList: settings.keyList,
      technique: settings.technique,
      colorParam: settings.colorParam,
      colorKey: settings.colorKey,
      shapeParam: settings.shapeParam,
      shapeKey: settings.shapeKey,
      searchItems: settings.searchItems,
      colorParamList: settings.colorParamList,
      shapeParamList: settings.shapeParamList,
      threeD: settings.threeD,
      twoLegend: settings.twoLegend,
      csvFilePath: settings.csvFilePath,
      position: {
        x: cameraRef.current.position.x,
        y: cameraRef.current.position.y,
        z: cameraRef.current.position.z,
      },
      rotation: {
        x: cameraRef.current.rotation.x,
        y: cameraRef.current.rotation.y,
        z: cameraRef.current.rotation.z,
      },
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json"; // Change the filename as needed
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  const handleFileChangeJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setIsLoading(true));
      readFileContentsJSON(file);
    }
  };

  const handleFileChangeCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setIsLoading(true));
      fetchDataFromFile(file);
    }
  };

  const readFileContentsJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContents = event.target?.result;
      if (fileContents) {
        try {
          const parsedObject = JSON.parse(fileContents as string);
          importFile(parsedObject);
        } catch (error) {
          setErrorMessage("JSON could not be parsed. Please check the file.");
          console.error("Error parsing JSON:", error);
        }
      }
    };
    reader.readAsText(file);
  };

  const fetchDataFromFile = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContents = event.target?.result;
      if (fileContents) {
        try {
          const json = csvToJson(fileContents as string);
          const data = JSON.parse(JSON.stringify(json, null, 2));
          console.log("data: ", data);
          const items: Item[] = [];
          const colorParamList: string[] = [];
          const shapeParamList: string[] = [];
          const keys = Object.keys(data[0]).filter(
            (item: any) => !Number(data[0][item])
          );
          const colorKey = keys[1];
          const shapeKey = keys[2];
          const newData = data.map((item: any) => {
            const newItem = {
              ...item,
            }; // Create a copy of the current item
            for (const key in newItem) {
              if (
                newItem.hasOwnProperty(key) &&
                typeof newItem[key] === "string" &&
                newItem[key] === ""
              ) {
                newItem[key] = "NaN";
              }
            }
            return newItem;
          });

          newData.forEach((element: any) => {
            for (const key in element) {
              const value = element[key];
              if (
                typeof value === "string" &&
                items.filter((e) => e.category === key && e.name === value)
                  .length === 0
              ) {
                if (key === colorKey) {
                  items.push({
                    category: key,
                    color: colorList[colorParamList.length % colorList.length],
                    name: value,
                  });
                  colorParamList.push(value);
                } else if (key === shapeKey) {
                  items.push({
                    category: key,
                    img: shapeList[shapeParamList.length % shapeList.length],
                    name: value,
                  });
                  shapeParamList.push(value);
                } else {
                  items.push({ category: key, name: value });
                }
              }
            }
          });
          dispatch(setCSVFilePath(""));
          dispatch(setData(newData));
          dispatch(setDataItems(items));
          dispatch(setShapeParamList(shapeParamList));
          dispatch(setColorParamList(colorParamList));
          dispatch(setKeyList(keys));
          dispatch(setColorKey(colorKey));
          dispatch(setShapeKey(shapeKey));
          dispatch(setColorParam(""));
          dispatch(setShapeParam(""));
          dispatch(setSelectedMols([]));
          dispatch(setPdbExists(false));
          dispatch(setSearchItems([]));
          dispatch(setIsLoading(false));
        } catch (error) {
          console.error("Error parsing CSV:", error);
          dispatch(setIsLoading(false));
        }
      }
    };
    reader.readAsText(file);
  };

  function importFile(parsedObject: any) {
    dispatch(setTechnique(parsedObject.technique ?? ""));
    dispatch(setColorParam(parsedObject.colorParam ?? ""));
    dispatch(setShapeParam(parsedObject.shapeParam ?? ""));
    dispatch(setSearchItems(parsedObject.searchItems ?? []));
    dispatch(setThreeD(parsedObject.threeD ?? false));
    dispatch(setTwoLegend(parsedObject.twoLegend ?? false));
    dispatch(setCSVFilePath(parsedObject.csvFilePath ?? ""));
    dispatch(setColorKey(parsedObject.colorKey ?? ""));
    dispatch(setShapeKey(parsedObject.shapeKey ?? ""));
    dispatch(setData(parsedObject.data ?? []));
    dispatch(setKeyList(parsedObject.keyList ?? []));
    dispatch(setColorParamList(parsedObject.colorParamList ?? []));
    dispatch(setShapeParamList(parsedObject.shapeParamList ?? []));
    dispatch(setSelectedMols([]));
    dispatch(setPdbExists(false));
    dispatch(
      setCameraPosition(
        new Vector3(
          parsedObject.position.x,
          parsedObject.position.y,
          parsedObject.position.z
        )
      )
    );
    dispatch(
      setCameraRotation(
        new Vector3(
          parsedObject.position.x,
          parsedObject.position.y,
          parsedObject.position.z
        )
      )
    );
    dispatch(setIsLoading(false));
  }

  const downloadCSV = () => {
    // Extract headers from the keys of the first object
    const headers = Object.keys(settings.data[0]);

    // Convert the data objects into rows
    const rows = settings.data.map((obj: any) => {
      return headers.map((header) => obj[header]);
    });

    // Combine headers and rows into a CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "embeddings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { colorKey, keyList } = useAppSelector((state) => state.settings);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    dispatch(setColorAndShapeKey(selectedValue, ""));
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="absolute z-10 left-0 top-0 w-screen">
        <Nav />
      </div>
      <main className="h-full">
        <FileUploadFormModal
          fileUploadShown={fileUploadShown}
          setFileUploadShown={setFileUploadShown}
          // setLoading={setLoading}
        />
        <SettingsModal
          pdbExists={true}
          settingsShown={settingsShown}
          setSettingsShown={setSettingsShown}
        />
        <div
          className={
            settings.isLoading
              ? "absolute inset-0 z-40 flex justify-center items-center bg-opacity-50 bg-gray-300"
              : "hidden"
          }
        >
          <div
            style={{
              background: "white",
              padding: "32px",
              borderRadius: "16px",
              fontSize: "16px",
              paddingBottom: "24px",
            }}
          >
            <span style={{ fontSize: "20px" }}>Analysis in progress...</span>
            <div
              style={{
                width: "240px",
                height: "36px",
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <PropagateLoader color={"#0066bd"} loading={true} />
            </div>
            {/* <Progress
              color={"#0066bd"}
              isIndeterminate
              height={4}
              width={300}
              borderRadius={10}
              marginTop={4}
              marginBottom={4}
            /> */}
            <span
              style={{ display: "flex", width: "100%", placeContent: "center" }}
            >
              Time Remaining: <strong> &nbsp;1 minute</strong>
            </span>
            {/* <div className="cancelButton">
              <button onClick={() => dispatch(setIsLoading(false))}>
                Cancel Analysis
              </button>
            </div> */}
          </div>
        </div>
        <EntitySearch />
        {/* <Reader /> */}
        <Box className="z-20 absolute top-16 w-80 m-4 right-0">
          <Select
            variant="filled"
            value={colorKey}
            onChange={handleSelectChange}
          >
            {keyList.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </Select>
        </Box>
        <div className="h-full">
          <div className="bg-white h-full">
            <div className="absolute z-0 top-0 left-0">
              <ScatterBoard
                cameraRef={cameraRef}
                setColorParam={(param: string) =>
                  dispatch(setColorParam(param))
                }
                setShapeParam={(param: string) =>
                  dispatch(setShapeParam(param))
                }
                twoLegend={settings.twoLegend}
                isLegendOpen={settings.isLegendOpen}
                searchItems={settings.searchItems}
                colorKey={settings.colorKey}
                colorParam={settings.colorParam}
                shapeKey={settings.shapeKey}
                shapeParam={settings.shapeParam}
                threeD={settings.threeD}
                data={settings.data}
                technique={settings.technique}
                shapeParamList={settings.shapeParamList}
                colorParamList={settings.colorParamList}
                cameraPosition={settings.cameraPosition}
                cameraRotation={settings.cameraRotation}
                dataItems={settings.dataItems}
                colorList={colorList}
                shapeList={shapeList}
                setErrorMessage={function (value: string): void {
                  dispatch(setErrorMessage(value));
                }}
                ref={scatterRef}
                onVisualizeClicked={(value: string) => {
                  if (!(value in settings.selectedMols)) {
                    dispatch(setSelectedMols([value]));
                  }
                }}
                onCompareClicked={(value: string) => {
                  if (!settings.selectedMols.includes(value)) {
                    dispatch(
                      setSelectedMols([...settings.selectedMols, value])
                    );
                  }
                }}
              />
              {/* {settings.selectedMols && (
                <MoleculeViewer ref={moleculeViewerRef} />
              )} */}
              {settings.selectedMols.length !== 0 && <MolstarViewer />}
            </div>
            <div className="absolute z-20 bottom-4 right-2 m-2 flex">
              <div className="has-tooltip">
                <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                  {isFABOpen ? "Collapse" : "Expand"}
                </span>
                <div
                  className={`m-1 rounded-full w-12 h-12 bg-blue-700 flex items-center shadow-md cursor-pointer ${
                    isFABOpen ? "-translate-x" : ""
                  } transition-transform`}
                  onClick={() => setIsFABOpen(!isFABOpen)}
                >
                  {isFABOpen ? (
                    <ChevronDoubleRightIcon className="w-6 m-auto text-white" />
                  ) : (
                    <ChevronDoubleLeftIcon className="w-6 m-auto text-white" />
                  )}
                </div>
              </div>

              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        Download Plot
                      </span>
                      <div
                        className="rounded-full bg-yellow-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                        onClick={() =>
                          scatterRef?.current?.downloadScreenshot()
                        }
                      >
                        <ArrowDownOnSquareIcon className="w-6 m-auto text-white" />
                      </div>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        Download as SVG
                      </span>
                      <div
                        onClick={() => scatterRef?.current?.downloadSVG()}
                        className="rounded-full bg-blue-200 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                      >
                        <BsFiletypeSvg
                          style={{ color: "blue", fontSize: "1.5rem" }}
                          className="w-6 m-auto text-white"
                        />
                      </div>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>

              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        {settings.isLegendOpen ? "Hide Legend" : "Show Legend"}
                      </span>
                      <div
                        className="rounded-full bg-green-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                        onClick={() =>
                          dispatch(setIsLegendOpen(!settings.isLegendOpen))
                        }
                      >
                        {settings.isLegendOpen ? (
                          <ArrowsPointingInIcon className="w-6 m-auto text-white" />
                        ) : (
                          <MapIcon className="w-6 m-auto text-white" />
                        )}
                      </div>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        Export Project
                      </span>
                      <div
                        className="rounded-full bg-pink-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                        onClick={() => exportFile()}
                      >
                        <DocumentArrowUpIcon className="w-6 m-auto text-white" />
                      </div>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        Import Project
                      </span>

                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChangeJSON}
                        className="hidden"
                        id="file-upload-json"
                      />
                      <label className="file-label" htmlFor="file-upload-json">
                        <div className="rounded-full bg-purple-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
                          <DocumentArrowDownIcon className="w-6 m-auto text-white" />
                        </div>
                      </label>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        Export CSV
                      </span>
                      <div
                        className="rounded-full bg-stone-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                        onClick={downloadCSV}
                      >
                        <ClipboardDocumentListIcon className="w-6 m-auto text-white" />
                      </div>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        Import CSV
                      </span>

                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChangeCSV}
                        className="hidden"
                        id="file-upload-csv"
                      />
                      <label className="file-label" htmlFor="file-upload-csv">
                        <div className="rounded-full bg-red-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
                          <DocumentChartBarIcon className="w-6 m-auto text-white" />
                        </div>
                      </label>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        Settings
                      </span>
                      <div
                        className="rounded-full bg-emerald-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                        onClick={() => setSettingsShown(true)}
                      >
                        <AdjustmentsVerticalIcon className="w-6 m-auto text-white" />
                      </div>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
              <CSSTransition
                in={isFABOpen}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                {
                  (
                    <div className="has-tooltip">
                      <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white -mt-8">
                        File Settings
                      </span>
                      <div
                        onClick={() => {
                          setFileUploadShown(true);
                        }}
                        className="rounded-full bg-gray-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                      >
                        <CogIcon className="w-6 m-auto text-white" />
                      </div>
                    </div>
                  ) as TransitionChildren
                }
              </CSSTransition>
            </div>
          </div>
        </div>
        {settings.errorMessage !== "" && <ErrorModal />}
      </main>
    </div>
  );
};

export default VisualizationComp;
