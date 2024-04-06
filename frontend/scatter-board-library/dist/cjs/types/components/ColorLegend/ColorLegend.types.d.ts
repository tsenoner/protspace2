export interface ColorLegendProps {
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
}
type ParamCustomization = {
    featureName: string;
    customName: string;
    color: string;
    category: string;
};
export {};
