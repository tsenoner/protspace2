import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import { setTechnique } from "../redux/actions/settings";

export function FileUploadFormModal({
  fileUploadShown,
  setFileUploadShown,
}: any) {
  const dispatch = useAppDispatch();
  const { technique, projections } = useAppSelector((state) => state.settings);

  const [selectedTechnique, setSelectedTechnique] = useState(technique);

  useEffect(() => {
    setSelectedTechnique(technique);
  }, [technique, fileUploadShown]);

  const handleTechniqueChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTechnique(event.target.value);
  };

  const handleSave = () => {
    dispatch(setTechnique(selectedTechnique));
    setFileUploadShown(false);
  };

  if (!fileUploadShown) {
    return null;
  }

  return (
    <div className={fileUploadShown ? "flex" : "hidden"}>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto max-h-[90%] p-6">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-2xl font-bold text-gray-800">File Settings</h2>
            <button
              aria-label="Close"
              className="modal-close cursor-pointer rounded-full p-2 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setFileUploadShown(false)}
            >
              <XMarkIcon className="text-gray-700 w-6 h-6" />
            </button>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Projection Information
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Projection Name: </strong>
              {Object.keys(projections).length !== 0
                ? projections[selectedTechnique].name
                : " -"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Dimension: </strong>
              {Object.keys(projections).length !== 0
                ? projections[selectedTechnique].dimensions
                : " -"}
            </p>
            <label
              htmlFor="techniques"
              className="block text-sm font-bold text-gray-700 mt-4"
            >
              Select Projection
            </label>
            {Object.keys(projections).length === 0 ? (
              <div className="text-sm text-gray-700 py-2">
                No projections available
              </div>
            ) : (
              <select
                onChange={handleTechniqueChange}
                id="techniques"
                className="w-full text-black px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={selectedTechnique}
              >
                {projections.map(
                  (projection: any, index: React.Key | null | undefined) => (
                    <option key={index} value={index as string}>
                      {projection.name.toUpperCase()}
                    </option>
                  )
                )}
              </select>
            )}

            {projections[selectedTechnique]?.info &&
              Object.keys(projections[selectedTechnique].info).length > 0 && (
                <div className="mt-3 bg-white p-2 shadow rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-1">
                    Projection Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(projections[selectedTechnique].info).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center space-x-1">
                          <span className="flex-shrink-0 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center">
                            {/* Icon updated for size */}
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <circle cx="12" cy="12" r="9" stroke-width="2" />
                              <path
                                d="M12 16v-4"
                                stroke-width="2"
                                stroke-linecap="round"
                              />
                              <circle
                                cx="12"
                                cy="8"
                                r="1"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900">
                              {key}
                            </p>
                            <p className="text-xs text-gray-700">
                              {value as any}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
