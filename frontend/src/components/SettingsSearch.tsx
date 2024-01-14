import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SettingsSearchTag from "./SettingsSearchTag";
import { AtomStyleSpec } from "../data";
import { useDispatch, useSelector } from "react-redux";

const moleculeRepresentations = ["cartoon"];
import {
  addToSearchAtomStyle,
  removeFromSearchAtomStyle,
} from "../redux/actions/settings";

const SettingsSearch: React.FC = () => {
  const searchAtomStyle = useSelector(
    (state: any) => state.settings.searchAtomStyle
  );

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchListOpen, setSearchListOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSearchListOpen(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleMoleculeRepresentationClick = (item: keyof AtomStyleSpec) => {
    setSearchListOpen(false);
    setSearchTerm("");

    if (!(item in searchAtomStyle)) {
      dispatch(addToSearchAtomStyle(item));
    }
  };

  return (
    <div>
      <div className="relative flex w-full px-4 py-2 bg-gray-100">
        <div className="flex w-full overflow-x-scroll">
          {Object.keys(searchAtomStyle ?? []).map(
            (item: string, index: number) => (
              <SettingsSearchTag
                key={index}
                text={item}
                onClick={() => {
                  dispatch(
                    removeFromSearchAtomStyle(item as keyof AtomStyleSpec)
                  );
                }}
              />
            )
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="text-sm focus:outline-none w-36 bg-transparent pr-10 rounded-lg"
          />
        </div>
        <div className="absolute right-0 top-0 h-full flex z-10 mx-1">
          {searchTerm && (
            <XMarkIcon
              className="w-4 cursor-pointer"
              onClick={handleClearSearch}
            />
          )}
          {searchListOpen ? (
            <ChevronUpIcon
              onClick={() => setSearchListOpen(false)}
              className="w-4 cursor-pointer"
            />
          ) : (
            <ChevronDownIcon
              onClick={() => setSearchListOpen(true)}
              className="w-4 cursor-pointer"
            />
          )}
        </div>
      </div>

      {searchListOpen && (
        <div className="absolute z-10 max-h-40 bg-white shadow-lg overflow-y-auto w-40">
          {moleculeRepresentations
            .filter((item) => !(item in searchAtomStyle))
            .filter((item) =>
              item.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item, index) => (
              <p
                onClick={() =>
                  handleMoleculeRepresentationClick(item as keyof AtomStyleSpec)
                }
                className="m-2 hover:shadow-sm cursor-pointer"
                key={index}
              >
                {item}
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

export default SettingsSearch;
