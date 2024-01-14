import React, { ReactElement } from "react";

interface HelpItemProps {
  component: ReactElement;
  explanation: string;
}

const HelpItem: React.FC<HelpItemProps> = ({ component, explanation }) => {
  return (
    <div className="flex flex-row items-center m-2">
      <div className="md:w-36 sm:w-24 w-20">{component}</div>
      <p className="ml-4 overflow-hidden overflow-ellipsis w-[70%] md:w-[80%] text-sm md:text-base text-justify">
        {explanation}
      </p>
    </div>
  );
};

export default HelpItem;
