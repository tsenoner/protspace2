import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import { setErrorMessage } from "../redux/actions/settings";
import { useNavigate } from "react-router-dom";

const ErrorModal: FC = () => {
  const dispatch = useAppDispatch();
  const { errorMessage } = useAppSelector((state) => state.settings);
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Error</h2>
          <p className="text-md text-gray-600">{errorMessage}</p>
          <p className="text-md text-gray-600">
            Please check our guideline{" "}
            <a href="/guideline">
              <strong>
                <u>here</u>.
              </strong>
            </a>
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={() => {
              dispatch(setErrorMessage(""));
              navigate(0);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
