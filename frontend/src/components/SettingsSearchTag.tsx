import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";

interface SettingsSearchTagProps {
  text: string;
  onClick: () => void;
}

const SettingsSearchTag: React.FC<SettingsSearchTagProps> = (props) => {
  return (
    <div className="flex border-2 border-blue-200 items-center h-8 mx-0.5 whitespace-nowrap">
      <p className="text-xs m-2 w-auto">{props.text}</p>
      <div className="w-0.5 h-8 bg-blue-200" />
      <XMarkIcon className="w-4 cursor-pointer" onClick={props.onClick} />
    </div>
  );
};

export default SettingsSearchTag;
