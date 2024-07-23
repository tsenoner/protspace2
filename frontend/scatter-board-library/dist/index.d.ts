import React, { MutableRefObject } from 'react';
import { PerspectiveCamera } from 'three';

interface ColorLegendProps {
    screenshot: boolean;
    colorKey: string | null;
    colorParamList: string[];
    colorParam: string;
    setColorParam: (colorParam: string) => void;
    colorList: string[];
    keyList: string[];
    setListParam: (listParam: string) => void;
    setCustomFeatures: (customFeatures: string[]) => void;
    customizations: ParamCustomization[];
    lightMode: boolean;
    onDoubleClick?: (color: string) => void;
}
type ParamCustomization = {
    featureName: string;
    customName: string;
    color: string;
    category: string;
};

declare const ColorLegend: React.FC<ColorLegendProps>;

interface ShapeLegendProps {
    screenshot: boolean;
    shapeKey: string | null;
    shapeParamList: string[];
    shapeParam: string;
    setShapeParam: (shapeParam: string) => void;
    shapeList: string[];
}

declare const ShapeLegend: React.FC<ShapeLegendProps>;

interface ControllerProps {
    controllerShown: boolean;
    onVisualizeClicked: () => void | undefined;
    onCompareClicked: () => void | undefined;
}

declare const Controller: React.FC<ControllerProps>;

interface Item {
    category: string;
    name: string;
    color?: string;
    img?: string;
}

interface ScatterBoardRef {
    downloadScreenshot: () => void;
    downloadSVG: () => void;
}
interface ScatterBoardProps {
    lightMode: boolean;
    cameraRef?: MutableRefObject<PerspectiveCamera>;
    setColorParam: (value: string) => void;
    onVisualizeClicked?: (value: string) => void;
    onCompareClicked?: (value: string) => void;
    setShapeParam: (value: string) => void;
    setListParam: (value: string) => void;
    keyList: string[];
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
    customFeatures?: any;
    setCustomFeatures: (value: string[]) => void;
}

declare const ScatterBoard: React.ForwardRefExoticComponent<ScatterBoardProps & React.RefAttributes<ScatterBoardRef>>;

export { ColorLegend, Controller, ScatterBoard, type ScatterBoardRef, ShapeLegend };
