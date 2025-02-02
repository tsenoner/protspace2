import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../helpers/hooks';
import {
  setCameraPosition,
  setCameraRotation,
  setColorParam,
  setCustomFeature,
  setTechnique
} from '../../redux/actions/settings';

export function FileUploadFormModal({ fileUploadShown, setFileUploadShown }: any) {
  const dispatch = useAppDispatch();
  const { technique, projections, states } = useAppSelector((state) => state.settings);

  const [selectedTechnique, setSelectedTechnique] = useState(technique);
  const [selectedState, setSelectedState] = useState<any>(null);

  useEffect(() => {
    setSelectedTechnique(technique);
  }, [technique, fileUploadShown]);

  const handleTechniqueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTechnique(event.target.value);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const stateIndex = event.target.value;
    const selectedState = states[stateIndex];

    if (selectedState) {
      dispatch(setCameraPosition(selectedState.cameraPosition));
      dispatch(setCameraRotation(selectedState.cameraRotation));
      dispatch(setCustomFeature(selectedState.customFeatures));
      dispatch(setTechnique(selectedState.technique));
      dispatch(setColorParam(selectedState.colorParam));

      setSelectedState(selectedState);
    }
    setFileUploadShown(false);
  };

  const handleSave = () => {
    dispatch(setTechnique(selectedTechnique));
    setFileUploadShown(false);
  };

  if (!fileUploadShown) {
    return null;
  }

  return (
    <div className={fileUploadShown ? 'flex' : 'hidden'}>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto max-h-[90%] p-6">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Projection Settings</h2>
            <button
              aria-label="Close"
              className="modal-close cursor-pointer rounded-full p-2 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setFileUploadShown(false)}>
              <XMarkIcon className="text-gray-700 w-6 h-6" />
            </button>
          </div>

          {/* Projection Information */}
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-gray-700">Projection Information</h3>
            <p className="text-sm text-gray-600">
              <strong>Projection Name: </strong>
              {Object.keys(projections).length !== 0 ? projections[selectedTechnique]?.name : ' -'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Dimension: </strong>
              {Object.keys(projections).length !== 0
                ? projections[selectedTechnique]?.dimensions
                : ' -'}
            </p>

            <label htmlFor="techniques" className="block text-sm font-bold text-gray-700 mt-4">
              Select Projection
            </label>
            {Object.keys(projections).length === 0 ? (
              <div className="text-sm text-gray-700 py-2">No projections available</div>
            ) : (
              <select
                onChange={handleTechniqueChange}
                id="techniques"
                className="w-full text-black px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={selectedTechnique}>
                {projections.map((projection: any, index: React.Key | null | undefined) => (
                  <option key={index} value={index as string}>
                    {projection.name.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* States Section */}
          <label htmlFor="states" className="block text-sm font-bold text-gray-700 mt-4">
            States
          </label>
          {states.length === 0 ? (
            <div className="text-sm text-gray-700 py-2">No state available</div>
          ) : (
            <select
              onChange={handleStateChange}
              id="states"
              className="w-full text-black px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={selectedState ? states.indexOf(selectedState) : ''}>
              {states.map((state: any, index: React.Key | null | undefined) => (
                <option key={index} value={index as string}>
                  {state.name.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          <div className="flex justify-end mt-6">
            <button
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUploadFormModal;
