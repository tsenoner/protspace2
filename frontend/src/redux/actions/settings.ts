import { Action, ThunkDispatch, createAsyncThunk } from "@reduxjs/toolkit";
import { Vector3 } from "three";
import { fetchData } from "../../api/api";
import { Item } from "../../data";
import { colorList } from "../../helpers/constants";
import {
  SET_CAMERA_POSITION,
  SET_CAMERA_ROTATION,
  SET_COLOR_AND_SHAPE_KEY,
  SET_COLOR_KEY,
  SET_COLOR_LIST,
  SET_COLOR_PARAM,
  SET_COLOR_PARAM_LIST,
  SET_CSV_FILE_PATH,
  SET_CUSTOM_FEATURE,
  SET_DATA,
  SET_DATA_ITEMS,
  SET_ERROR_MESSAGE,
  SET_IS_LEGEND_OPEN,
  SET_IS_LOADING,
  SET_KEY_LIST,
  SET_LIGHT_MODE,
  SET_MOLECULE_NAME,
  SET_MOLECULE_SHOWN,
  SET_PDB,
  SET_PDB_EXISTS,
  SET_PROJECTIONS,
  SET_PROTEIN_DATA,
  SET_SEARCH_ITEMS,
  SET_SELECTED_MOLS,
  SET_SHAPE_PARAM,
  SET_SHAPE_PARAM_LIST,
  SET_STRUCTURES,
  SET_TECHNIQUE,
  SET_THREE_D,
  SET_TWO_LEGEND,
} from "../actionTypes";
import { SettingsState } from "../reducers/settings";
import { RootState } from "../store";

export function setColorList(colorList: any) {
  return { type: SET_COLOR_LIST, payload: colorList };
}

export function setColorKey(colorKey: string) {
  return { type: SET_COLOR_KEY, payload: colorKey };
}

export function setColorParam(colorParam: string) {
  return { type: SET_COLOR_PARAM, payload: colorParam };
}

export function setSelectedMols(selectedMols: string[]) {
  return { type: SET_SELECTED_MOLS, payload: selectedMols };
}

export function setShapeParam(shapeParam: string) {
  return { type: SET_SHAPE_PARAM, payload: shapeParam };
}

export function setTwoLegend(is2Legend: boolean) {
  return { type: SET_TWO_LEGEND, payload: is2Legend };
}

export function setPdbExists(pdbExists: boolean) {
  return { type: SET_PDB_EXISTS, payload: pdbExists };
}

export function setKeyList(keyList: string[]) {
  return { type: SET_KEY_LIST, payload: keyList };
}

export function setTechnique(technique: string) {
  return { type: SET_TECHNIQUE, payload: technique };
}

export function setThreeD(threeD: boolean) {
  return { type: SET_THREE_D, payload: threeD };
}

export function setSearchItems(searchItems: Item[]) {
  return { type: SET_SEARCH_ITEMS, payload: searchItems };
}

export function setMoleculeShown(moleculeShown: boolean) {
  return { type: SET_MOLECULE_SHOWN, payload: moleculeShown };
}

export function setIsLegendOpen(isLegendOpen: boolean) {
  return { type: SET_IS_LEGEND_OPEN, payload: isLegendOpen };
}

export function setErrorMessage(errorMessage: string) {
  return { type: SET_ERROR_MESSAGE, payload: errorMessage };
}

export function setCameraPosition(cameraPosition: any) {
  return { type: SET_CAMERA_POSITION, payload: cameraPosition };
}

export function setCameraRotation(cameraRotation: any) {
  return { type: SET_CAMERA_ROTATION, payload: cameraRotation };
}

export function setMoleculeName(moleculeName: string) {
  return { type: SET_MOLECULE_NAME, payload: moleculeName };
}

export function setDataItems(dataItems: Item[]) {
  return { type: SET_DATA_ITEMS, payload: dataItems };
}

export function setLightMode(lightMode: boolean) {
  return { type: SET_LIGHT_MODE, payload: lightMode };
}

export function setCSVFilePath(csvFilePath: string) {
  return { type: SET_CSV_FILE_PATH, payload: csvFilePath };
}

export function setColorParamList(colorParamList: string[]) {
  return { type: SET_COLOR_PARAM_LIST, payload: colorParamList };
}

export function setShapeParamList(shapeParamList: string[]) {
  return { type: SET_SHAPE_PARAM_LIST, payload: shapeParamList };
}

export function setData(data: []) {
  return { type: SET_DATA, payload: data };
}

export function setPDB(data: { relativePath: string; fileData: string }[]) {
  return { type: SET_PDB, payload: data };
}

export function setIsLoading(isLoading: boolean) {
  return { type: SET_IS_LOADING, payload: isLoading };
}

export function setColorAndShapeKey(colorKey: string, shapeKey: string) {
  return {
    type: SET_COLOR_AND_SHAPE_KEY,
    payload: {
      colorKey: colorKey,
      shapeKey: shapeKey,
    },
  };
}

export function setCustomFeature(customization: any) {
  return { type: SET_CUSTOM_FEATURE, payload: { customization } };
}

export function setProjections(projections: any) {
  return { type: SET_PROJECTIONS, payload: projections };
}

export function setProteinData(proteinData: any) {
  return { type: SET_PROTEIN_DATA, payload: proteinData };
}

export function setStructures(structures: any) {
  return { type: SET_STRUCTURES, payload: structures };
}

interface PayloadAction<T = any> extends Action {
  payload: T;
}

type AppDispatch = ThunkDispatch<SettingsState, unknown, PayloadAction>;

export const fetchAndSetData = createAsyncThunk<
  void,
  object,
  { dispatch: AppDispatch; state: RootState }
>("settings/fetchAndSetData", async (localData, thunkAPI) => {
  try {
    const data =
      Object.keys(localData).length === 0 ? await fetchData() : localData;
    const selectedProjection = data.visualization_state.technique ?? 3;
    data.projections[selectedProjection].data.forEach((element: any) => {
      element = Object.assign(element, data.protein_data[element.identifier]);
    });

    const items: Item[] = [];
    const colorParamList: string[] =
      data.visualization_state.colorParamList ?? [];
    const keys = Object.keys(
      data.projections[selectedProjection].data[0].features
    ).filter(
      (item: any) =>
        !Number(data.projections[selectedProjection].data[0].features[item])
    );
    const colorKey = keys[1];
    const newData = data.projections[selectedProjection].data.map(
      (item: any) => {
        const newItem = {
          ...item,
        }; // Create a copy of the current item
        for (const key in newItem.features) {
          if (newItem.features[key] === "") {
            newItem.features[key] = "NaN";
          }
        }
        return newItem;
      }
    );

    newData.forEach((element: any) => {
      for (const key in element.features) {
        const value = element.features[key];
        if (
          items.filter((e) => e.category === key && e.name === value).length ===
          0
        ) {
          if (key === colorKey) {
            items.push({
              category: key,
              color: colorList[colorParamList.length % colorList.length],
              name: value,
            });
            colorParamList.push(value);
          } else {
            items.push({ category: key, name: value });
          }
        }
      }
    });
    thunkAPI.dispatch(setColorList(colorList));
    thunkAPI.dispatch(setDataItems(items));
    thunkAPI.dispatch(setData(data.projections[selectedProjection].data));
    thunkAPI.dispatch(
      setKeyList(
        Object.keys(data.projections[selectedProjection].data[0].features)
      )
    );
    thunkAPI.dispatch(
      setThreeD(data.projections[selectedProjection].dimensions === 3)
    );
    thunkAPI.dispatch(
      setColorKey(data.visualization_state.colorKey ?? "major_group")
    );
    thunkAPI.dispatch(setColorParam(data.visualization_state.colorParam ?? ""));
    thunkAPI.dispatch(setColorParamList(colorParamList));
    thunkAPI.dispatch(
      setSearchItems(data.visualization_state.searchItems ?? [])
    );

    thunkAPI.dispatch(setProjections(data.projections));
    thunkAPI.dispatch(setProteinData(data.protein_data));

    thunkAPI.dispatch(
      setCameraPosition(
        new Vector3(
          data.visualization_state.camera[0].position.x,
          data.visualization_state.camera[0].position.y,
          data.visualization_state.camera[0].position.z
        )
      )
    );
    thunkAPI.dispatch(
      setCameraRotation(
        new Vector3(
          data.visualization_state.camera[0].position.x,
          data.visualization_state.camera[0].position.y,
          data.visualization_state.camera[0].position.z
        )
      )
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    thunkAPI.dispatch(
      setErrorMessage("The data could not be fetched. Please check the files.")
    );
  }
});
