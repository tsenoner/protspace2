import React, { useState } from "react";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ColorLegendItem from "../ColorLegendItem/ColorLegendItem";
import { ColorLegendProps } from "./ColorLegend.types";
import "../../styles/tailwind.css";

const ColorLegend: React.FC<ColorLegendProps> = ({
  screenshot,
  colorKey,
  colorParamList,
  colorParam,
  setColorParam,
  colorList,
}) => {
  const [closed, setClosed] = useState(false);
  console.log("colorParamList", colorParamList);
  return (
    <div className="block bg-slate-100 rounded-md mr-4 w-full mt-2">
      <div
        className="flex items-center justify-between w-80 p-4 cursor-pointer"
        onClick={() => {
          setClosed(!closed);
        }}
      >
        <p>{(colorKey ?? "").toUpperCase()}</p>
        {closed ? (
          <ArrowDownIcon
            className="w-4 cursor-pointer"
            onClick={() => {
              setClosed(!closed);
            }}
          />
        ) : (
          <XMarkIcon
            className="w-4 cursor-pointer"
            onClick={() => {
              setClosed(!closed);
            }}
          />
        )}
      </div>

      <ul
        style={{
          maxHeight: `${window.innerHeight - 330}px`,
        }}
        className={
          closed
            ? "hidden"
            : screenshot
            ? "h-full px-4 overflow-hidden"
            : "h-full overflow-y-auto px-4 transition-all duration-300 ease-in-out"
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
