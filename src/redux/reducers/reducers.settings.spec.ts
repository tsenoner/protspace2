import settingsReducer, { SettingsState } from './settings';
import * as actionTypes from '../actionTypes';
import '@testing-library/jest-dom';

function getDefaultState(): SettingsState {
  // @ts-expect-error missing properties
  return {
    lightMode: false,
    colorKey: '',
    shapeKey: '',
    twoLegend: false,
    technique: 0,
    threeD: false,
    searchItems: [],
    colorParam: '',
    shapeParam: '',
    moleculeShown: false,
    colorList: [],
    data: [],
    shapeParamList: [],
    colorParamList: [],
    csvFilePath: '',
    dataItems: [],
    keyList: [],
    isLegendOpen: false,
    errorMessage: '',
    pdbExists: false,
    moleculeName: '',
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
    items: []
  };
}

describe('settingsReducer', () => {
  it('should handle SET_ERROR_MESSAGE', () => {
    const initialState = getDefaultState();

    const action = {
      type: actionTypes.SET_ERROR_MESSAGE,
      payload: 'Error occurred'
    };

    const expectedState = {
      ...initialState,
      errorMessage: 'Error occurred'
    };

    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_IS_LOADING', () => {
    const initialState = getDefaultState();

    const action = {
      type: actionTypes.SET_IS_LOADING,
      payload: true
    };

    const expectedState = {
      ...initialState,
      isLoading: true
    };

    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  describe('settingsReducer', () => {
    it('should handle SET_ERROR_MESSAGE', () => {
      const initialState = getDefaultState();

      const action = {
        type: actionTypes.SET_ERROR_MESSAGE,
        payload: 'Error occurred'
      };

      const expectedState = {
        ...initialState,
        errorMessage: 'Error occurred'
      };

      expect(settingsReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle SET_IS_LOADING', () => {
      const initialState = getDefaultState();

      const action = {
        type: actionTypes.SET_IS_LOADING,
        payload: true
      };

      const expectedState = {
        ...initialState,
        isLoading: true
      };

      expect(settingsReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle SET_COLOR_KEY', () => {
      const initialState = getDefaultState();

      const action = {
        type: actionTypes.SET_COLOR_KEY,
        payload: 'protein'
      };

      const expectedState = {
        ...initialState,
        colorKey: 'protein'
      };

      expect(settingsReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle SET_COLOR_PARAM_LIST', () => {
      const initialState = getDefaultState();

      const action = {
        type: actionTypes.SET_COLOR_PARAM_LIST,
        payload: ['red', 'blue', 'green']
      };

      const expectedState = {
        ...initialState,
        colorParamList: ['red', 'blue', 'green']
      };

      expect(settingsReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle SET_CAMERA_POSITION', () => {
      const initialState = getDefaultState();

      const action = {
        type: actionTypes.SET_CAMERA_POSITION,
        payload: { x: 10, y: 20, z: 30 }
      };

      const expectedState = {
        ...initialState,
        cameraPosition: { x: 10, y: 20, z: 30 }
      };

      expect(settingsReducer(initialState, action)).toEqual(expectedState);
    });
  });
});

describe('settingsReducer', () => {
  let initialState: SettingsState | undefined;

  beforeEach(() => {
    initialState = getDefaultState();
  });

  it('should handle SET_ERROR_MESSAGE', () => {
    const action = {
      type: actionTypes.SET_ERROR_MESSAGE,
      payload: 'Error occurred'
    };
    const expectedState = { ...initialState, errorMessage: 'Error occurred' };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_IS_LOADING', () => {
    const action = { type: actionTypes.SET_IS_LOADING, payload: true };
    const expectedState = { ...initialState, isLoading: true };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_COLOR_KEY', () => {
    const action = { type: actionTypes.SET_COLOR_KEY, payload: 'protein' };
    const expectedState = { ...initialState, colorKey: 'protein' };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_COLOR_PARAM_LIST', () => {
    const action = {
      type: actionTypes.SET_COLOR_PARAM_LIST,
      payload: ['red', 'blue', 'green']
    };
    const expectedState = {
      ...initialState,
      colorParamList: ['red', 'blue', 'green']
    };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_CAMERA_POSITION', () => {
    const action = {
      type: actionTypes.SET_CAMERA_POSITION,
      payload: { x: 10, y: 20, z: 30 }
    };
    const expectedState = {
      ...initialState,
      cameraPosition: { x: 10, y: 20, z: 30 }
    };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_PDB_EXISTS', () => {
    const action = { type: actionTypes.SET_PDB_EXISTS, payload: true };
    const expectedState = { ...initialState, pdbExists: true };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_PROJECTIONS', () => {
    const newProjections = { '1': { name: 'Projection 1', data: [] } };
    const action = {
      type: actionTypes.SET_PROJECTIONS,
      payload: newProjections
    };
    const expectedState = { ...initialState, projections: newProjections };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_SELECTED_MOLS', () => {
    const mols = ['mol1', 'mol2'];
    const action = { type: actionTypes.SET_SELECTED_MOLS, payload: mols };
    const expectedState = { ...initialState, selectedMols: mols };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_LIGHT_MODE', () => {
    const action = { type: actionTypes.SET_LIGHT_MODE, payload: true };
    const expectedState = { ...initialState, lightMode: true };
    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });

  // More test cases can be added to cover every action that modifies the state
});
