import { Button } from "@chakra-ui/react";
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

  return (
    <div className={fileUploadShown ? "flex" : "hidden"}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto max-h-[80%]">
          <div className="modal-content py-4 text-left px-6">
            {/* Modal header */}
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold">File Settings</p>
              <button
                className="modal-close cursor-pointer z-50"
                onClick={() => setFileUploadShown(false)}
              >
                <XMarkIcon className="w-4" />
              </button>
            </div>
            <div className="mt-2">
              <div>
                <p className="text-gray-700 text-sm font-bold">
                  Projection Name:{" "}
                  {Object.keys(projections).length !== 0
                    ? projections[technique].name
                    : " -"}
                </p>
                <p className="text-gray-700 text-sm font-bold">
                  Dimension:
                  {Object.keys(projections).length !== 0
                    ? projections[technique].dimensions
                    : " -"}
                </p>
                <label
                  htmlFor="techniques"
                  className="text-gray-700 text-sm font-bold"
                >
                  Projections
                </label>

                {Object.keys(projections).length === 0 ? (
                  <div> No projections available </div>
                ) : (
                  <select
                    onChange={handleTechniqueChange}
                    id="techniques"
                    className="mt-2 min-w-100 bg-transparent"
                    value={technique && technique}
                  >
                    {projections.map(
                      (
                        projection: any,
                        index: React.Key | number | null | undefined
                      ) => (
                        <option key={index} value={index as string}>
                          {projection && projection.name.toUpperCase()}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  className="mt-4"
                  colorScheme="blue"
                  onClick={() => {
                    dispatch(setTechnique(technique));
                    setFileUploadShown(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
