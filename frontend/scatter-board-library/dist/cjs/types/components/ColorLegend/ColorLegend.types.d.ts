export interface ColorLegendProps {
    screenshot: boolean;
    colorKey: string | null;
    colorParamList: string[];
    colorParam: string;
    setColorParam: (colorParam: string) => void;
    colorList: string[];
}
