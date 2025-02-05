import * as THREE from "three";
export declare const createPlane: (width: number | undefined, height: number | undefined, color: any, name: string) => THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
export declare const createCube: (size: number, color: number) => THREE.Object3D<THREE.Event>;
export declare const createBigCube: (minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number) => THREE.LineSegments<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.LineBasicMaterial>;
export declare const projectToScreen: (obj3D: {
    project: (arg0: any) => void;
    x: number;
    y: number;
}, camera: any, renderer: THREE.WebGLRenderer) => {
    x: number;
    y: number;
};
export declare const drawBoxEdges: (minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number, svgContainer: {
    appendChild: (arg0: SVGElement) => void;
}, camera: THREE.Camera, toScreenPosition: (position: THREE.Vector3, camera: THREE.Camera) => {
    x: number;
    y: number;
}) => void;
export declare const downloadImage: (image: any, { name, extension }: {
    name?: string | undefined;
    extension?: string | undefined;
} | undefined, setLoading: (loading: boolean) => void) => Promise<void>;
