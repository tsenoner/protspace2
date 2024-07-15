import React, { useEffect, useRef, useState } from "react";
import { HexAlphaColorPicker, RgbaStringColorPicker } from "react-colorful";
import "../../styles/tailwind.css";
import ColorLegendItem from "../ColorLegendItem/ColorLegendItem";
import { ColorLegendProps } from "./ColorLegend.types";

type ParamCustomization = {
  featureName: string; // Original feature name, immutable
  customName: string; // Customizable name
  color: string; // Customizable color
  category: string; // Category of the feature
  opacity?: number; // Customizable opacity
};

type EditColorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  colorList: string[];
  onSave: (editList: ParamCustomization[]) => void;
  colorParamList: string[];
  existingCustomizations: ParamCustomization[];
  category: string;
};

const EditColorModal: React.FC<EditColorModalProps> = ({
  isOpen,
  onClose,
  colorList,
  onSave,
  colorParamList,
  existingCustomizations,
  category,
}) => {
  const initializeEditList = () => {
    return colorParamList.map((featureName, index) => {
      const existingCustomization =
        Object.keys(existingCustomizations).length !== 0 &&
        existingCustomizations.find(
          (c) => c.featureName === featureName && c.category === category
        );
      return {
        featureName,
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        customName: existingCustomization?.customName || featureName,
        color:
          featureName === "NaN"
            ? "#000000"
            : // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
              existingCustomization?.color ||
              colorList[index % colorList.length],
        category: category,
      };
    });
  };
  const [initialEditList, setInitialEditList] = useState<ParamCustomization[]>(
    []
  );

  const [editList, setEditList] =
    useState<ParamCustomization[]>(initializeEditList);
  const [activeColorPickerIndex, setActiveColorPickerIndex] = useState<
    number | null
  >(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const initialList = initializeEditList();
      setEditList(initialList);
      setInitialEditList(initialList); // Save the initial list when modal opens
    }
  }, [isOpen, colorList, colorParamList, existingCustomizations]);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setActiveColorPickerIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef]);

  useEffect(() => {
    setEditList(initializeEditList());
  }, [colorList, colorParamList, existingCustomizations]);

  // Handle changes in color
  const handleColorChange = (color: string, index: number) => {
    const newEditList = [...editList];
    newEditList[index].color = color;
    setEditList(newEditList);
  };

  // Handle changes in custom name
  const handleNameChange = (customName: string, index: number) => {
    const newEditList = [...editList];
    newEditList[index].customName = customName;
    setEditList(newEditList);
  };

  const handleSave = () => {
    const sortedEditList = [...editList].sort((a, b) =>
      a.customName.localeCompare(b.customName)
    );
    onSave(sortedEditList);
  };

  const handleCancel = () => {
    setEditList(initialEditList); // Reset to initial values on cancel
    onClose(); // Close modal
  };

  // Component render
  return isOpen ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        style={{ maxHeight: "480px", minWidth: "420px", overflow: "scroll" }}
        className="bg-white px-6 py-4 rounded"
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#333",
            textAlign: "center",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Edit Labels and Colors
        </h2>
        {/* <div>
          <HexAlphaColorPicker color="red" />
        </div>
        {editList.map((item, index) => (
          <div className="flex items-center justify-between my-4" key={index}>
            <input
              id={`hidden-color-input-${index}`}
              type="color"
              value={item.color}
              onChange={(e) => handleColorChange(e.target.value, index)}
              style={{
                opacity: 0,
                left: "40%",
                top: 200,
                position: "absolute",
                width: "24px",
                height: "24px",
                zIndex: -1,
                background: "none",
              }}
            />
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: item.color,
                cursor: "pointer",
              }}
              onClick={() =>
                document.getElementById(`hidden-color-input-${index}`)!.click()
              }
            ></div>
            <input
              type="text"
              value={item.customName}
              onChange={(e) => handleNameChange(e.target.value, index)}
              className="text-black p-1 rounded bg-gray-100"
              style={{ border: "1px solid #33333338", width: "87%" }}
            />
          </div>
        ))} */}
        {editList.map((item, index) => (
          <div className="flex items-center justify-between my-4" key={index}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: item.color,
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => setActiveColorPickerIndex(index)}
            >
              {activeColorPickerIndex === index && (
                <div
                  ref={pickerRef}
                  style={{ position: "absolute", zIndex: 2 }}
                >
                  <HexAlphaColorPicker
                    color={item.color}
                    onChange={(color) => handleColorChange(color, index)}
                  />
                  <input
                    type="text"
                    value={item.color}
                    onChange={(e) => handleColorChange(e.target.value, index)}
                    className="mt-2 p-1 text-center bg-white text-blue-700 border-b-2 border-gray-300"
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              value={item.customName}
              onChange={(e) => handleNameChange(e.target.value, index)}
              className="text-black p-1 rounded bg-gray-100"
              style={{ border: "1px solid #33333338", width: "87%" }}
            />
          </div>
        ))}
        <div
          className="flex justify-between mt-4"
          style={{ borderTop: "2px solid #eee", paddingTop: "16px" }}
        >
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mr-2"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

const ColorLegend: React.FC<ColorLegendProps> = ({
  screenshot,
  colorKey,
  keyList,
  setListParam,
  colorParamList,
  colorParam,
  setColorParam,
  colorList,
  setCustomFeatures,
  customizations,
  lightMode,
}) => {
  const [closed, setClosed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const findCustomization = (featureName: string) => {
    return (
      Object.keys(customizations).length !== 0 &&
      customizations.find(
        (c) => c.featureName === featureName && c.category === colorKey
      )
    );
  };

  const sortLogicBasedOnCustomFeatures = (customFeatures: any[]) => {
    const sortedCustomFeatures = customFeatures.sort((a, b) =>
      a.customName.localeCompare(b.customName)
    );

    const sortedFeatureNames = sortedCustomFeatures.map(
      (feature) => feature.featureName
    );

    return sortedFeatureNames;
  };
  const [sortedList, setSortedList] = useState<string[]>([]);
  const [listToRender, setListToRender] = useState<string[]>(colorParamList);

  useEffect(() => {
    if (sortedList.length > 0 && sortedList.length === colorParamList.length) {
      setListToRender(sortedList);
    } else {
      setListToRender(colorParamList);
    }
  }, [sortedList, colorParamList, customizations]);

  useEffect(() => {
    // Sort custom features and update sortedList
    const newSortedList = sortLogicBasedOnCustomFeatures(customizations);
    setSortedList(newSortedList);
  }, [customizations]);
  return (
    <div
      id="color-legend"
      className="block rounded-md mr-4 w-full mt-2 legend p-2"
      style={{
        background: lightMode ? "#F0F2F5" : "#101827",
        color: lightMode ? "#101827" : "#F0F2F5",
      }}
    >
      <div className="flex items-center">
        <select
          style={{ background: lightMode ? "#101827" : "#101827" }}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={colorKey as string}
          onChange={(e) => setListParam(e.target.value)}
        >
          {keyList.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option.toUpperCase()}
            </option>
          ))}
        </select>
        <div
          className="cursor-pointer pl-2"
          onClick={() => setIsEditModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
            style={{ marginTop: "-8px", color: lightMode ? "black" : "white" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
      </div>
      <div id="pngFile">
        <ul
          style={{
            maxHeight: `${window.innerHeight - 330}px`,
          }}
          className={
            closed
              ? "hidden"
              : screenshot
              ? "h-full px-3 overflow-hidden"
              : "h-full overflow-y-auto px-3 transition-all duration-300 ease-in-out"
          }
        >
          {listToRender.map((value: string, index: number) => {
            const customization = findCustomization(value);
            const displayColor =
              // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
              customization?.color || colorList[index % colorList.length];
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            const displayName = customization?.customName || value;

            return (
              <li key={value}>
                <ColorLegendItem
                  color={value === "NaN" ? "#000000" : displayColor}
                  text={displayName}
                  screenshot={screenshot}
                  selected={colorParam === "" || value === colorParam}
                  onClick={() => {
                    if (value === colorParam) {
                      setColorParam("");
                    } else {
                      setColorParam(`${value}`);
                    }
                  }}
                  lightMode={lightMode}
                />
              </li>
            );
          })}
        </ul>
      </div>
      {colorParamList.length !== 0 && (
        <EditColorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          colorParamList={listToRender}
          colorList={colorList}
          existingCustomizations={customizations}
          onSave={(newCustomizations: ParamCustomization[]) => {
            setCustomFeatures(newCustomizations as any);
            setSortedList(newCustomizations.map((c) => c.featureName));
            setIsEditModalOpen(false);
          }}
          category={colorKey as string}
        />
      )}
    </div>
  );
};

export default ColorLegend;
