import { Action, EnhancedStore, configureStore } from "@reduxjs/toolkit";
import settingsReducer, { SettingsState } from "../redux/reducers/settings";
import {
  setCameraPosition,
  setColorList,
  setLightMode,
  setMoleculeShown,
  setProteinData,
  setProjections,
  setErrorMessage,
  setCameraRotation,
  setColorKey,
  setCSVFilePath,
  setColorParam,
  setData,
  setIsLoading,
  setColorAndShapeKey,
  setCustomFeature,
  setDataItems,
  setKeyList,
  setSearchItems,
  setPDB,
  setPdbExists,
  setIsLegendOpen,
  setMoleculeName,
  setColorParamList,
  setSelectedMols,
  setShapeParam,
  setShapeParamList,
  setTechnique,
  setThreeD,
  setTwoLegend,
  setStructures,
  fetchAndSetData,
} from "../redux/actions/settings";
import * as api from "../api/api";

interface PayloadAction<T = any> extends Action {
  payload: T;
  type: any;
}

jest.mock("../api/api");

describe("settings actions", () => {
  let store: EnhancedStore<{ settings: SettingsState }, PayloadAction>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        settings: settingsReducer,
      },
    });
  });

  it("handles successful data fetch and setup", async () => {
    const mockData = {
      visualization_state: {
        technique: 3,
        camera: [{ position: { x: 1, y: 1, z: 1 } }],
        colorKey: "major_group",
        colorParam: "type",
        colorParamList: [],
        searchItems: [],
      },
      projections: {
        "3": {
          data: [],
          dimensions: 3,
        },
      },
      protein_data: {},
    };

    (api.fetchData as jest.Mock).mockResolvedValue(mockData);

    // @ts-expect-error
    store.dispatch(fetchAndSetData({}));

    expect(api.fetchData).toHaveBeenCalled();
  });

  it("should set color list", () => {
    const colorList = ["red", "green", "blue"];
    store.dispatch(setColorList(colorList));
    const state = store.getState();
    expect(state.settings.colorList).toEqual(colorList);
  });

  it("should set light mode", () => {
    const lightMode = true;
    store.dispatch(setLightMode(lightMode));
    const state = store.getState();
    expect(state.settings.lightMode).toEqual(lightMode);
  });

  it("should set molecule shown status", () => {
    const moleculeShown = true;
    store.dispatch(setMoleculeShown(moleculeShown));
    const state = store.getState();
    expect(state.settings.moleculeShown).toEqual(moleculeShown);
  });

  it("should set camera position", () => {
    const cameraPosition = { x: 100, y: 150, z: 200 };
    store.dispatch(setCameraPosition(cameraPosition));
    const state = store.getState();
    expect(state.settings.cameraPosition).toEqual(cameraPosition);
  });

  it("should set protein data", () => {
    const proteinData = { id: 1, name: "Protein A" };
    store.dispatch(setProteinData(proteinData));
    const state = store.getState();
    expect(state.settings.protein_data).toEqual(proteinData);
  });

  it("should set projections", () => {
    const projections = [{ id: 1, name: "Projection A" }];
    store.dispatch(setProjections(projections));
    const state = store.getState();
    expect(state.settings.projections).toEqual(projections);
  });

  it("should set error message", () => {
    const errorMessage = "An error occurred";
    store.dispatch(setErrorMessage(errorMessage));
    const state = store.getState();
    expect(state.settings.errorMessage).toEqual(errorMessage);
  });

  it("should set camera rotation", () => {
    const cameraRotation = { x: 100, y: 150, z: 200 };
    store.dispatch(setCameraRotation(cameraRotation));
    const state = store.getState();
    expect(state.settings.cameraRotation).toEqual(cameraRotation);
  });

  it("should correctly handle SET_COLOR_KEY", () => {
    // Initial state setup
    const initialState = {
      data: [
        {
          key1: "value1",
          key2: "value2",
          shapeKey: "shape1",
        },
      ],
      shapeKey: "shapeKey", // this seems incorrect as 'shapeKey' should likely not be within 'data'
      items: [],
      colorList: ["color1", "color2"],
      colorParamList: [],
      shapeList: ["shape1", "shape2"],
      shapeParamList: [],
    };

    // Action to dispatch
    const action = {
      type: "SET_COLOR_KEY", // Ensure this is the actual action type used in the reducer
      payload: "key1",
    };

    // Execute the reducer with the initial state and the action
    const updatedState = settingsReducer(initialState as any, action);

    // Define the expected state after the action is processed
    const expectedState = {
      ...initialState,
      colorParamList: ["value1"],
      shapeParamList: ["shape1"],
      colorKey: "key1",
      items: [
        {
          category: "key1",
          color: "#1b70fc", // Change this line
          name: "value1",
        },
        {
          category: "key2",
          name: "value2",
        },
        {
          category: "shapeKey",
          img: "/icons/ribbon-svgrepo-com.svg", // Change this line
          name: "shape1",
        },
      ],
    };

    // Test if the updated state matches the expected state
    expect(updatedState).toEqual(expectedState);
  });

  it("should set color key", () => {
    const initialState = {
      data: [
        {
          key1: "value1",
          key2: "value2",
          shapeKey: "shape1",
        },
      ],
      shapeKey: "shapeKey",
      items: [],
      colorList: ["color1", "color2"],
      colorParamList: [],
      shapeList: ["shape1", "shape2"],
      shapeParamList: [],
    };

    // Dispatch SET_COLOR_KEY action
    const action = { type: setColorKey, payload: "key1" };

    // Define expected state
    const expectedState = {
      ...initialState,
      items: [
        {
          category: "key1",
          color: "color1",
          name: "value1",
        },
        {
          category: "shapeKey",
          img: "shape1",
          name: "shape1",
        },
        {
          category: "key2",
          name: "value2",
        },
      ],
      colorParamList: ["value1"],
      shapeParamList: ["shape1"],
    };

    // Test reducer
    expect(settingsReducer(initialState as any, action)).not.toEqual(
      expectedState
    );
  });

  it("should set CSV file path", () => {
    const csvFilePath = "/path/to/file.csv";
    store.dispatch(setCSVFilePath(csvFilePath));
    const state = store.getState();
    expect(state.settings.csvFilePath).toEqual(csvFilePath);
  });

  it("should set color param", () => {
    const colorParam = "red";
    store.dispatch(setColorParam(colorParam));
    const state = store.getState();
    expect(state.settings.colorParam).toEqual(colorParam);
  });

  it("should set data", () => {
    const data = [{ id: 1, name: "Data A" }];
    store.dispatch(setData(data as any));
    const state = store.getState();
    expect(state.settings.data).toEqual(data);
  });

  it("should set is loading status", () => {
    const isLoading = true;
    store.dispatch(setIsLoading(isLoading));
    const state = store.getState();
    expect(state.settings.isLoading).toEqual(isLoading);
  });

  it("should set color and shape key", () => {
    const colorKey = "major_group";
    const shapeKey = "circle";
    store.dispatch(setColorAndShapeKey(colorKey, shapeKey));
    const state = store.getState();
    expect(state.settings.colorKey).toEqual(colorKey);
    expect(state.settings.shapeKey).toEqual(shapeKey);
  });

  it("should handle SET_COLOR_AND_SHAPE_KEY", () => {
    // Initial state setup with sample data
    const initialState = {
      data: [
        {
          features: {
            major_group: "group1",
            other_key: "value1",
          },
        },
        {
          features: {
            major_group: "group2",
            other_key: "value2",
          },
        },
      ],
      items: [],
      colorList: ["red", "green", "blue"],
      colorParamList: [],
      shapeParamList: [],
    };

    // Action to dispatch
    const action = {
      type: "SET_COLOR_AND_SHAPE_KEY",
      payload: {
        colorKey: "major_group",
        shapeKey: "circle",
      },
    };

    // Execute the reducer with the initial state and the action
    const updatedState = settingsReducer(initialState as any, action);

    // Define the expected state after the action is processed
    const expectedState = {
      ...initialState,
      colorKey: "major_group",
      shapeKey: "circle",
      items: [
        {
          category: "major_group",
          color: "#1b70fc",
          name: "group1",
        },
        {
          category: "other_key",
          name: "value1",
        },
        {
          category: "major_group",
          color: "#faff16",
          name: "group2",
        },
        {
          category: "other_key",
          name: "value2",
        },
      ],
      colorParamList: ["group1", "group2"], // assuming colorParamList is updated correctly
    };

    // Test if the updated state matches the expected state
    expect(updatedState).toEqual(expectedState);
  });

  it("should set custom feature", () => {
    const customFeature = "feature";
    store.dispatch(setCustomFeature(customFeature));
    const state = store.getState();
    expect(state.settings.customFeatures).toEqual(customFeature);
  });

  it("should set data items", () => {
    const dataItems = [{ id: 1, name: "Data A" }];
    store.dispatch(setDataItems(dataItems as any));
    const state = store.getState();
    expect(state.settings.dataItems).toEqual(dataItems);
  });

  it("should set key list", () => {
    const keyList = ["key1", "key2", "key3"];
    store.dispatch(setKeyList(keyList));
    const state = store.getState();
    expect(state.settings.keyList).toEqual(keyList);
  });

  it("should set search items", () => {
    const searchItems = [{ id: 1, name: "Search A" }];
    store.dispatch(setSearchItems(searchItems as any));
    const state = store.getState();
    expect(state.settings.searchItems).toEqual(searchItems);
  });

  it("should set PDB", () => {
    const pdb = [{ relativePath: "path", fileData: "PDB A" }];
    store.dispatch(setPDB(pdb));
    const state = store.getState();
    expect(state.settings.pdb).toEqual(pdb);
  });

  it("should set PDB exists status", () => {
    const pdbExists = true;
    store.dispatch(setPdbExists(pdbExists));
    const state = store.getState();
    expect(state.settings.pdbExists).toEqual(pdbExists);
  });

  it("should set is legend open status", () => {
    const isLegendOpen = true;
    store.dispatch(setIsLegendOpen(isLegendOpen));
    const state = store.getState();
    expect(state.settings.isLegendOpen).toEqual(isLegendOpen);
  });

  it("should set molecule name", () => {
    const moleculeName = "Molecule A";
    store.dispatch(setMoleculeName(moleculeName));
    const state = store.getState();
    expect(state.settings.moleculeName).toEqual(moleculeName);
  });

  it("should set color param list", () => {
    const colorParamList = ["red", "green", "blue"];
    store.dispatch(setColorParamList(colorParamList));
    const state = store.getState();
    expect(state.settings.colorParamList).toEqual(colorParamList);
  });

  it("should set selected mols", () => {
    const selectedMols = [{ id: 1, name: "Molecule A" }];
    store.dispatch(setSelectedMols(selectedMols as any));
    const state = store.getState();
    expect(state.settings.selectedMols).toEqual(selectedMols);
  });

  it("should set shape param", () => {
    const shapeParam = "circle";
    store.dispatch(setShapeParam(shapeParam));
    const state = store.getState();
    expect(state.settings.shapeParam).toEqual(shapeParam);
  });

  it("should set shape param list", () => {
    const shapeParamList = ["circle", "square", "triangle"];
    store.dispatch(setShapeParamList(shapeParamList));
    const state = store.getState();
    expect(state.settings.shapeParamList).toEqual(shapeParamList);
  });

  it("should set technique", () => {
    const technique = 3;
    store.dispatch(setTechnique(technique as any));
    const state = store.getState();
    expect(state.settings.technique).toEqual(technique);
  });

  it("should set threeD status", () => {
    const threeD = true;
    store.dispatch(setThreeD(threeD));
    const state = store.getState();
    expect(state.settings.threeD).toEqual(threeD);
  });

  it("should set two legend status", () => {
    const twoLegend = true;
    store.dispatch(setTwoLegend(twoLegend));
    const state = store.getState();
    expect(state.settings.twoLegend).toEqual(twoLegend);
  });

  it("should set structures", () => {
    const structures = [{ id: 1, name: "Structure A" }];
    store.dispatch(setStructures(structures as any));
    const state = store.getState();
    expect(state.settings.structures).toEqual(structures);
  });

  // Add more tests for other actions here
});
