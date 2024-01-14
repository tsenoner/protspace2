import React from "react";
import { ColorLegendItemProps } from "./ColorLegendItem.types";
import "../../styles/tailwind.css";

const ColorLegendItem: React.FC<ColorLegendItemProps> = ({
  color,
  selected,
  screenshot,
  text,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex gap-x-2 min-h-custom selection:border-r-1 items-center cursor-pointer"
    >
      <div
        className={`w-4 h-4 rounded-full`}
        style={{
          backgroundColor: color,
        }}
      />
      <p
        className={`${
          selected
            ? "text-black"
            : screenshot
            ? "text-gray-500"
            : "text-gray-500 line-through"
        } w-60 break-all`}
      >
        {text}
      </p>
    </div>
  );
};

export default ColorLegendItem;
