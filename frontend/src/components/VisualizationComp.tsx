import {
  ArrowsPointingInIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CogIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  MapIcon,
} from "@heroicons/react/24/solid";
import React, {
  MutableRefObject,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsFiletypePng, BsFiletypeSvg } from "react-icons/bs";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { CSSTransition } from "react-transition-group";

import { ScatterBoard, type ScatterBoardRef } from "scatter-board-library";
import { Vector3 } from "three";
import { colorList, shapeList } from "../helpers/constants";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import {
  fetchAndSetData,
  setCameraPosition,
  setCamera,
  setCameraRotation,
  setColorAndShapeKey,
  setColorKey,
  setColorList,
  setColorParam,
  setColorParamList,
  setCustomFeature,
  setData,
  setDataItems,
  setErrorMessage,
  setIsLegendOpen,
  setIsLoading,
  setKeyList,
  setProjections,
  setProteinData,
  setSearchItems,
  setSelectedMols,
  setShapeParam,
  setTechnique,
  setThreeD,
} from "../redux/actions/settings";
import EntitySearch from "./EntitySearch";
import ErrorModal from "./ErrorModal";
import { FileUploadFormModal } from "./FileUploadFormModal";
import Nav from "./Nav";
// import MoleculeViewer, { MoleculeViewerRef } from "./MoleculeViewer";
import { useColorMode } from "@chakra-ui/react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TransitionChildren } from "react-transition-group/Transition";
import { Item } from "../data";
import Feedback from "./Feedback";
import MolstarViewer from "./MolstarViewer";
import QuickAccessLinks from "./QuickAccessLinks";
import SvgSpinner from "./SvgSpinner";
import VisualizationWaitingModal from "./WaitingModal";
import { transformCoordinates } from "./utils";

const VisualizationComp = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const cameraRef = useRef() as MutableRefObject<THREE.PerspectiveCamera>;
  const scatterRef = createRef<ScatterBoardRef>();
  // const moleculeViewerRef = createRef<MoleculeViewerRef>();
  const [isFABOpen, setIsFABOpen] = useState(true);
  const [fileUploadShown, setFileUploadShown] = useState(true);
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch<any, any, any>>();
  const [isWaitingForData, setIsWaitingForData] = useState(true);
  const [fromColab, setFromColab] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if the current route is /colab
    if (location.pathname === "/colab") {
      // Implement your logic when /colab is accessed
      setFromColab(true);
    }
  }, [location]);

  useEffect(() => {
    if (settings.csvFilePath !== "") {
      dispatchThunk(fetchAndSetData({}));
    }
  }, [settings.csvFilePath]);

  function exportFileV2() {
    const jsonData = {
      visualization_state: {
        default_color_scheme: settings.default_color_scheme,
        camera: [
          {
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
            zoom: cameraRef.current.zoom,
          },
        ],
        searchItems: settings.searchItems,
        colorParamList: settings.colorParamList,
        colorParam: settings.colorParam,
        colorKey: settings.colorKey,
        colorList: settings.colorList,
        keyList: settings.keyList,
        technique: settings.technique,
        customFeatures: settings.customFeatures,
        legend: {
          selected_feature: "settings.legend.selected_feature",
          mapping: "settings.legend.mapping",
        },
        highlighting: settings.highlighting,
        projection: settings.highlighting.selectedProjection,
        structures: settings.highlighting.shownStructures,
      },
      protein_data: settings.protein_data,
      projections: settings.projections,
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "protspace.json";
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  // function exportFile() {
  //   const jsonData = {
  //     data: settings.data,
  //     keyList: settings.keyList,
  //     technique: settings.technique,
  //     colorParam: settings.colorParam,
  //     colorKey: settings.colorKey,
  //     shapeParam: settings.shapeParam,
  //     shapeKey: settings.shapeKey,
  //     searchItems: settings.searchItems,
  //     colorParamList: settings.colorParamList,
  //     shapeParamList: settings.shapeParamList,
  //     threeD: settings.threeD,
  //     twoLegend: settings.twoLegend,
  //     csvFilePath: settings.csvFilePath,
  //     position: {
  //       x: cameraRef.current.position.x,
  //       y: cameraRef.current.position.y,
  //       z: cameraRef.current.position.z,
  //     },
  //     rotation: {
  //       x: cameraRef.current.rotation.x,
  //       y: cameraRef.current.rotation.y,
  //       z: cameraRef.current.rotation.z,
  //     },
  //   };

  //   const jsonString = JSON.stringify(jsonData, null, 2);
  //   const blob = new Blob([jsonString], { type: "application/json" });

  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "data.json"; // Change the filename as needed
  //   link.click();

  //   // Clean up
  //   URL.revokeObjectURL(url);
  // }

  const handleFileChangeJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setIsLoading(true));
      readFileContentsJSON(file);
    }
  };

  const readFileContentsJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContents = event.target?.result;
      if (fileContents) {
        try {
          const parsedObject = JSON.parse(fileContents as string);
          importFileV2(parsedObject);
        } catch (error) {
          dispatch(setIsLoading(false));
          dispatch(setErrorMessage("JSON could not be parsed."));
          console.error("Error parsing JSON:", error);
        }
      }
    };
    reader.readAsText(file);
  };

  // function importFile(parsedObject: any) {
  //   dispatch(setTechnique(parsedObject.technique ?? ""));
  //   dispatch(setColorParam(parsedObject.colorParam ?? ""));
  //   dispatch(setShapeParam(parsedObject.shapeParam ?? ""));
  //   dispatch(setSearchItems(parsedObject.searchItems ?? []));
  //   dispatch(setThreeD(parsedObject.threeD ?? false));
  //   dispatch(setTwoLegend(parsedObject.twoLegend ?? false));
  //   dispatch(setCSVFilePath(parsedObject.csvFilePath ?? ""));
  //   dispatch(setColorKey(parsedObject.colorKey ?? ""));
  //   dispatch(setData(parsedObject.data ?? []));
  //   dispatch(setKeyList(parsedObject.keyList ?? []));
  //   dispatch(setColorParamList(parsedObject.colorParamList ?? []));
  //   dispatch(setShapeParamList(parsedObject.shapeParamList ?? []));
  //   dispatch(setSelectedMols([]));
  //   dispatch(setPdbExists(false));
  //   dispatch(
  //     setCameraPosition(
  //       new Vector3(
  //         parsedObject.position.x,
  //         parsedObject.position.y,
  //         parsedObject.position.z
  //       )
  //     )
  //   );
  //   dispatch(
  //     setCameraRotation(
  //       new Vector3(
  //         parsedObject.position.x,
  //         parsedObject.position.y,
  //         parsedObject.position.z
  //       )
  //     )
  //   );

  //   dispatch(setIsLoading(false));
  // }

  function importFileV2(parsedObject: any) {
    dispatch(setIsLoading(true));
    dispatch(setData([]));
    dispatch(setKeyList([]));
    dispatch(setThreeD(false));
    dispatch(setColorKey(""));
    dispatch(setColorParam(""));
    dispatch(setColorParamList([]));
    dispatch(setSearchItems([]));
    dispatch(setColorList(colorList));

    dispatch(setProjections([]));
    dispatch(setProteinData([]));

    const selectedProjection =
      (parsedObject.visualization_state &&
        parsedObject.visualization_state.technique) ??
      0;
    parsedObject.projections[selectedProjection].data.forEach(
      (element: any) => {
        element = element = parsedObject.protein_data
          ? Object.assign(
              element,
              parsedObject.protein_data[element.identifier]
            )
          : element;
      }
    );

    let ifColorParamListEmpty = false;
    const items: Item[] = [];
    if (!parsedObject.visualization_state) {
      ifColorParamListEmpty = true;
    }
    const colorParamList: string[] =
      (parsedObject.visualization_state &&
        parsedObject.visualization_state.colorParamList) ??
      [];

    const keys = parsedObject.protein_data
      ? Object.keys(
          parsedObject.projections[selectedProjection].data[0].features
        ).filter(
          (item: any) =>
            parsedObject.projections[selectedProjection].data[0].features[item]
        )
      : ["NaN"];

    const colorKey = keys[0];
    const newData = parsedObject.protein_data
      ? parsedObject.projections[selectedProjection].data.map((item: any) => {
          const newItem = {
            ...item,
          }; // Create a copy of the current item
          for (const key in newItem.features) {
            if (newItem.features[key] === "") {
              newItem.features[key] = "NaN";
            }
          }
          return newItem;
        })
      : [];

    parsedObject.protein_data &&
      newData.forEach((element: any) => {
        for (const key in element.features) {
          const value = element.features[key];
          if (
            items.filter((e) => e.category === key && e.name === value)
              .length === 0
          ) {
            if (key === colorKey) {
              items.push({
                category: key,
                color: colorList[colorParamList.length % colorList.length],
                name: value,
              });
              ifColorParamListEmpty && colorParamList.push(value);
            } else {
              items.push({ category: key, name: value });
            }
          }
        }
      });

    const updatedDataItems = parsedObject.visualization_state?.customFeatures
      ? settings.dataItems.map((item: { name: any; category: any }) => {
          const customization =
            parsedObject.visualization_state?.customFeatures.find(
              (custom: { featureName: any; category: any }) =>
                custom.featureName === item.name &&
                custom.category === item.category
            );
          if (customization) {
            return {
              ...item,
              name: customization.customName,
              color: customization.color,
            };
          }
          return item;
        })
      : null;

    dispatch(
      setData(
        transformCoordinates(parsedObject.projections[selectedProjection].data)
      )
    );
    dispatch(
      setKeyList(
        parsedObject.protein_data
          ? Object.keys(
              parsedObject.projections[selectedProjection].data[0].features
            )
          : ["NaN"]
      )
    );
    dispatch(
      setThreeD(parsedObject.projections[selectedProjection].dimensions === 3)
    );

    dispatch(setColorParam(parsedObject.visualization_state?.colorParam ?? ""));
    dispatch(
      setSearchItems(parsedObject.visualization_state?.searchItems ?? [])
    );

    dispatch(setProjections(parsedObject.projections));
    dispatch(setProteinData(parsedObject.protein_data));
    dispatch(setTechnique(parsedObject.visualization_state?.technique ?? 0));
    dispatch(
      setColorKey(
        (parsedObject.visualization_state &&
          parsedObject.visualization_state.colorKey) ??
          colorKey
      )
    );
    let customFeatures = parsedObject.visualization_state?.customFeatures;
    const sortedCustomFeatures = Array.isArray(customFeatures)
      ? customFeatures.sort(
          (a: { customName: string }, b: { customName: any }) =>
            a.customName.localeCompare(b.customName)
        )
      : [];

    dispatch(setCustomFeature(sortedCustomFeatures));

    const filteredColorParamList = sortedCustomFeatures.filter(
      (feature: { category: string }) =>
        feature.category === parsedObject.visualization_state?.colorKey
    );

    const orderedColorParamList = filteredColorParamList.map(
      (feature: { featureName: string }) => feature.featureName
    );

    dispatch(
      setColorParamList(
        filteredColorParamList.length > 0
          ? orderedColorParamList
          : colorParamList
      )
    );
    // dispatch(
    //   setColorList(
    //     (parsedObject.visualization_state &&
    //       parsedObject.visualization_state.colorList) ??
    //       settings.colorList
    //   )
    // );
    dispatch(setDataItems(updatedDataItems ?? []));

    if (
      !parsedObject.visualization_state ||
      parsedObject.projections[selectedProjection].dimensions === 2
    ) {
      dispatch(
        setCameraPosition(
          new Vector3(0.05273795378094992, 3.473258577458065, 59.89936304805207)
        )
      );

      dispatch(
        setCameraRotation(
          new Vector3(
            -0.05792004425389763,
            0.0008789660095279366,
            0.00005096674957453894
          )
        )
      );
    } else {
      dispatch(
        setCameraPosition(
          new Vector3(
            parsedObject.visualization_state.camera[0].position.x,
            parsedObject.visualization_state.camera[0].position.y,
            parsedObject.visualization_state.camera[0].position.z
          )
        )
      );
      dispatch(
        setCameraRotation(
          new Vector3(
            parsedObject.visualization_state.camera[0].position.x,
            parsedObject.visualization_state.camera[0].position.y,
            parsedObject.visualization_state.camera[0].position.z
          )
        )
      );
      dispatch(setCamera(parsedObject.visualization_state.camera[0]));
    }
    // dispatch(
    //   setSearchItems(
    //     parsedObject.visualization_state.highlighting.search_selection ?? []
    //   )
    // );
    dispatch(setIsLoading(false));
  }

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.source === "colab") {
        // Assuming `event.data.content` contains your JSON object
        const parsedObject = event.data.content;
        setIsWaitingForData(false);
        processColabData(parsedObject); // Process the data as needed
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const processColabData = (parsedObject: any) => {
    dispatch(setIsLoading(true));
    importFileV2(parsedObject.data);
  };
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="absolute z-10 left-0 top-0 w-screen">
        <Nav />
        <Feedback />
        <QuickAccessLinks />
      </div>
      {isWaitingForData && fromColab ? (
        <VisualizationWaitingModal
          isOpen={isWaitingForData}
          onClose={() => {
            setIsWaitingForData(false);
            navigate("/");
          }}
        />
      ) : (
        <main className="h-full">
          <FileUploadFormModal
            fileUploadShown={fileUploadShown}
            setFileUploadShown={setFileUploadShown}
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
              <span style={{ fontSize: "20px", color: "black" }}>
                Analysis in progress...
              </span>
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  placeContent: "center",
                }}
              >
                <SvgSpinner />
              </div>

              <span
                style={{
                  display: "flex",
                  width: "100%",
                  placeContent: "center",
                  color: "black",
                }}
              >
                Time Remaining: <strong> &nbsp; {"<"} 1 minute</strong>
              </span>
            </div>
          </div>
          <EntitySearch />
          <div className="h-full">
            <div className="bg-white h-full">
              <div className="absolute z-0 top-0 left-0">
                <ScatterBoard
                  lightMode={colorMode === "light"}
                  cameraRef={cameraRef}
                  setColorParam={(param: string) =>
                    dispatch(setColorParam(param))
                  }
                  setShapeParam={(param: string) =>
                    dispatch(setShapeParam(param))
                  }
                  keyList={settings.keyList}
                  setListParam={(param: string) =>
                    dispatch(setColorAndShapeKey(param, ""))
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
                  colorParamList={
                    settings.colorParamList &&
                    settings.colorParamList.sort((a: string, b: any) =>
                      a.toString().localeCompare(b.toString())
                    )
                  }
                  cameraPosition={settings.cameraPosition}
                  cameraRotation={settings.cameraRotation}
                  dataItems={settings.dataItems}
                  colorList={settings.colorList}
                  customFeatures={settings.customFeatures}
                  setCustomFeatures={(value: any) => {
                    const mergedCustomFeatures = [...settings.customFeatures];

                    value.forEach(
                      (newFeature: {
                        featureName: string;
                        category: string;
                      }) => {
                        const index = mergedCustomFeatures.findIndex(
                          (feature) =>
                            feature.featureName === newFeature.featureName &&
                            feature.category === newFeature.category
                        );
                        if (index !== -1) {
                          // Update existing feature
                          mergedCustomFeatures[index] = newFeature;
                        } else {
                          // Add new feature
                          mergedCustomFeatures.push(newFeature);
                        }
                      }
                    );
                    dispatch(setCustomFeature(mergedCustomFeatures));
                    const updatedDataItems = settings.dataItems.map(
                      (item: { name: any; category: any }) => {
                        const customization = mergedCustomFeatures.find(
                          (custom) =>
                            custom.featureName === item.name &&
                            custom.category === item.category
                        );
                        if (customization) {
                          return {
                            ...item,
                            name: customization.customName,
                            color: customization.color,
                          };
                        }
                        return item;
                      }
                    );

                    const updatedSearchItems = settings.searchItems.map(
                      (item: { name: any; category: any }) => {
                        const customization = mergedCustomFeatures.find(
                          (custom) =>
                            custom.featureName === item.name &&
                            custom.category === item.category
                        );
                        if (customization) {
                          return {
                            ...item,
                            name: customization.customName,
                            color: customization.color,
                          };
                        }
                        return item;
                      }
                    );

                    dispatch(setDataItems(updatedDataItems));
                    dispatch(setSearchItems(updatedSearchItems));
                  }}
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
                {settings.selectedMols.length !== 0 && <MolstarViewer />}
              </div>
              <div className="controller-menu">
                <div className="has-tooltip">
                  <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
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
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          {colorMode !== "light" ? "Light Mode" : "Dark Mode"}
                        </span>
                        <div
                          className={`rounded-full w-12 h-12 m-1 flex items-center cursor-pointer shadow-md ${
                            colorMode !== "light"
                              ? "bg-gray-400"
                              : "bg-gray-900"
                          }`}
                          onClick={toggleColorMode}
                        >
                          {colorMode !== "light" ? (
                            <MdLightMode
                              style={{
                                color: "white",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                              }}
                              className="w-6 m-auto text-white"
                            />
                          ) : (
                            <MdDarkMode
                              style={{
                                color: "white",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                              }}
                              className="w-6 m-auto text-white"
                            />
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
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          Download Plot
                        </span>
                        <div
                          className="rounded-full bg-yellow-700 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                          onClick={() => {
                            setIsLegendOpen(true);
                            scatterRef?.current?.downloadScreenshot();
                            setIsLegendOpen(false);
                          }}
                        >
                          <BsFiletypePng
                            style={{
                              color: "white",
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                            }}
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
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
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
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          {settings.isLegendOpen
                            ? "Hide Legend"
                            : "Show Legend"}
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
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          Export Project
                        </span>
                        <div
                          className="rounded-full bg-pink-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                          onClick={() => exportFileV2()}
                        >
                          <DocumentArrowDownIcon className="w-6 m-auto text-white" />
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
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          Import Project
                        </span>

                        <input
                          id="file-upload-json"
                          type="file"
                          accept=".json"
                          onChange={handleFileChangeJSON}
                          className="hidden"
                        />
                        <label
                          className="file-label"
                          htmlFor="file-upload-json"
                        >
                          <div className="rounded-full bg-purple-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
                            <DocumentArrowUpIcon className="w-6 m-auto text-white" />
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
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          Settings
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
      )}
    </div>
  );
};

export default VisualizationComp;
