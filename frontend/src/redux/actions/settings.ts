import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../../api/api";
import { AtomStyleSpec, Item } from "../../data";
import { colorList, shapeList } from "../../helpers/constants";
import {
  ADD_TO_ATOM_STYLE,
  ADD_TO_SEARCH_ATOM_STYLE,
  REMOVE_FROM_ATOM_STYLE,
  REMOVE_FROM_SEARCH_ATOM_STYLE,
  SET_ATOM_STYLE,
  SET_CAMERA_POSITION,
  SET_CAMERA_ROTATION,
  SET_COLOR_AND_SHAPE_KEY,
  SET_COLOR_KEY,
  SET_COLOR_PARAM,
  SET_COLOR_PARAM_LIST,
  SET_CSV_FILE_PATH,
  SET_DATA,
  SET_DATA_ITEMS,
  SET_ERROR_MESSAGE,
  SET_IS_LEGEND_OPEN,
  SET_IS_LOADING,
  SET_KEY_LIST,
  SET_MOLECULE_NAME,
  SET_MOLECULE_SHOWN,
  SET_PDB,
  SET_PDB_EXISTS,
  SET_SEARCH_ATOM_STYLE,
  SET_SEARCH_ITEMS,
  SET_SELECTED_MOLS,
  SET_SHAPE_KEY,
  SET_SHAPE_PARAM,
  SET_SHAPE_PARAM_LIST,
  SET_TECHNIQUE,
  SET_THREE_D,
  SET_TWO_LEGEND,
} from "../actionTypes";
import { AppDispatch, RootState } from "../store";

export const addToAtomStyle = (payload: keyof AtomStyleSpec) => {
  return { type: ADD_TO_ATOM_STYLE, payload };
};

export const removeFromAtomStyle = (payload: keyof AtomStyleSpec) => {
  return { type: REMOVE_FROM_ATOM_STYLE, payload };
};

export const addToSearchAtomStyle = (payload: keyof AtomStyleSpec) => {
  return { type: ADD_TO_SEARCH_ATOM_STYLE, payload };
};

export const removeFromSearchAtomStyle = (payload: keyof AtomStyleSpec) => {
  return { type: REMOVE_FROM_SEARCH_ATOM_STYLE, payload };
};

export function setColorKey(colorKey: string) {
  return { type: SET_COLOR_KEY, payload: colorKey };
}

export function setShapeKey(shapeKey: string) {
  return { type: SET_SHAPE_KEY, payload: shapeKey };
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

export function setAtomStyle(atomStyle: AtomStyleSpec) {
  return { type: SET_ATOM_STYLE, payload: atomStyle };
}

export function setSearchAtomStyle(atomStyle: AtomStyleSpec) {
  return { type: SET_SEARCH_ATOM_STYLE, payload: atomStyle };
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

export const fetchAndSetData = createAsyncThunk<
  void,
  object,
  { dispatch: AppDispatch; state: RootState }
>("settings/fetchAndSetData", async (localData, thunkAPI) => {
  try {
    const data =
      Object.keys(localData).length === 0 ? await fetchData() : localData;
    const items: Item[] = [];
    const colorParamList: string[] = [];
    const shapeParamList: string[] = [];
    const keys = Object.keys(data[0]).filter(
      (item: any) => !Number(data[0][item])
    );
    var colorKey = keys[1];
    var shapeKey = keys[2];
    if (keys.length === 2) {
      shapeKey = keys[0];
    } else if (keys.length === 1) {
      colorKey = keys[0];
      shapeKey = "";
    }
    const newData = data.map((item: any) => {
      const newItem = {
        ...item,
      }; // Create a copy of the current item
      for (const key in newItem) {
        if (
          newItem.hasOwnProperty(key) &&
          typeof newItem[key] === "string" &&
          newItem[key] === ""
        ) {
          newItem[key] = "NaN";
        }
      }
      return newItem;
    });

    newData.forEach((element: any) => {
      for (const key in element) {
        const value = element[key];
        if (
          typeof value === "string" &&
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
          } else if (key === shapeKey) {
            items.push({
              category: key,
              img: shapeList[shapeParamList.length % shapeList.length],
              name: value,
            });
            shapeParamList.push(value);
          } else {
            items.push({ category: key, name: value });
          }
        }
      }
    });
    thunkAPI.dispatch(setData(newData));
    thunkAPI.dispatch(setDataItems(items));
    thunkAPI.dispatch(setShapeParamList(shapeParamList));
    thunkAPI.dispatch(setColorParamList(colorParamList));
    thunkAPI.dispatch(setKeyList(keys));
    thunkAPI.dispatch(setColorKey(colorKey));
    thunkAPI.dispatch(setShapeKey(shapeKey));
    thunkAPI.dispatch(setColorParam(""));
    thunkAPI.dispatch(setShapeParam(""));
    // thunkAPI.dispatch(setTechnique("umap"));
    if (keys.length === 1) {
      thunkAPI.dispatch(setTwoLegend(false));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    thunkAPI.dispatch(
      setErrorMessage("The data could not be fetched. Please check the files.")
    );
  }
});
