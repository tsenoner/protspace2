import { Vector3 } from "three";
import { AtomStyleSpec, Item } from "../../data";
import { colorList, shapeList } from "../../helpers/constants";
import {
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
import { transformCoordinates } from "../../components/utils";

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
  camera: any;
  legend: any;
  highlighting: any;
  projections: any;
  structures: any;
  protein_data: any;
  customFeatures: any;
  items: Item[];
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
  camera: {},
  legend: {},
  highlighting: {},
  projections: {},
  structures: {},
  protein_data: {},
  customFeatures: [],
  items: [],
};

const settingsReducer = (
  state = initialState,
  action: {
    type: any;
    payload: any;
  }
) => {
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
    case SET_CAMERA:
      return {
        ...state,
        camera: action.payload,
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
            items.filter((e) => e.category === key && e.name === value)
              .length === 0
          ) {
            if (key === action.payload.colorKey) {
              items.push({
                category: key,
                color: colorList[colorParamList.length % colorList.length],
                name: value as string,
              });

              colorParamList.push(`${value}` as string);
            } else {
              items.push({ category: key, name: value as string });
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
    case SET_TWO_LEGEND:
      return {
        ...state,
        twoLegend: action.payload,
      };
    case SET_TECHNIQUE:
      const selectedProjection = state.projections[action.payload];
      if (!selectedProjection) return state;
      const transformData = transformCoordinates(selectedProjection.data);
      transformData.forEach((element: any) => {
        if (state.protein_data) {
          Object.assign(element, state.protein_data[element.identifier]);
        } else {
          element.features = "NaN";
        }
      });

      if (selectedProjection.dimensions === 2) {
        state.cameraPosition = new Vector3(
          0.05273795378094992,
          3.473258577458065,
          59.89936304805207
        );
        state.cameraRotation = new Vector3(
          -0.05792004425389763,
          0.0008789660095279366,
          0.00005096674957453894
        );
      } else {
        if (state.camera.position !== undefined) {
          state.cameraPosition = new Vector3(
            state.camera.position.x,
            state.camera.position.y,
            state.camera.position.z
          );

          state.cameraRotation = new Vector3(
            state.camera.rotation.x,
            state.camera.rotation.y,
            state.camera.rotation.z
          );
        }
      }

      const itemsLocal: Item[] = [];
      const colorParamListLocal: string[] = [];
      const keys = state.protein_data
        ? Object.keys(selectedProjection.data[0].features).filter(
            (item: any) => selectedProjection.data[0].features[item]
          )
        : ["NaN"];
      const colorKey = state.colorKey ?? keys[0];
      const newData = state.protein_data
        ? transformData.map((item: any) => {
            const newItem = {
              ...item,
            }; // Create a copy of the current item
            for (const key in newItem.features) {
              if (newItem.features[key] === "") {
                newItem.features[key] = "NaN";
              }
            }
            return newItem;
          })
        : [];

      state.protein_data &&
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
                  color:
                    colorList[colorParamListLocal.length % colorList.length],
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
        colorParamList: colorParamListLocal.map((item) => String(item)),
        data: transformData,
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
