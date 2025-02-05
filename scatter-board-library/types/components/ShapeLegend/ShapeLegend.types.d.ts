export interface ShapeLegendProps {
    screenshot: boolean;
    shapeKey: string | null;
    shapeParamList: string[];
    shapeParam: string;
    setShapeParam: (shapeParam: string) => void;
}
