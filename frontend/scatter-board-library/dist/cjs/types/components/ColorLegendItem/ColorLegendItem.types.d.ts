export interface ColorLegendItemProps {
    color: string;
    selected: boolean;
    screenshot: boolean;
    text: string;
    onClick: () => void;
    lightMode: boolean;
}
