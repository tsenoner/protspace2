import { Button } from "@chakra-ui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { AtomStyleSpec } from "../data";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import {
  setAtomStyle,
  setColorAndShapeKey,
  setColorParam,
  setSearchAtomStyle,
  setSearchItems,
  setShapeParam,
  setThreeD,
  setTwoLegend,
} from "../redux/actions/settings";
import SettingsSearch from "./SettingsSearch";
import { StyleDiv } from "./StyleDiv";

function SettingsModal(props: {
  settingsShown: boolean;
  setSettingsShown: (arg0: boolean) => void;
  pdbExists: boolean;
}) {
  // const techniqueList = ["umap", "pca", "tsne"];
  const dispatch = useAppDispatch();
  const { colorKey, shapeKey, twoLegend, threeD, searchAtomStyle, keyList } =
    useAppSelector((state) => state.settings);

  const [selectedColorKey, setSelectedColorKey] = useState(colorKey);
  const [selectedShapeKey, setSelectedShapeKey] = useState(shapeKey);
  const [is2Legend, setIs2Legend] = useState(twoLegend);
  const [is3d, setIs3d] = useState(threeD);

  useEffect(() => {
    setSelectedColorKey(colorKey);
    setSelectedShapeKey(shapeKey);
    setIs2Legend(twoLegend);
    setIs3d(threeD);
  }, [colorKey, shapeKey, twoLegend, threeD]);

  return (
    <div className={props.settingsShown ? "flex" : "hidden"}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto max-h-[80%]">
          <div className="modal-content py-4 text-left px-6">
            {/* Modal header */}
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold">Settings</p>
              <button
                className="modal-close cursor-pointer z-50"
                onClick={() => props.setSettingsShown(false)}
              >
                <XMarkIcon className="w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-scroll">
              <div className="mb-4 block">
                <div className="flex">
                  <p className="mr-2">2 Legends!!</p>
                  <input
                    type="checkbox"
                    checked={is2Legend}
                    onChange={() => setIs2Legend(!is2Legend)}
                  ></input>
                </div>

                <div className="flex">
                  <p className="whitespace-nowrap">Color Key</p>
                  <select
                    onChange={(event) => {
                      if (event.target.value === selectedShapeKey) {
                        setSelectedShapeKey(selectedColorKey);
                      }
                      setSelectedColorKey(event.target.value);
                    }}
                    className="mx-4 min-w-100 bg-transparent"
                    value={selectedColorKey}
                  >
                    {keyList.map((option: string, index: number) => (
                      <option key={index} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {is2Legend && (
                  <div className="flex">
                    <p className="whitespace-nowrap	">Shape Key</p>
                    <select
                      onChange={(event) => {
                        setSelectedShapeKey(event.target.value);
                      }}
                      className="mx-4 min-w-100 bg-transparent"
                      value={selectedShapeKey}
                    >
                      {keyList
                        .filter((key: string) => key !== selectedColorKey)
                        .map((option: string, index: number) => (
                          <option key={index} value={option}>
                            {option.toUpperCase()}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className="flex">
                  <p className="mr-2">3D</p>
                  <input
                    type="checkbox"
                    checked={is3d}
                    onChange={() => setIs3d(!is3d)}
                  ></input>
                </div>
                {props.pdbExists && (
                  <div>
                    <SettingsSearch />
                    <hr />
                    <div>
                      {Object.keys(searchAtomStyle).map(
                        (element: string, index: number) => {
                          return (
                            <StyleDiv
                              key={index}
                              styleSpec={
                                searchAtomStyle[element as keyof AtomStyleSpec]
                              }
                              setStyleSpec={(key_: string, value_: any) =>
                                dispatch(
                                  setSearchAtomStyle({
                                    ...searchAtomStyle,
                                    [element]: {
                                      ...searchAtomStyle[
                                        element as keyof AtomStyleSpec
                                      ],
                                      [key_]: value_,
                                    },
                                  })
                                )
                              }
                              name={element}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    dispatch(
                      setColorAndShapeKey(selectedColorKey, selectedShapeKey)
                    );
                    dispatch(setTwoLegend(is2Legend));
                    dispatch(setSearchItems([]));
                    dispatch(setColorParam(""));
                    dispatch(setShapeParam(""));
                    dispatch(setThreeD(is3d));
                    dispatch(setAtomStyle(searchAtomStyle));
                    props.setSettingsShown(false);
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

export default SettingsModal;
