import { MutableRefObject } from "react";
import { Item } from "../../helpers/data";
import { PerspectiveCamera } from "three";
export interface ScatterBoardRef {
    downloadScreenshot: () => void;
    downloadSVG: () => void;
}
export interface ScatterBoardProps {
    cameraRef?: MutableRefObject<PerspectiveCamera>;
    setColorParam: (value: string) => void;
    onVisualizeClicked?: (value: string) => void;
    onCompareClicked?: (value: string) => void;
    setShapeParam: (value: string) => void;
    twoLegend: boolean;
    isLegendOpen: boolean;
    searchItems: Item[];
    dataItems: Item[];
    colorKey: string;
    colorParam: string;
    shapeKey: string;
    shapeParam: string;
    threeD: boolean;
    data: any[];
    technique: string;
    shapeParamList: string[];
    colorParamList: string[];
    cameraPosition?: any;
    cameraRotation?: any;
    colorList: string[];
    shapeList: string[];
    setErrorMessage?: (value: string) => void;
}
