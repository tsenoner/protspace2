// utils/threeUtils.ts
import * as THREE from "three";
import { createFileName } from "use-react-screenshot";

export const createPlane = (
  width: number | undefined,
  height: number | undefined,
  color: any,
  name: string
) => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);

  plane.userData.name = name;
  plane.userData.color = color;

  return plane;
};

export const createCube = (size: number, color: number) => {
  const cube = new THREE.Object3D();

  const planeFront = createPlane(size, size, color, "XY Plane");
  const planeBack = createPlane(size, size, color, "XY Plane");
  const planeLeft = createPlane(size, size, color, "YZ Plane");
  const planeRight = createPlane(size, size, color, "YZ Plane");
  const planeTop = createPlane(size, size, color, "XZ Plane");
  const planeBottom = createPlane(size, size, color, "XZ Plane");

  planeLeft.rotation.y = Math.PI / 2;
  planeRight.rotation.y = Math.PI / 2;
  planeTop.rotation.x = Math.PI / 2;
  planeBottom.rotation.x = Math.PI / 2;
  planeFront.position.set(size / 2, size / 2, size);
  planeBack.position.set(size / 2, size / 2, 0);
  planeLeft.position.set(0, size / 2, size / 2);
  planeRight.position.set(size, size / 2, size / 2);
  planeTop.position.set(size / 2, size, size / 2);
  planeBottom.position.set(size / 2, 0, size / 2);

  cube.add(planeFront, planeBack, planeLeft, planeRight, planeTop, planeBottom);

  return cube;
};

export const createBigCube = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number
) => {
  const width = maxX - minX;
  const height = maxY - minY;
  const depth = maxZ - minZ;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const edgesGeometry = new THREE.BufferGeometry();

  const vertices = new Float32Array([
    -width / 2,
    -height / 2,
    -depth / 2,
    width / 2,
    -height / 2,
    -depth / 2,
    width / 2,
    -height / 2,
    -depth / 2,
    width / 2,
    -height / 2,
    depth / 2,
    width / 2,
    -height / 2,
    depth / 2,
    -width / 2,
    -height / 2,
    depth / 2,
    -width / 2,
    -height / 2,
    depth / 2,
    -width / 2,
    -height / 2,
    -depth / 2,
    -width / 2,
    height / 2,
    -depth / 2,
    width / 2,
    height / 2,
    -depth / 2,
    width / 2,
    height / 2,
    -depth / 2,
    width / 2,
    height / 2,
    depth / 2,
    width / 2,
    height / 2,
    depth / 2,
    -width / 2,
    height / 2,
    depth / 2,
    -width / 2,
    height / 2,
    depth / 2,
    -width / 2,
    height / 2,
    -depth / 2,
    -width / 2,
    -height / 2,
    -depth / 2,
    -width / 2,
    height / 2,
    -depth / 2,
    width / 2,
    -height / 2,
    -depth / 2,
    width / 2,
    height / 2,
    -depth / 2,
    width / 2,
    -height / 2,
    depth / 2,
    width / 2,
    height / 2,
    depth / 2,
    -width / 2,
    -height / 2,
    depth / 2,
    -width / 2,
    height / 2,
    depth / 2,
  ]);

  edgesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );

  const material = new THREE.LineBasicMaterial({ color: 0xadd8e6 });

  const cubeEdges = new THREE.LineSegments(edgesGeometry, material);
  cubeEdges.position.set(centerX, centerY, centerZ);
  cubeEdges.name = "cube";
  return cubeEdges;
};

export const projectToScreen = (
  obj3D: { project: (arg0: any) => void; x: number; y: number },
  camera: any,
  renderer: THREE.WebGLRenderer
) => {
  const vector = new THREE.Vector3();
  const widthHalf = 0.5 * renderer.domElement.clientWidth;
  const heightHalf = 0.5 * renderer.domElement.clientHeight;

  obj3D.project(camera);

  vector.x = obj3D.x * widthHalf + widthHalf;
  vector.y = -(obj3D.y * heightHalf) + heightHalf;

  return { x: vector.x, y: vector.y };
};

export const drawBoxEdges = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number,
  svgContainer: { appendChild: (arg0: SVGElement) => void },
  camera: THREE.Camera,
  toScreenPosition: (
    position: THREE.Vector3,
    camera: THREE.Camera
  ) => { x: number; y: number }
) => {
  const corners = [
    new THREE.Vector3(minX, minY, minZ),
    new THREE.Vector3(maxX, minY, minZ),
    new THREE.Vector3(maxX, maxY, minZ),
    new THREE.Vector3(minX, maxY, minZ),
    new THREE.Vector3(minX, minY, maxZ),
    new THREE.Vector3(maxX, minY, maxZ),
    new THREE.Vector3(maxX, maxY, maxZ),
    new THREE.Vector3(minX, maxY, maxZ),
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // Bottom edges
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // Top edges
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // Side edges
  ];

  edges.forEach(([start, end]) => {
    const startProj = toScreenPosition(corners[start], camera);
    const endProj = toScreenPosition(corners[end], camera);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startProj.x.toString());
    line.setAttribute("y1", startProj.y.toString());
    line.setAttribute("x2", endProj.x.toString());
    line.setAttribute("y2", endProj.y.toString());
    line.style.stroke = "grey"; // Color of the box edges
    line.style.strokeWidth = "1"; // Thickness of the box edges

    svgContainer.appendChild(line);
  });
};

export const downloadImage = async (
  image: any,
  { name = "scatter-plot", extension = "png" } = {},
  setLoading: (loading: boolean) => void
) => {
  const a = document.createElement("a");
  a.id = "a";
  const mergedCanvas = document.createElement("canvas");
  mergedCanvas.id = "mergedCanvas";
  mergedCanvas.width = window.innerWidth;
  mergedCanvas.height = window.innerHeight;

  const mergedContext = mergedCanvas.getContext("2d");
  if (!mergedContext) {
    setLoading(false);
    return;
  }
  let base_image = new Image();
  base_image.src = image;
  base_image.onload = async function () {
    const aspectRatio = base_image.width / base_image.height;
    const width = window.innerWidth;
    const height = window.innerHeight;
    let targetWidth = width;
    let targetHeight = height;

    if (width / height > aspectRatio) {
      targetWidth = height * aspectRatio;
    } else {
      targetHeight = width / aspectRatio;
    }

    const xOffset = (width - targetWidth) / 2;
    const yOffset = (height - targetHeight) / 2;

    mergedContext.drawImage(
      base_image,
      xOffset,
      yOffset,
      targetWidth,
      targetHeight
    );
    a.href = mergedCanvas.toDataURL();
    a.download = createFileName(extension, name);
    a.click();
    setLoading(false);

    document.getElementById("mergedCanvas")?.remove();
    document.getElementById("a")?.remove();
    URL.revokeObjectURL(image);
  };
};
