import { XMarkIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import { setStates } from "../redux/actions/settings";

export function StatesModal({
  showStatesModal,
  setShowStatesModal,
  cameraRef,
}: any) {
  const dispatch = useAppDispatch();

  const {
    states,
    customFeatures,
    technique,
    colorParam,
    colorParamList,
    dataItems,
  } = useAppSelector((state) => state.settings);

  const [newStateName, setNewStateName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddState = () => {
    if (newStateName.trim() === "") {
      setErrorMessage("State name can not be empty.");
      return;
    }

    if (states.length >= 5) {
      setErrorMessage("You can not have more than 5 states.");
      return;
    }

    const newState = {
      name: newStateName,
      customFeatures,
      cameraPosition: {
        x: cameraRef.current.position.x,
        y: cameraRef.current.position.y,
        z: cameraRef.current.position.z,
      },
      cameraRotation: {
        x: cameraRef.current.rotation.x,
        y: cameraRef.current.rotation.y,
        z: cameraRef.current.rotation.z,
      },
      technique,
      colorParam,
      colorParamList,
      dataItems,
    };

    const updatedStates = [...states, newState];
    dispatch(setStates(updatedStates));

    setNewStateName("");
    setErrorMessage("");
  };

  const handleDeleteState = (index: number) => {
    const updatedStates = states.filter((_: any, i: number) => i !== index);

    dispatch(setStates(updatedStates));
  };

  const handleStateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStateName(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  if (!showStatesModal) {
    return null;
  }

  return (
    <div className={showStatesModal ? "flex" : "hidden"}>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto max-h-[90%] p-6">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              States Settings
            </h2>
            <button
              aria-label="Close"
              className="modal-close cursor-pointer rounded-full p-2 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setShowStatesModal(false)}
            >
              <XMarkIcon className="text-gray-700 w-6 h-6" />
            </button>
          </div>

          <div className="mt-4">
            <label
              htmlFor="newStateName"
              className="block text-sm font-bold text-gray-700"
            >
              Add New State
            </label>
            <div className="flex mt-2">
              <input
                type="text"
                id="newStateName"
                value={newStateName}
                onChange={handleStateNameChange}
                className="w-full text-black px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter state name"
              />
              <button
                className="ml-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md"
                onClick={handleAddState}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>

          <label className="block text-sm font-bold text-gray-700 mt-4">
            Existing States
          </label>
          <div className="mt-2">
            {states.length === 0 ? (
              <div className="text-sm text-gray-700 py-2">
                No states available.
              </div>
            ) : (
              <ul className="space-y-2">
                {states.map((state: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
                  >
                    <span className="text-gray-800">{state.name}</span>
                    <button
                      className="ml-2 px-2 py-1 text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteState(index)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowStatesModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
