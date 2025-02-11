import React from 'react';
import * as THREE from 'three';
import { ShapeLegendProps } from './ShapeLegend.types';
export declare function createShape(twoLegend: boolean, scene: THREE.Scene, path: string, coordinates: {
    x: number;
    y: number;
    z?: number;
}, colorInScene: string, opacity: number, userData: any): void;
declare const ShapeLegend: React.FC<ShapeLegendProps>;
export default ShapeLegend;
