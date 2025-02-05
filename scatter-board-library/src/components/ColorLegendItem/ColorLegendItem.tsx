import React from "react";
import { ColorLegendItemProps } from "./ColorLegendItem.types";
import "../../styles/tailwind.css";

const ColorLegendItem: React.FC<ColorLegendItemProps> = ({
  color,
  selected,
  screenshot,
  text,
  onClick,
  onDoubleClick,
  lightMode,
}) => {
  const textColor = lightMode ? "black" : "white";
  return (
    <div>
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className="flex gap-x-2 min-h-custom selection:border-r-1 items-center cursor-pointer"
      >
        <div
          className={`w-4 h-4 rounded-full`}
          style={{
            backgroundColor: color,
          }}
        />
        <p
          style={{ color: screenshot ? "black" : textColor }}
          className={`${
            selected ? "text-black" : "text-black line-through opacity-50"
          } w-60 break-all`}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default ColorLegendItem;
