import {
  ArrowsPointingInIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CogIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  MapIcon
} from '@heroicons/react/24/solid';
import React, { MutableRefObject, createRef, useEffect, useRef, useState } from 'react';
import { BsFiletypePng, BsFiletypeSvg } from 'react-icons/bs';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';

import { ScatterBoard, type ScatterBoardRef } from 'scatter-board-library';
import { Vector3 } from 'three';
import { colorList, shapeList } from '../../helpers/constants';
import { useAppDispatch, useAppSelector } from '../../helpers/hooks';
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
  setStates
} from '../../redux/actions/settings';
import EntitySearch from '../entity-search/EntitySearch';
import ErrorModal from '../error-modal/ErrorModal';
import { FileUploadFormModal } from '../file-upload-form-modal/FileUploadFormModal';
import Nav from '../nav/Nav';
import { useColorMode } from '@chakra-ui/react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { TransitionChildren } from 'react-transition-group/Transition';
import { Item } from '../../data';
import Feedback from '../feedback/Feedback';
import MolstarViewer from '../molstar-viewer/MolstarViewer';
import QuickAccessLinks from '../quick-access-links/QuickAccessLinks';
import SvgSpinner from '../svg-spinner/SvgSpinner';
import VisualizationWaitingModal from '../waiting-modal/WaitingModal';
import pako from 'pako';
import { StatesModal } from '../states-modal/StatesModal';

const VisualizationComp = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const cameraRef = useRef() as MutableRefObject<THREE.PerspectiveCamera>;
  const scatterRef = createRef<ScatterBoardRef>();
  const [isFABOpen, setIsFABOpen] = useState(true);
  const [fileUploadShown, setFileUploadShown] = useState(true);
  const [showStatesModal, setShowStatesModal] = useState(false);
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch<any, any, any>>();
  const [isWaitingForData, setIsWaitingForData] = useState(true);
  const [fromColab, setFromColab] = useState(false);
  const location = useLocation();
  const [isCompareMode, setIsCompareMode] = useState(false);

  useEffect(() => {
    if (location.pathname === '/colab') {
      setFromColab(true);
    }
  }, [location]);

  useEffect(() => {
    if (settings.csvFilePath !== '') {
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
              z: cameraRef.current.position.z
            },
            rotation: {
              x: cameraRef.current.rotation.x,
              y: cameraRef.current.rotation.y,
              z: cameraRef.current.rotation.z
            },
            zoom: cameraRef.current.zoom
          }
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
          selected_feature: 'settings.legend.selected_feature',
          mapping: 'settings.legend.mapping'
        },
        highlighting: settings.highlighting,
        projection: settings.highlighting.selectedProjection,
        structures: settings.highlighting.shownStructures,
        states: settings.states
      },
      protein_data: settings.protein_data,
      projections: settings.projections
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'protspace.json';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  const handleFileChangeJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setIsLoading(true));
      if (file.name.endsWith('.json')) {
        readFileContentsJSONOnly(file);
      } else if (file.name.endsWith('.json.gz')) {
        readFileContentsJSON(file);
      } else {
        dispatch(setIsLoading(false));
        dispatch(setErrorMessage('Unsupported file type.'));
      }
    }
  };

  const readFileContentsJSONOnly = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const parsedData = JSON.parse(event.target.result as string);
        importFileV2(parsedData);
      }
    };

    reader.onerror = (error) => {
      dispatch(setIsLoading(false));
      dispatch(setErrorMessage('Error reading file.'));
      console.error('Error reading file:', error);
    };

    dispatch(setIsLoading(true));
    reader.readAsText(file);
  };

  const readFileContentsJSON = (file: File) => {
    const reader = new FileReader();
    const chunkSize = 4 * 1024 * 1024; // 4MB chunks
    let offset = 0;
    const chunks: Uint8Array[] = [];

    const readChunk = () => {
      const slice = file.slice(offset, offset + chunkSize);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (event) => {
      if (event.target?.result) {
        const arrayBuffer = event.target.result as ArrayBuffer;
        chunks.push(new Uint8Array(arrayBuffer));
        offset += chunkSize;

        if (offset < file.size) {
          readChunk();
        } else {
          processBuffer(chunks);
        }
      }
    };

    reader.onerror = (error) => {
      dispatch(setIsLoading(false));
      dispatch(setErrorMessage('Error reading file.'));
      console.error('Error reading file:', error);
    };

    dispatch(setIsLoading(true));
    readChunk();
  };

  const processBuffer = (chunks: Uint8Array[]) => {
    try {
      const concatenatedChunks = concatenateChunks(chunks);
      const decompressedData = pako.inflate(concatenatedChunks, {
        to: 'string'
      });
      const parsedData = JSON.parse(decompressedData);
      importFileV2(parsedData);
    } catch (error) {
      console.error('Decompression or parsing error:', error);
      dispatch(setErrorMessage('Failed to decompress or parse the file.'));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const concatenateChunks = (chunks: Uint8Array[]) => {
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  };

  function importFileV2(parsedObject: any) {
    try {
      dispatch(setIsLoading(true));
      dispatch(setData([]));
      dispatch(setKeyList([]));
      dispatch(setThreeD(false));
      dispatch(setColorKey(''));
      dispatch(setColorParam(''));
      dispatch(setColorParamList([]));
      dispatch(setSearchItems([]));
      dispatch(setColorList(colorList));
      dispatch(setProjections([]));
      dispatch(setProteinData([]));

      // Validate essential keys in the JSON structure
      if (!parsedObject.projections || !Array.isArray(parsedObject.projections)) {
        dispatch(setErrorMessage("Invalid JSON: 'projections' is missing or not an array."));
        throw new Error("Invalid JSON: 'projections' is missing or not an array.");
      }

      const selectedProjection = parsedObject.visualization_state?.technique ?? 0;

      if (!parsedObject.projections[selectedProjection]) {
        dispatch(
          setErrorMessage(`Invalid JSON: Projection at index ${selectedProjection} does not exist.`)
        );
        throw new Error(`Invalid JSON: Projection at index ${selectedProjection} does not exist.`);
      }

      const projectionData = parsedObject.projections[selectedProjection].data;
      if (!projectionData || !Array.isArray(projectionData)) {
        dispatch(
          setErrorMessage("Invalid JSON: 'data' within projections is missing or not an array.")
        );
        throw new Error("Invalid JSON: 'data' within projections is missing or not an array.");
      }

      // Check for protein_data and features
      if (parsedObject.protein_data) {
        projectionData.forEach((element: any, index: number) => {
          if (!element.identifier || !parsedObject.protein_data[element.identifier]) {
            dispatch(
              setErrorMessage(
                `Invalid JSON: 'identifier' is missing for element at index ${index}.`
              )
            );
            throw new Error(
              `Invalid JSON: 'protein_data' is missing for identifier at index ${index}.`
            );
          }
          if (
            !parsedObject.protein_data[element.identifier].features ||
            typeof parsedObject.protein_data[element.identifier].features !== 'object'
          ) {
            dispatch(
              setErrorMessage(
                `Invalid JSON: 'features' is missing or not an object for identifier at index ${index}.`
              )
            );
            throw new Error(
              `Invalid JSON: 'features' is missing or not an object for identifier at index ${index}.`
            );
          }
        });
      }

      // Proceed to assign protein_data to projectionData elements
      if (parsedObject.protein_data) {
        projectionData.forEach((element: any) => {
          Object.assign(element, parsedObject.protein_data[element.identifier]);
        });
      }

      const colorParamList: string[] = parsedObject.visualization_state?.colorParamList ?? [];
      const ifColorParamListEmpty = !parsedObject.visualization_state;
      const items: Item[] = [];

      // Ensure that features exist in projectionData
      const keys = parsedObject.protein_data
        ? Object.keys(projectionData[0].features).filter(
            (item: any) => projectionData[0].features[item]
          )
        : ['NaN'];

      const colorKey = keys[0];

      const newData = parsedObject.protein_data
        ? projectionData.map((item: any) => {
            const newItem = { ...item };
            Object.keys(newItem.features).forEach((key) => {
              if (newItem.features[key] === '') {
                newItem.features[key] = 'NaN';
              }
            });
            return newItem;
          })
        : [];

      if (parsedObject.protein_data) {
        newData.forEach((element: any) => {
          Object.keys(element.features).forEach((key) => {
            const value = element.features[key];
            if (!items.some((e) => e.category === key && e.name === value)) {
              if (key === colorKey) {
                items.push({
                  category: key,
                  color: colorList[colorParamList.length % colorList.length],
                  name: value,
                  id: element.identifier
                });
                if (ifColorParamListEmpty) colorParamList.push(value);
              } else {
                items.push({
                  category: key,
                  name: value,
                  id: element.identifier
                });
              }
            }
          });
        });
      }

      const updatedDataItems = parsedObject.visualization_state?.customFeatures
        ? settings.dataItems.map((item: { name: any; category: any }) => {
            const customization = parsedObject.visualization_state?.customFeatures.find(
              (custom: { featureName: any; category: any }) =>
                custom.featureName === item.name && custom.category === item.category
            );
            return customization
              ? {
                  ...item,
                  name: customization.customName,
                  color: customization.color
                }
              : item;
          })
        : null;

      // @ts-expect-error - TS complains about missing properties in the object
      dispatch(setData(projectionData));
      dispatch(setKeyList(keys));
      dispatch(setThreeD(parsedObject.projections[selectedProjection].dimensions === 3));
      dispatch(setColorParam(parsedObject.visualization_state?.colorParam ?? ''));
      dispatch(setSearchItems(parsedObject.visualization_state?.searchItems ?? []));
      dispatch(setProjections(parsedObject.projections));
      dispatch(setProteinData(parsedObject.protein_data));
      dispatch(setTechnique(parsedObject.visualization_state?.technique ?? 0));
      dispatch(setColorKey(parsedObject.visualization_state?.colorKey ?? colorKey));

      const customFeatures = parsedObject.visualization_state?.customFeatures;
      const sortedCustomFeatures = Array.isArray(customFeatures)
        ? customFeatures.sort((a: { customName: string }, b: { customName: string }) =>
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
          filteredColorParamList.length > 0 ? orderedColorParamList : colorParamList
        )
      );
      dispatch(setDataItems(updatedDataItems ?? []));

      if (
        !parsedObject.visualization_state ||
        parsedObject.projections[selectedProjection].dimensions === 2
      ) {
        dispatch(
          setCameraPosition(new Vector3(0.1081416025825182, 7.1220766416134875, 122.82640203663571))
        );
        dispatch(
          setCameraRotation(
            new Vector3(-0.05792004425389764, 0.0008789660095279305, 0.000050966749574538594)
          )
        );
      } else {
        const cameraPosition = parsedObject.visualization_state.camera[0].position;
        dispatch(
          setCameraPosition(new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z))
        );
        dispatch(
          setCameraRotation(new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z))
        );
        dispatch(setCamera(parsedObject.visualization_state.camera[0]));
      }

      dispatch(setStates(parsedObject.visualization_state?.states ?? []));

      dispatch(setIsLoading(false));
    } catch (error) {
      console.error('Error in importFileV2:', error);
      dispatch(setIsLoading(false));
      throw error;
    }
  }

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.source === 'colab') {
        const parsedObject = event.data.content;
        setIsWaitingForData(false);
        processColabData(parsedObject);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const processColabData = (parsedObject: any) => {
    dispatch(setIsLoading(true));
    importFileV2(parsedObject.data);
  };
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen overflow-hidden" data-testid="visualization-component">
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
            navigate('/');
          }}
        />
      ) : (
        <main className="h-full">
          <FileUploadFormModal
            fileUploadShown={fileUploadShown}
            setFileUploadShown={setFileUploadShown}
          />
          <StatesModal
            showStatesModal={showStatesModal}
            setShowStatesModal={setShowStatesModal}
            cameraRef={cameraRef}
          />
          <div
            className={
              settings.isLoading
                ? 'absolute inset-0 z-40 flex justify-center items-center bg-opacity-50 bg-gray-300'
                : 'hidden'
            }>
            <div
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                fontSize: '16px',
                paddingBottom: '24px'
              }}>
              <span style={{ fontSize: '20px', color: 'black' }}>Analysis in progress...</span>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  placeContent: 'center'
                }}>
                <SvgSpinner />
              </div>

              <span
                style={{
                  display: 'flex',
                  width: '100%',
                  placeContent: 'center',
                  color: 'black'
                }}>
                Time Remaining: <strong> &nbsp; {'<'} 1 minute</strong>
              </span>
            </div>
          </div>
          <EntitySearch />
          <div className="h-full">
            <div className="bg-white h-full">
              <div className="absolute z-0 top-0 left-0">
                <ScatterBoard
                  lightMode={colorMode === 'light'}
                  cameraRef={cameraRef}
                  setColorParam={(param: string) => dispatch(setColorParam(param))}
                  setShapeParam={(param: string) => dispatch(setShapeParam(param))}
                  keyList={settings.keyList}
                  setListParam={(param: string) => dispatch(setColorAndShapeKey(param, ''))}
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

                    value.forEach((newFeature: { featureName: string; category: string }) => {
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
                    });
                    dispatch(setCustomFeature(mergedCustomFeatures));
                    const updatedDataItems = settings.dataItems.map(
                      (item: { name: any; category: any }) => {
                        const customization = mergedCustomFeatures.find(
                          (custom) =>
                            custom.featureName === item.name && custom.category === item.category
                        );
                        if (customization) {
                          return {
                            ...item,
                            name: customization.customName,
                            color: customization.color
                          };
                        }
                        return item;
                      }
                    );

                    const updatedSearchItems = settings.searchItems.map(
                      (item: { name: any; category: any }) => {
                        const customization = mergedCustomFeatures.find(
                          (custom) =>
                            custom.featureName === item.name && custom.category === item.category
                        );
                        if (customization) {
                          return {
                            ...item,
                            name: customization.customName,
                            color: customization.color
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
                    if (settings.selectedMols.length === 2) {
                      const selectedMolsCopy = [...settings.selectedMols];
                      selectedMolsCopy[0] = value;
                      dispatch(setSelectedMols(selectedMolsCopy));
                      setIsCompareMode(true);
                    }
                    if (!(value in settings.selectedMols) && settings.selectedMols.length < 2) {
                      setIsCompareMode(false);
                      dispatch(setSelectedMols([value]));
                    }
                  }}
                  onCompareClicked={(value: string) => {
                    if (settings.selectedMols.length === 0) {
                      setErrorMessage('Please select a molecule to compare with.');
                      return;
                    }

                    const selectedMolsCopy = [...settings.selectedMols];

                    if (selectedMolsCopy.length >= 2) {
                      selectedMolsCopy.pop();
                    }

                    selectedMolsCopy.push(value);

                    dispatch(setSelectedMols(selectedMolsCopy));

                    setIsCompareMode(true);
                  }}
                />
                {settings.selectedMols.length !== 0 && (
                  <MolstarViewer isCompareMode={isCompareMode} />
                )}
              </div>
              <div className="controller-menu">
                <div className="has-tooltip">
                  <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                    {isFABOpen ? 'Collapse' : 'Expand'}
                  </span>
                  <div
                    className={`m-1 rounded-full w-12 h-12 bg-blue-700 flex items-center shadow-md cursor-pointer ${
                      isFABOpen ? '-translate-x' : ''
                    } transition-transform`}
                    onClick={() => setIsFABOpen(!isFABOpen)}>
                    {isFABOpen ? (
                      <ChevronDoubleRightIcon className="w-6 m-auto text-white" />
                    ) : (
                      <ChevronDoubleLeftIcon className="w-6 m-auto text-white" />
                    )}
                  </div>
                </div>
                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
                  {
                    (
                      <div className="has-tooltip">
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          {colorMode !== 'light' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                        <div
                          className={`rounded-full w-12 h-12 m-1 flex items-center cursor-pointer shadow-md ${
                            colorMode !== 'light' ? 'bg-gray-400' : 'bg-gray-900'
                          }`}
                          onClick={toggleColorMode}>
                          {colorMode !== 'light' ? (
                            <MdLightMode
                              style={{
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                              }}
                              className="w-6 m-auto text-white"
                            />
                          ) : (
                            <MdDarkMode
                              style={{
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                              }}
                              className="w-6 m-auto text-white"
                            />
                          )}
                        </div>
                      </div>
                    ) as TransitionChildren
                  }
                </CSSTransition>
                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
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
                          }}>
                          <BsFiletypePng
                            style={{
                              color: 'white',
                              fontSize: '1.5rem',
                              fontWeight: 'bold'
                            }}
                            className="w-6 m-auto text-white"
                          />
                        </div>
                      </div>
                    ) as TransitionChildren
                  }
                </CSSTransition>
                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
                  {
                    (
                      <div className="has-tooltip">
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          Download as SVG
                        </span>
                        <div
                          onClick={() => scatterRef?.current?.downloadSVG()}
                          className="rounded-full bg-blue-200 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
                          <BsFiletypeSvg
                            style={{ color: 'blue', fontSize: '1.5rem' }}
                            className="w-6 m-auto text-white"
                          />
                        </div>
                      </div>
                    ) as TransitionChildren
                  }
                </CSSTransition>

                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
                  {
                    (
                      <div className="has-tooltip">
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          {settings.isLegendOpen ? 'Hide Legend' : 'Show Legend'}
                        </span>
                        <div
                          className="rounded-full bg-green-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                          onClick={() => dispatch(setIsLegendOpen(!settings.isLegendOpen))}>
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
                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
                  {
                    (
                      <div className="has-tooltip">
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          Export Project
                        </span>
                        <div
                          className="rounded-full bg-pink-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                          onClick={() => exportFileV2()}>
                          <DocumentArrowDownIcon className="w-6 m-auto text-white" />
                        </div>
                      </div>
                    ) as TransitionChildren
                  }
                </CSSTransition>
                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
                  {
                    (
                      <div className="has-tooltip">
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-white mt-14">
                          Import Project
                        </span>

                        <input
                          id="file-upload-json"
                          type="file"
                          accept=".json,.gz"
                          onChange={handleFileChangeJSON}
                          className="hidden"
                        />
                        <label className="file-label" htmlFor="file-upload-json">
                          <div className="rounded-full bg-purple-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
                            <DocumentArrowUpIcon className="w-6 m-auto text-white" />
                          </div>
                        </label>
                      </div>
                    ) as TransitionChildren
                  }
                </CSSTransition>
                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
                  {
                    (
                      <div className="has-tooltip">
                        <span className="tooltip rounded shadow-lg p-1 bg-black bg-opacity-50 text-blue mt-14">
                          Save State
                        </span>
                        <div
                          className="rounded-full bg-pink-800 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md"
                          onClick={() => setShowStatesModal(true)}>
                          <DocumentPlusIcon className="w-6 m-auto text-white" />
                        </div>
                      </div>
                    ) as TransitionChildren
                  }
                </CSSTransition>
                <CSSTransition in={isFABOpen} timeout={300} classNames="fade" unmountOnExit>
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
                          className="rounded-full bg-gray-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
                          <CogIcon className="w-6 m-auto text-white" />
                        </div>
                      </div>
                    ) as TransitionChildren
                  }
                </CSSTransition>
              </div>
            </div>
          </div>
          {settings.errorMessage !== '' && <ErrorModal />}
        </main>
      )}
    </div>
  );
};

export default VisualizationComp;
