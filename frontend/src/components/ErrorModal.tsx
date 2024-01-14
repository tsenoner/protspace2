import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import { setErrorMessage } from "../redux/actions/settings";

const ErrorModal: FC = () => {
  const dispatch = useAppDispatch();
  const { errorMessage } = useAppSelector((state) => state.settings);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10">
      <div className="bg-white p-8 rounded shadow-lg relative w-1/4 h-1/3">
        <h2 className="text-lg font-semibold p-4">An Error Occurred</h2>
        <p className="text-md p-4">{errorMessage}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 absolute bottom-0 right-0 mb-8 mr-8"
          onClick={() => {
            dispatch(setErrorMessage(""));
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
