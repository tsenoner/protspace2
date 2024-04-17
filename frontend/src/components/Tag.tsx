import { XMarkIcon } from "@heroicons/react/24/solid";
import { MouseEvent } from "react";
import { colorList } from "../helpers/constants";

interface TagProps {
  role?: string;
  text: string;
  onClick: () => void;
  index: number;
}

function Tag({ role, text, onClick, index }: TagProps) {
  const color = colorList[index % colorList.length];

  const handleTagClick = (event: MouseEvent) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <div
      role={role}
      className="badge badge-info gap-2 m-1 w-32 p-1 h-6 cursor-pointer"
      style={{
        backgroundColor: color,
      }}
      onClick={handleTagClick}
    >
      <p
        className="w-28 text-xs p-1"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </p>
      <XMarkIcon className="w-4" />
    </div>
  );
}

export default Tag;
