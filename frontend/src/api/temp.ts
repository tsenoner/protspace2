import settingsReducer, { SettingsState } from "../redux/reducers/settings";
import * as actionTypes from "../redux/actionTypes";

function getDefaultState(): SettingsState {
  return {
    lightMode: false,
    colorKey: "",
    shapeKey: "",
    twoLegend: false,
    technique: 0,
    threeD: false,
    atomStyle: {}, // Simplified for example; replace with actual initial state
    searchAtomStyle: {}, // Simplified for example
    searchItems: [],
    colorParam: "",
    shapeParam: "",
    moleculeShown: false,
    colorList: [],
    data: [],
    shapeParamList: [],
    colorParamList: [],
    csvFilePath: "",
    dataItems: [],
    keyList: [],
    isLegendOpen: false,
    errorMessage: "",
    pdbExists: false,
    moleculeName: "",
    selectedMols: [],
    cameraPosition: null,
    cameraRotation: null,
    isLoading: false,
    pdb: [],
    default_color_scheme: [],
    camera: [],
    legend: {},
    highlighting: {},
    projections: {},
    structures: {},
    protein_data: {},
    customFeatures: [],
  };
}

describe("settingsReducer", () => {
  it("should handle SET_ERROR_MESSAGE", () => {
    const initialState = getDefaultState();

    const action = {
      type: actionTypes.SET_ERROR_MESSAGE,
      payload: "Error occurred",
    };

    const expectedState = {
      ...initialState,
      errorMessage: "Error occurred",
    };

    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle SET_IS_LOADING", () => {
    const initialState = getDefaultState();

    const action = {
      type: actionTypes.SET_IS_LOADING,
      payload: true,
    };

    const expectedState = {
      ...initialState,
      isLoading: true,
    };

    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  // Add more tests for other actions as needed...
});
