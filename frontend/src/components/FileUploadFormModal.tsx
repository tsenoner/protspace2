import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import { setTechnique } from "../redux/actions/settings";

export function FileUploadFormModal({
  fileUploadShown,
  setFileUploadShown,
}: any) {
  const dispatch = useAppDispatch();
  const { technique, projections } = useAppSelector((state) => state.settings);

  const handleTechniqueChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(setTechnique(event.target.value));
  };

  if (!fileUploadShown) {
    return null;
  }

  return (
    <div className={fileUploadShown ? "flex" : "hidden"}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto max-h-[80%]">
          <div className="modal-content px-6 py-4">
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold text-gray-700">File Settings</p>
              <button
                aria-label="Close"
                className="modal-close cursor-pointer z-50 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={() => setFileUploadShown(false)}
              >
                <XMarkIcon className="text-gray-700 w-6 h-6" />
              </button>
            </div>
            <div className="mt-4">
              <div className="mb-4">
                <p className="mb-1 text-sm font-bold text-gray-700">
                  Projection Name:{" "}
                  {Object.keys(projections).length !== 0
                    ? projections[technique].name
                    : " -"}
                </p>
                <p className="mb-2 text-sm font-bold text-gray-700">
                  Dimension:{" "}
                  {Object.keys(projections).length !== 0
                    ? projections[technique].dimensions
                    : " -"}
                </p>
                <label
                  htmlFor="techniques"
                  className="block mb-1 text-sm font-bold text-gray-700"
                >
                  Projections
                </label>
                {Object.keys(projections).length === 0 ? (
                  <div className="text-sm text-gray-700">
                    No projections available
                  </div>
                ) : (
                  <select
                    onChange={handleTechniqueChange}
                    id="techniques"
                    className="w-full px-3 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={technique}
                  >
                    {projections.map(
                      (
                        projection: any,
                        index: React.Key | null | undefined
                      ) => (
                        <option key={index} value={index as string}>
                          {projection.name.toUpperCase()}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    dispatch(setTechnique(technique));
                    setFileUploadShown(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
