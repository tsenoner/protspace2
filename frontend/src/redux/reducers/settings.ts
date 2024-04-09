import { AtomStyleSpec, Item } from "../../data";
import { colorList, shapeList } from "../../helpers/constants";
import {
  ADD_TO_ATOM_STYLE,
  ADD_TO_SEARCH_ATOM_STYLE,
  REMOVE_FROM_ATOM_STYLE,
  REMOVE_FROM_SEARCH_ATOM_STYLE,
  SET_ATOM_STYLE,
  SET_CAMERA,
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
  SET_DEFAULT_COLOR_SCHEME,
  SET_ERROR_MESSAGE,
  SET_HIGHLIGHTING,
  SET_IS_LEGEND_OPEN,
  SET_IS_LOADING,
  SET_KEY_LIST,
  SET_LEGEND,
  SET_MOLECULE_NAME,
  SET_MOLECULE_SHOWN,
  SET_PDB,
  SET_PDB_EXISTS,
  SET_PROJECTIONS,
  SET_PROTEIN_DATA,
  SET_SEARCH_ATOM_STYLE,
  SET_SEARCH_ITEMS,
  SET_SELECTED_MOLS,
  SET_SHAPE_KEY,
  SET_SHAPE_PARAM,
  SET_SHAPE_PARAM_LIST,
  SET_STRUCTURES,
  SET_TECHNIQUE,
  SET_THREE_D,
  SET_TWO_LEGEND,
  SET_LIGHT_MODE,
} from "../actionTypes";

// Default styles
const defaultStyles: AtomStyleSpec = {
  cartoon: {
    hidden: false,
    color: "spectrum",
    style: "rectangle",
    ribbon: false,
    arrows: false,
    tubes: false,
    thickness: 0.4,
    width: 1,
    opacity: 1,
  },
  line: {
    hidden: false,
    color: "spectrum",
    wireframe: false,
    opacity: 1,
  },
  stick: {
    hidden: false,
    color: "spectrum",
    opacity: 1,
    radius: 1,
    showNonBonded: false,
    singleBonds: false,
  },
};

const initialAtomStyleState: AtomStyleSpec = {
  cartoon: {
    hidden: false,
    color: "spectrum",
    style: "rectangle",
    ribbon: false,
    arrows: false,
    tubes: false,
    thickness: 0.4,
    width: 1,
    opacity: 1,
  },
};

export interface SettingsState {
  lightMode: boolean;
  colorKey: string;
  shapeKey: string;
  twoLegend: boolean;
  technique: number;
  threeD: boolean;
  atomStyle: AtomStyleSpec;
  searchAtomStyle: AtomStyleSpec;
  searchItems: Item[];
  colorParam: string;
  shapeParam: string;
  moleculeShown: boolean;
  colorList: string[];
  data: any[];
  shapeParamList: string[];
  colorParamList: string[];
  csvFilePath: string;
  dataItems: Item[];
  keyList: string[];
  isLegendOpen: boolean;
  errorMessage: string;
  pdbExists: boolean;
  moleculeName: string;
  selectedMols: string[];
  cameraPosition: any;
  cameraRotation: any;
  isLoading: boolean;
  pdb: { relativePath: string; fileData: string }[];
  default_color_scheme: any[];
  camera: any[];
  legend: any;
  highlighting: any;
  projections: any;
  structures: any;
  protein_data: any;
  customFeatures: any;
}

const initialState: SettingsState = {
  lightMode: false,
  colorKey: "",
  shapeKey: "",
  twoLegend: false,
  technique: 3,
  threeD: true,
  atomStyle: initialAtomStyleState,
  searchAtomStyle: initialAtomStyleState,
  searchItems: [],
  colorParam: "",
  shapeParam: "",
  moleculeShown: false,
  data: [],
  colorList: [],
  shapeParamList: [],
  colorParamList: [],
  csvFilePath: "df_3FTx_mature_esm2.csv",
  dataItems: [],
  keyList: [],
  isLegendOpen: true,
  errorMessage: "",
  pdbExists: true,
  moleculeName: "",
  cameraPosition: null,
  cameraRotation: null,
  selectedMols: [],
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

const settingsReducer = (
  state = initialState,
  action: {
    type: any;
    payload: any;
  }
) => {
  let newItems;
  let colorParamList: string[] = [];
  let shapeParamList: string[] = [];
  let items: Item[] = [];
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case SET_PDB_EXISTS:
      return {
        ...state,
        pdbExists: action.payload,
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case SET_CAMERA_POSITION:
      return {
        ...state,
        cameraPosition: action.payload,
      };
    case SET_CAMERA_ROTATION:
      return {
        ...state,
        cameraRotation: action.payload,
      };
    case SET_COLOR_LIST:
      return {
        ...state,
        colorList: action.payload,
      };
    case SET_SHAPE_PARAM_LIST:
      return {
        ...state,
        shapeParamList: action.payload,
      };
    case SET_COLOR_PARAM_LIST:
      return {
        ...state,
        colorParamList: action.payload,
      };
    case SET_CSV_FILE_PATH:
      return {
        ...state,
        csvFilePath: action.payload,
      };
    case SET_SELECTED_MOLS:
      return {
        ...state,
        selectedMols: action.payload,
      };
    case SET_DATA_ITEMS:
      return {
        ...state,
        dataItems: action.payload,
      };
    case SET_CUSTOM_FEATURE:
      return {
        ...state,
        customFeatures: action.payload.customization,
      };
    case SET_LIGHT_MODE:
      return {
        ...state,
        lightMode: action.payload,
      };
    case SET_COLOR_PARAM:
      return {
        ...state,
        colorParam: action.payload,
      };
    case SET_SHAPE_PARAM:
      return {
        ...state,
        shapeParam: action.payload,
      };
    case SET_COLOR_AND_SHAPE_KEY:
      state.data.forEach((element: any) => {
        for (const key in element.features) {
          const value = element.features[key];
          if (
            typeof value === "string" &&
            items.filter((e) => e.category === key && e.name === value)
              .length === 0
          ) {
            if (key === action.payload.colorKey) {
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
      return {
        ...state,
        colorParamList: colorParamList,
        shapeParamList: shapeParamList,
        items: items,
        colorKey: action.payload.colorKey,
        shapeKey: action.payload.shapeKey,
      };
    case SET_COLOR_KEY:
      state.data.forEach((element: any) => {
        for (const key in element) {
          const value = element[key];
          if (
            typeof value === "string" &&
            items.filter((e) => e.category === key && e.name === value)
              .length === 0
          ) {
            if (key === action.payload) {
              items.push({
                category: key,
                color: colorList[colorParamList.length % colorList.length],
                name: value,
              });
              colorParamList.push(value);
            } else if (key === state.shapeKey) {
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
      return {
        ...state,
        colorParamList: colorParamList,
        shapeParamList: shapeParamList,
        items: items,
        colorKey: action.payload,
      };
    case SET_SHAPE_KEY:
      state.data.forEach((element: any) => {
        for (const key in element) {
          const value = element[key];
          if (
            typeof value === "string" &&
            items.filter((e) => e.category === key && e.name === value)
              .length === 0
          ) {
            if (key === state.colorKey) {
              items.push({
                category: key,
                color: colorList[colorParamList.length % colorList.length],
                name: value,
              });
              colorParamList.push(value);
            } else if (key === action.payload) {
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
      return {
        ...state,
        colorParamList: colorParamList,
        shapeParamList: shapeParamList,
        items: items,
        shapeKey: action.payload,
      };
    case SET_TWO_LEGEND:
      return {
        ...state,
        twoLegend: action.payload,
      };
    case SET_TECHNIQUE:
      const selectedProjection = state.projections[action.payload];
      selectedProjection.data.forEach((element: any) => {
        element = Object.assign(
          element,
          state.protein_data[element.identifier]
        );
      });

      const itemsLocal: Item[] = [];
      const colorParamListLocal: string[] = [];
      const keys = Object.keys(selectedProjection.data[0].features).filter(
        (item: any) => !Number(selectedProjection.data[0].features[item])
      );
      const colorKey = keys[1];
      const newData = selectedProjection.data.map((item: any) => {
        const newItem = {
          ...item,
        }; // Create a copy of the current item
        for (const key in newItem.features) {
          if (newItem.features[key] === "") {
            newItem.features[key] = "NaN";
          }
        }
        return newItem;
      });

      newData.forEach((element: any) => {
        for (const key in element.features) {
          const value = element.features[key];
          if (
            itemsLocal.filter((e) => e.category === key && e.name === value)
              .length === 0
          ) {
            if (key === colorKey) {
              itemsLocal.push({
                category: key,
                color: colorList[colorParamListLocal.length % colorList.length],
                name: value,
              });
              colorParamListLocal.push(value);
            } else {
              itemsLocal.push({ category: key, name: value });
            }
          }
        }
      });

      return {
        ...state,
        colorParamList: colorParamListLocal,
        data: selectedProjection.data,
        threeD: selectedProjection.dimensions === 3,
        technique: action.payload,
        dataItems: itemsLocal,
      };
    case SET_MOLECULE_NAME:
      return {
        ...state,
        moleculeName: action.payload,
      };
    case SET_THREE_D:
      return {
        ...state,
        threeD: action.payload,
      };
    case SET_ATOM_STYLE:
      return {
        ...state,
        atomStyle: action.payload,
      };
    case SET_SEARCH_ATOM_STYLE:
      return {
        ...state,
        searchAtomStyle: action.payload,
      };
    case SET_SEARCH_ITEMS:
      return {
        ...state,
        searchItems: action.payload,
      };
    case SET_IS_LEGEND_OPEN:
      return {
        ...state,
        isLegendOpen: action.payload,
      };
    case SET_KEY_LIST:
      return {
        ...state,
        keyList: action.payload,
      };
    case SET_MOLECULE_SHOWN:
      return {
        ...state,
        moleculeShown: action.payload,
      };
    case ADD_TO_ATOM_STYLE:
      newItems = {
        ...state.atomStyle,
        [action.payload]: defaultStyles[action.payload as keyof AtomStyleSpec],
      };
      return {
        ...state,
        atomStyle: newItems,
      };
    case ADD_TO_SEARCH_ATOM_STYLE:
      newItems = {
        ...state.searchAtomStyle,
        [action.payload]: defaultStyles[action.payload as keyof AtomStyleSpec],
      };
      return {
        ...state,
        searchAtomStyle: newItems,
      };
    case REMOVE_FROM_ATOM_STYLE:
      newItems = {
        ...state.atomStyle,
      };
      delete newItems[action.payload as keyof AtomStyleSpec];
      return {
        ...state,
        atomStyle: newItems,
      };
    case REMOVE_FROM_SEARCH_ATOM_STYLE:
      newItems = {
        ...state.searchAtomStyle,
      };
      delete newItems[action.payload as keyof AtomStyleSpec];
      return {
        ...state,
        searchAtomStyle: newItems,
      };
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_PDB:
      return {
        ...state,
        pdb: action.payload,
      };
    case SET_DEFAULT_COLOR_SCHEME:
      return {
        ...state,
        default_color_scheme: action.payload,
      };
    case SET_CAMERA:
      return {
        ...state,
        camera: action.payload,
      };
    case SET_LEGEND:
      return {
        ...state,
        legend: action.payload,
      };
    case SET_HIGHLIGHTING:
      return {
        ...state,
        highlighting: action.payload,
      };
    case SET_PROJECTIONS:
      return {
        ...state,
        projections: action.payload,
      };
    case SET_STRUCTURES:
      return {
        ...state,
        structures: action.payload,
      };
    case SET_PROTEIN_DATA:
      return {
        ...state,
        protein_data: action.payload,
      };

    default:
      return state;
  }
};

export default settingsReducer;
