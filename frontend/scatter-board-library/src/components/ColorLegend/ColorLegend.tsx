import React, { useState } from "react";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ColorLegendItem from "../ColorLegendItem/ColorLegendItem";
import { ColorLegendProps } from "./ColorLegend.types";
import "../../styles/tailwind.css";

const ColorLegend: React.FC<ColorLegendProps> = ({
  screenshot,
  colorKey,
  keyList,
  setListParam,
  colorParamList,
  colorParam,
  setColorParam,
  colorList,
}) => {
  const [closed, setClosed] = useState(false);

  return (
    <div className="block bg-slate-100 rounded-md mr-4 w-full mt-2 legend">
      <select
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
        {colorParamList
          ?.sort((a, b) => {
            if (a === "NaN") {
              return 1;
            } else if (b === "NaN") {
              return -1;
            } else {
              return a.localeCompare(b);
            }
          })
          .map((value: string, index: number) => (
            <li
              key={value}
              className="hover:shadow-md w-full overflow-x-auto cursor-pointer transition-all duration-300 ease-in-out"
            >
              <ColorLegendItem
                color={
                  value === "NaN"
                    ? "#85b0da"
                    : colorList[index % colorList.length]
                }
                text={value}
                screenshot={screenshot}
                selected={colorParam === "" || value === colorParam}
                onClick={() => {
                  if (value === colorParam) {
                    setColorParam("");
                  } else {
                    setColorParam(value);
                  }
                }}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ColorLegend;
