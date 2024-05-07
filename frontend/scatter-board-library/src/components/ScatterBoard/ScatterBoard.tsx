import * as htmlToImage from "html-to-image";
import React, {
  MouseEvent,
  MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { createFileName, useScreenshot } from "use-react-screenshot";
import { Item, truncate } from "../../helpers/data";
import ColorLegend from "../ColorLegend/ColorLegend";
import Controller from "../Controller/Controller";
import ShapeLegend from "../ShapeLegend/ShapeLegend";
import { ScatterBoardProps, ScatterBoardRef } from "./ScatterBoard.types";
import Stats from "three/examples/jsm/libs/stats.module.js";
import "../../styles/tailwind.css";

const ScatterBoard = forwardRef<ScatterBoardRef, ScatterBoardProps>(
  (
    {
      lightMode,
      cameraRef = useRef() as MutableRefObject<THREE.PerspectiveCamera>,
      setColorParam,
      setShapeParam,
      keyList,
      setListParam,
      twoLegend,
      isLegendOpen,
      searchItems,
      dataItems,
      colorKey,
      colorParam,
      shapeKey,
      shapeParam,
      threeD,
      data,
      technique,
      shapeParamList,
      colorParamList,
      cameraPosition,
      cameraRotation,
      colorList,
      setCustomFeatures,
      shapeList,
      setErrorMessage,
      onVisualizeClicked,
      onCompareClicked,
      customFeatures,
    },
    ref
  ) => {
    const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
    const legendRef = useRef() as MutableRefObject<HTMLDivElement>;
    const miniContainerRef = useRef() as MutableRefObject<HTMLDivElement>;
    const sceneRef = useRef() as MutableRefObject<THREE.Scene>;
    const miniSceneRef = useRef() as MutableRefObject<THREE.Scene>;
    const miniCameraRef = useRef() as MutableRefObject<THREE.PerspectiveCamera>;
    const rendererRef = useRef() as MutableRefObject<THREE.WebGLRenderer>;
    const controlsRef = useRef() as MutableRefObject<OrbitControls>;
    const miniControlsRef = useRef() as MutableRefObject<OrbitControls>;
    const [loading, setLoading] = useState(false);
    const [axisName, setAxisName] = useState("");
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const [info, setInfo] = useState("");
    const [identifierName, setIdentifierName] = useState("");
    const [controllerShown, setControllerShown] = useState(false);
    const [controllerPosition, setControllerPosition] = useState<{
      top?: string;
      left?: string;
    }>({});
    const [imageSrc, takeScreenshot] = useScreenshot();
    const [entityName, setEntityName] = useState("");
    const objArr = useRef([]);
    const [minX, setMinX] = useState(0);
    const [maxX, setMaxX] = useState(0);
    const [minY, setMinY] = useState(0);
    const [maxY, setMaxY] = useState(0);
    const [minZ, setMinZ] = useState(0);
    const [maxZ, setMaxZ] = useState(0);
    const legendRefFull = (
      <div className="absolute h-full w-full -z-20" ref={legendRef}>
        <div className={"inline"}>
          <div className="flex absolute right-0">
            <ColorLegend
              keyList={keyList}
              screenshot={true}
              setListParam={(param: string) => setListParam(param)}
              colorKey={colorKey}
              colorParamList={colorParamList}
              colorParam={colorParam}
              setColorParam={(param: string) => setColorParam(param)}
              colorList={colorList}
              setCustomFeatures={setCustomFeatures}
              customizations={customFeatures}
              lightMode={lightMode}
            />
          </div>
        </div>
      </div>
    );

    useImperativeHandle(ref, () => ({
      downloadScreenshot() {
        createScreenshot();
      },
      downloadSVG() {
        downloadSVG();
      },
    }));

    const removeObjectByName = (name: string) => {
      const selectedObject = sceneRef.current.getObjectByName(name);
      if (selectedObject) {
        sceneRef.current.remove(selectedObject);
      }
    };

    async function createScreenshot() {
      setLoading(true);
      htmlToImage
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'toPng' does not exist on type 'typeof import("html-to-image")'.
        .toPng(document.getElementById("pngFile"), { backgroundColor: "white" })
        .then(function (dataUrl) {
          download(dataUrl, {
            name: "legend",
          });
        });
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const imageLegend = await takeScreenshot(rendererRef.current.domElement);
      await download(imageLegend);
    }

    const download = async (
      image: any,
      { name = "scatter-plot", extension = "png" } = {}
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
        // Calculate the scaled dimensions while maintaining aspect ratio
        var aspectRatio = base_image.width / base_image.height;
        var width = window.innerWidth;
        var height = window.innerHeight;
        var targetWidth = width;
        var targetHeight = height;

        if (width / height > aspectRatio) {
          targetWidth = height * aspectRatio;
        } else {
          targetHeight = width / aspectRatio;
        }

        // Calculate the position to center the image
        var xOffset = (width - targetWidth) / 2;
        var yOffset = (height - targetHeight) / 2;

        mergedContext.drawImage(
          base_image,
          xOffset,
          yOffset,
          targetWidth,
          targetHeight
        );
        // if (isLegendOpen) {
        //   const legend = await html2canvas(legendRef.current, {
        //     backgroundColor: null,
        //   });

        //   const aspectRatio = legend.width / legend.height;

        //   let targetWidth = window.innerWidth;
        //   let targetHeight = window.innerHeight;

        //   if (width / height > aspectRatio) {
        //     targetWidth = height * aspectRatio;
        //   } else {
        //     targetHeight = width / aspectRatio;
        //   }

        //   // Calculate the position to center the image
        //   const xOffset = (width - targetWidth) / 2;
        //   const yOffset = (height - targetHeight) / 2;
        //   mergedContext.drawImage(
        //     legend,
        //     xOffset,
        //     yOffset,
        //     targetWidth,
        //     targetHeight
        //   );
        // }
        a.href = mergedCanvas.toDataURL();
        a.download = createFileName(extension, name);
        a.click();
        setLoading(false);

        document.getElementById("mergedCanvas")?.remove();
        document.getElementById("a")?.remove();
        URL.revokeObjectURL(imageSrc);
      };
    };

    function projectToScreen(
      obj3D: { project: (arg0: any) => void; x: number; y: number },
      camera: any
    ) {
      const vector = new THREE.Vector3();
      const widthHalf = 0.5 * rendererRef.current.domElement.clientWidth;
      const heightHalf = 0.5 * rendererRef.current.domElement.clientHeight;

      obj3D.project(camera);

      vector.x = obj3D.x * widthHalf + widthHalf;
      vector.y = -(obj3D.y * heightHalf) + heightHalf;

      return { x: vector.x, y: vector.y };
    }

    function drawBoxEdges(
      minX: number,
      maxX: number,
      minY: number,
      maxY: number,
      minZ: number,
      maxZ: number,
      svgContainer: { appendChild: (arg0: SVGElement) => void },
      camera: THREE.Camera
    ) {
      const tempObj = new THREE.Object3D();

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
        // Set the position of the temp object to the start corner for projection
        tempObj.position.copy(corners[start]);
        const startProj = toScreenPosition(tempObj, camera);

        // Set the position of the temp object to the end corner for projection
        tempObj.position.copy(corners[end]);
        const endProj = toScreenPosition(tempObj, camera);

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", startProj.x.toString());
        line.setAttribute("y1", startProj.y.toString());
        line.setAttribute("x2", endProj.x.toString());
        line.setAttribute("y2", endProj.y.toString());
        line.style.stroke = "grey"; // Color of the box edges
        line.style.strokeWidth = "1"; // Thickness of the box edges

        svgContainer.appendChild(line);
      });
    }

    function createShape(
      dataLength: number,
      twoLegend: boolean,
      scaledCoordinates: {
        x: number;
        y: number;
        z?: number;
      },
      colorInScene: string,
      opacity: number,
      userData: any
    ) {
      const loader = new SVGLoader();

      let group;
      // const divElement = document.createElement("div");
      // divElement.innerHTML = "Info about " + userData[dataItems[0].category];
      // divElement.style.background = "red";
      // divElement.className = "info-div"; // Add a class for styling
      // document.body.appendChild(divElement);
      // let svgContainer = document.getElementById("svg-container");
      // if (!svgContainer) {
      //   // @ts-expect-error ts-migrate(2339) FIXME: Property 'createElementNS' does not exist on type 'Document'.
      //   svgContainer = document.createElementNS(
      //     "http://www.w3.org/2000/svg",
      //     "svg"
      //   );
      //   svgContainer!.id = "svg-container";
      //   svgContainer!.style.position = "absolute";
      //   svgContainer!.style.width = "100%";
      //   svgContainer!.style.height = "100%";
      //   svgContainer!.style.top = "0";
      //   svgContainer!.style.left = "0";
      //   svgContainer!.style.zIndex = "-1";
      //   document.body.appendChild(svgContainer!);
      // }

      // // Create an SVG circle element
      // const svgCircle = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "circle"
      // );
      // // svgCircle.setAttribute("r", `${coordinates.z}`); // Radius of the circle
      // svgCircle.setAttribute("cx", "100"); // Center the circle horizontally
      // svgCircle.setAttribute("cy", "200"); // Center the circle vertically
      // svgCircle.style.fill = userData.color; // Color from userData
      // svgCircle.style.position = "absolute";
      // svgContainer!.appendChild(svgCircle);

      const geometry = new THREE.SphereGeometry(dataLength < 500 ? 0.3 : 0.25);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        color: colorInScene,
        side: THREE.FrontSide,
        depthTest: false,
        opacity: opacity,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = userData;

      mesh.position.set(
        scaledCoordinates.x,
        scaledCoordinates.y,
        scaledCoordinates.z ?? 0
      );
      // objArr.current.push({ divObj: mesh, divElem: divElement });
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      objArr.current.push({ divObj: mesh });
      sceneRef.current.add(mesh);
    }

    function calculateScaleFactor(distance: number) {
      // Simple linear scaling based on distance
      // You may need to adjust the formula to get the desired effect
      const minScale = 0.5; // Minimum scale at maximum distance
      const maxDistance = 60; // Adjust as per your scene's size
      return 1 - Math.min(distance / maxDistance, 1) * (1 - minScale);
    }

    useEffect(() => {
      colorReset();
    }, [data, colorParam, shapeParam, searchItems, customFeatures]);

    function toScreenPosition(
      obj: { updateMatrixWorld: () => void; matrixWorld: THREE.Matrix4 },
      camera: THREE.Camera
    ) {
      var vector = new THREE.Vector3();

      // TODO: need to update this when resize window
      var widthHalf = 0.5 * window.innerWidth;
      var heightHalf = 0.5 * window.innerHeight;

      obj.updateMatrixWorld();
      vector.setFromMatrixPosition(obj.matrixWorld);
      vector.project(camera);

      vector.x = vector.x * widthHalf + widthHalf;
      vector.y = -(vector.y * heightHalf) + heightHalf;

      return {
        x: vector.x,
        y: vector.y,
      };
    }

    function onClick(event: MouseEvent<HTMLElement>): void {
      if (event.detail === 1) {
        setControllerShown(false);
        return;
      }
      // calculate pointer position in normalized device coordinates (-1 to +1) for
      // both components
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate the container's position relative to the viewport
      const containerRect = containerRef.current.getBoundingClientRect();

      // Calculate the mouse down position relative to the container
      const containerX = event.clientX - containerRect.left;
      const containerY = event.clientY - containerRect.top;
      setControllerPosition({
        top: containerY + "px",
        left: containerX + "px",
      });

      // update the picking ray with the camera and pointer position
      raycaster.setFromCamera(pointer, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (
          obj instanceof THREE.Mesh &&
          obj.geometry.type !== "BufferGeometry"
        ) {
          obj.material.color.set("#FD1C03");
          obj.material.opacity = 1;
          setEntityName(obj.userData.identifier); // should change with structure at some point
          setControllerShown(true);
          return;
        }
      }
      setControllerShown(false);
    }

    function colorReset() {
      objArr.current.forEach((objData) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
        let color = objData.divObj.userData.color; // Default color from userData
        let opacity = 0.8; // Default opacity
        let svgOpacity = 1.0; // SVGs use a 0-1 range for opacity

        // Apply customizations as baseline
        const customization = customFeatures.find(
          (feature: { featureName: any; customName: any; category: string }) =>
            feature.featureName ===
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
              objData.divObj.userData.features[colorKey] &&
            feature.category === colorKey
        );

        // Dim colors for non-matching colorParam
        if (
          colorParam !== "" &&
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
          colorParam != objData.divObj.userData.features[colorKey]
        ) {
          color = "#EEEEEE";
          opacity = 0.4;
          svgOpacity = 0.4;
        }

        // Highlight or dim based on searchItems
        const isMatched = searchItems.some((item) => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
          return Object.values(objData.divObj.userData.features).includes(
            item.name
          );
        });

        if (isMatched) {
          // Apply search item color, unless already set by customization
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
          color = customization ? color : objData.divObj.userData.color; // Keep customization color if exists
        } else if (searchItems.length) {
          color = "#EEEEEE"; // Dim color if there are search items but no match
          opacity = 0.4;
          svgOpacity = 0.4;
        }

        if (
          dataItems[0] &&
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
          objData.divObj.userData.features[dataItems[0].category] === entityName
        ) {
          color = "#0400ff"; // Highlight color
          opacity = 1;
          svgOpacity = 1.0;
        }

        if (customization) {
          const isCustomizationIncludeSearch = searchItems.some((item) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
            return Object.values(customization).includes(item.name);
          });
          if (isCustomizationIncludeSearch) {
            color = customization.color;
            opacity = 1;
          }
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.
        objData.divObj.material.color.set(color);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'material' does not exist on type 'Object3D'.

        objData.divObj.material.opacity = opacity;
        // Assuming objData also has a way to directly set SVG element styles, if needed
        // objData.svgElem.style.fill = color; // Uncomment and adjust if applicable
        // objData.svgElem.style.opacity = svgOpacity; // Uncomment and adjust if applicable
      });
    }

    function rgbToHex(r: any, g: any, b: any) {
      // Convert each component to an integer, then to a hex string
      const toHex = (component: number) => {
        const hex = Math.round(component * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex; // Manually pad with zero if necessary
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function onPointerMove(event: { clientX: number; clientY: number }) {
      // calculate pointer position in normalized device coordinates (-1 to +1) for
      // both components
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // update the picking ray with the camera and pointer position
      raycaster.setFromCamera(pointer, cameraRef.current);

      // calculate objects intersecting the picking ray
      colorReset();

      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      setInfo("");
      setIdentifierName("");
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (
          obj instanceof THREE.Mesh &&
          obj.geometry.type !== "BufferGeometry"
        ) {
          obj.material.color.set("#16FF00");
          obj.material.opacity = 0.8;
          if (obj.geometry.type !== "BufferGeometry") {
            const customFeature = customFeatures.find(
              (feature: { featureName: any }) =>
                feature.featureName === obj.userData.features[colorKey]
            );
            if (customFeature) {
              setInfo(customFeature.customName);
            } else {
              setInfo(obj.userData.features[colorKey]);
            }
            setIdentifierName(obj.userData.identifier);
          }
        }
      }
    }

    function onPointerDown() {
      setEntityName("");
      setControllerShown(false);
    }

    function onClickMini(event: { clientX: number; clientY: number }) {
      const miniContainerRect =
        miniContainerRef.current.getBoundingClientRect();

      // Calculate the mouse position relative to the miniContainerRef
      const containerX = event.clientX - miniContainerRect.left;
      const containerY = event.clientY - miniContainerRect.top;

      // Calculate the normalized device coordinates (-1 to +1) for both components
      pointer.x = (containerX / miniContainerRect.width) * 2 - 1;
      pointer.y = -(containerY / miniContainerRect.height) * 2 + 1;
      // update the picking ray with the camera and pointer position

      raycaster.setFromCamera(pointer, miniCameraRef.current);

      const intersects = raycaster.intersectObjects(
        miniSceneRef.current.children
      );

      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (obj instanceof THREE.Mesh) {
          if (obj.userData.name === "XY Plane") {
            miniCameraRef.current.position.set(0, 0, 30);
            cameraRef.current.position.set(0, 0, 30);
          } else if (obj.userData.name === "YZ Plane") {
            miniCameraRef.current.position.set(30, 0, 0);
            cameraRef.current.position.set(30, 0, 0);
          } else if (obj.userData.name === "XZ Plane") {
            miniCameraRef.current.position.set(0, 30, 0);
            cameraRef.current.position.set(0, 30, 0);
          }
          controlsRef.current.update();
          miniControlsRef.current.update();
          return;
        } else {
          if (obj.userData.name === "X Axis") {
            miniCameraRef.current.position.set(30, 0, 0);
            cameraRef.current.position.set(30, 0, 0);
          } else if (obj.userData.name === "Y Axis") {
            miniCameraRef.current.position.set(0, 30, 0);
            cameraRef.current.position.set(0, 30, 0);
          } else if (obj.userData.name === "Z Axis") {
            miniCameraRef.current.position.set(0, 0, 30);
            cameraRef.current.position.set(0, 0, 30);
          }
          controlsRef.current.update();
          miniControlsRef.current.update();
          return;
        }
      }
    }

    function onPointerMoveMini(event: { clientX: number; clientY: number }) {
      const miniContainerRect =
        miniContainerRef.current.getBoundingClientRect();

      // Calculate the mouse position relative to the miniContainerRef
      const containerX = event.clientX - miniContainerRect.left;
      const containerY = event.clientY - miniContainerRect.top;

      // Calculate the normalized device coordinates (-1 to +1) for both components
      pointer.x = (containerX / miniContainerRect.width) * 2 - 1;
      pointer.y = -(containerY / miniContainerRect.height) * 2 + 1;
      // update the picking ray with the camera and pointer position

      miniSceneRef.current.traverse((obj: any) => {
        if (obj instanceof THREE.Line || obj instanceof THREE.Mesh) {
          obj.material.color.set(obj.userData.color);
        }
      });
      raycaster.setFromCamera(pointer, miniCameraRef.current);

      // calculate objects intersecting the picking ray

      const intersects = raycaster.intersectObjects(
        miniSceneRef.current.children
      );
      var name = "";
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (obj instanceof THREE.Line || obj instanceof THREE.Mesh) {
          obj.material.color.set("#16FF00");
          name = obj.userData.name;
          if (obj instanceof THREE.Mesh) {
            break;
          }
        }
      }
      setAxisName(name);
    }

    function createPlane(
      width: number | undefined,
      height: number | undefined,
      color: any,
      name: string
    ) {
      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);

      // Set the userData for the plane
      plane.userData.name = name;
      plane.userData.color = color;

      return plane;
    }
    function createCube(size: number, color: number) {
      const cube = new THREE.Object3D();

      // Create planes for each side of the cube
      const planeFront = createPlane(size, size, color, "XY Plane");
      const planeBack = createPlane(size, size, color, "XY Plane");
      const planeLeft = createPlane(size, size, color, "YZ Plane");
      const planeRight = createPlane(size, size, color, "YZ Plane");
      const planeTop = createPlane(size, size, color, "XZ Plane");
      const planeBottom = createPlane(size, size, color, "XZ Plane");

      // Position the planes to form a cube
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

      // Add the planes to the cube object
      cube.add(
        planeFront,
        planeBack,
        planeLeft,
        planeRight,
        planeTop,
        planeBottom
      );

      return cube;
    }

    function createBigCube(
      minX: number,
      maxX: number,
      minY: number,
      maxY: number,
      minZ: number,
      maxZ: number
    ) {
      // Calculate the size and position of the cube
      const width = maxX - minX;
      const height = maxY - minY;
      const depth = maxZ - minZ;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const centerZ = (minZ + maxZ) / 2;
      // Create the cube
      // const geometry = new THREE.BoxGeometry(width, height, depth);
      // const material = new THREE.MeshBasicMaterial({
      //   color: 0x000000,
      //   wireframe: true,
      //   side: THREE.FrontSide,
      // });
      // const cube = new THREE.Mesh(geometry, material);
      // cube.position.set(centerX, centerY, centerZ);

      const edgesGeometry = new THREE.BufferGeometry();

      // Define the vertices for the edges
      const vertices = new Float32Array([
        // Bottom rectangle
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

        // Top rectangle
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

        // Vertical lines
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

      // Add vertices to geometry
      edgesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );

      // Create a material for the edges
      const material = new THREE.LineBasicMaterial({ color: 0xadd8e6 });

      // Create a line segments object to represent the edges
      const cubeEdges = new THREE.LineSegments(edgesGeometry, material);
      // Set the position of the cube
      cubeEdges.position.set(centerX, centerY, centerZ);
      cubeEdges.name = "cube";
      return cubeEdges;

      // return cube;
    }

    function getFeatureColor(
      featureValue: string,
      customizations: any[],
      colorList: string | any[],
      colorParamList: string | any[]
    ) {
      // Check if the feature value has a customization
      const customization =
        Object.keys(customizations).length !== 0 &&
        customizations.find(
          (c) => c.featureName === featureValue && c.category === colorKey
        );

      if (customization) {
        return customization.color;
      } else {
        // Otherwise, fall back to the original logic
        return featureValue === "NaN" || featureValue === ""
          ? "#000000"
          : colorList[
              colorParamList.indexOf(`${featureValue}`) % colorList.length
            ];
      }
    }

    useEffect(() => {
      objArr.current = [];
      const miniScene = new THREE.Scene();
      miniSceneRef.current = miniScene;
      const miniCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
      miniCameraRef.current = miniCamera;

      const miniRenderer = new THREE.WebGLRenderer();
      miniRenderer.setSize(96, 96);
      miniRenderer.setClearColor(0xffffff, 0);
      setControllerShown(false);

      document.body.appendChild(miniRenderer.domElement);

      var xAxisMaterialMini = new THREE.LineBasicMaterial({
        color: "#C2DEDC",
        linewidth: 3,
      });
      var xAxisGeometryMini = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(20, 0, 0),
      ]);
      var xAxisMini = new THREE.Line(xAxisGeometryMini, xAxisMaterialMini);
      xAxisMini.userData.name = "X Axis";
      xAxisMini.userData.color = "#C2DEDC";
      miniScene.add(xAxisMini);

      var yAxisMaterialMini = new THREE.LineBasicMaterial({
        color: "#ECE5C7",
        linewidth: 3,
      });
      var yAxisGeometryMini = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 20, 0),
      ]);
      var yAxisMini = new THREE.Line(yAxisGeometryMini, yAxisMaterialMini);
      yAxisMini.userData.name = "Y Axis";
      yAxisMini.userData.color = "#ECE5C7";
      miniScene.add(yAxisMini);

      var zAxisMaterialMini = new THREE.LineBasicMaterial({
        color: "#CDC2AE",
        linewidth: 3,
      });
      var zAxisGeometryMini = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 20),
      ]);
      var zAxisMini = new THREE.Line(zAxisGeometryMini, zAxisMaterialMini);
      zAxisMini.userData.name = "Z Axis";
      zAxisMini.userData.color = "#CDC2AE";
      miniScene.add(zAxisMini);

      const cubeSize = 6;
      const cubeColor = 0xff0000;
      const cube = createCube(cubeSize, cubeColor);
      miniScene.add(cube);
      miniContainerRef.current.appendChild(miniRenderer.domElement);

      miniCamera.position.z = 30;

      const scene = new THREE.Scene();
      scene.background = lightMode
        ? new THREE.Color(0xffffff)
        : new THREE.Color(0x2e2e3a);
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      sceneRef.current = scene;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const middle = {
        x: 0,
        y: 0,
        z: 0,
      };
      var coordinates: {
        x: number;
        y: number;
        z?: number;
      } = {
        x: 0,
        y: 0,
        z: 0,
      };
      var minX: number = Infinity;
      var maxX: number = -Infinity;
      var minY: number = Infinity;
      var maxY: number = -Infinity;
      var minZ: number = Infinity;
      var maxZ: number = -Infinity;

      data.forEach(async (point: any, index: any) => {
        if (threeD) {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
            z: point.coordinates.z,
          };
        } else {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
          };
        }
        if (
          (typeof coordinates.x === "undefined") == undefined ||
          typeof coordinates.y === "undefined"
        ) {
          setErrorMessage &&
            setErrorMessage(
              "Could not find the coordinates. Please check the CSV file."
            );
          return;
        }

        minX = Math.min(minX ?? Infinity, coordinates.x);
        maxX = Math.max(maxX ?? -Infinity, coordinates.x);
        minY = Math.min(minY ?? Infinity, coordinates.y);
        maxY = Math.max(maxY ?? -Infinity, coordinates.y);
        minZ = Math.min(minZ ?? Infinity, coordinates.z ?? 0);
        maxZ = Math.max(maxZ ?? -Infinity, coordinates.z ?? 0);
      });

      var localMinX = Infinity;
      var localMaxX = -Infinity;
      var localMinY = Infinity;
      var localMaxY = -Infinity;
      var localMinZ = Infinity;
      var localMaxZ = -Infinity;

      var scaledCoordinates: {
        x: number;
        y: number;
        z?: number;
      } = {
        x: 0,
        y: 0,
        z: 0,
      };

      data.forEach(async (point: any, index: any) => {
        if (threeD) {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
            z: point.coordinates.z,
          };
        } else {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
          };
        }
        if (
          (typeof coordinates.x === "undefined") == undefined ||
          typeof coordinates.y === "undefined"
        ) {
          setErrorMessage &&
            setErrorMessage(
              "Could not find the coordinates. Please check the CSV file."
            );
          return;
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        const scalePoint = (point, min, max, newMin, newMax) => {
          const result =
            ((point - min) / (max - min)) * (newMax - newMin) + newMin;
          return result;
        };

        const scaledX = scalePoint(coordinates.x, minX, maxX, -20, 20);

        const scaledY = scalePoint(coordinates.y, minY, maxY, -20, 20);
        const scaledZ = threeD
          ? scalePoint(coordinates.z, minZ, maxZ, -20, 20)
          : 0;

        localMinX = Math.min(localMinX ?? Infinity, scaledX);
        localMaxX = Math.max(localMaxX ?? -Infinity, scaledX);
        localMinY = Math.min(localMinY ?? Infinity, scaledY);
        localMaxY = Math.max(localMaxY ?? -Infinity, scaledY);
        localMinZ = Math.min(localMinZ ?? Infinity, scaledZ ?? 0);
        localMaxZ = Math.max(localMaxZ ?? -Infinity, scaledZ ?? 0);
      });

      data.forEach(async (point: any, index: any) => {
        if (threeD) {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
            z: point.coordinates.z,
          };
        } else {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
          };
        }
        if (
          (typeof point.coordinates.x === "undefined") == undefined ||
          typeof point.coordinates.y === "undefined"
        ) {
          setErrorMessage &&
            setErrorMessage(
              "Could not find the coordinates. Please check the CSV file."
            );
          return;
        }

        let color = getFeatureColor(
          point.features[colorKey],
          customFeatures,
          colorList,
          colorParamList
        );
        // let color =
        //   point.features[colorKey] === "NaN" || point.features[colorKey] === ""
        //     ? "#000000"
        //     : colorList[
        //         colorParamList.indexOf(point.features[colorKey]) %
        //           colorList.length
        //       ];
        var colorInScene = "";
        if (point.coordinates.x && point.coordinates.y) {
          colorInScene = color;
          let opacity = 0.8;
          if (colorParam !== "" && colorParam !== point.features[colorKey]) {
            colorInScene = "#EEEEEE";
            opacity = 0.4;
          }
          if (
            searchItems.length &&
            !searchItems.find((item: Item) => {
              for (const key in point.features) {
                if (item.name == point.features[key]) {
                  return true;
                }
              }
              return false;
            })
          ) {
            colorInScene = "#EEEEEE";
            opacity = 0.4;
          }

          // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
          const scalePoint = (point, min, max, newMin, newMax) => {
            const result =
              ((point - min) / (max - min)) * (newMax - newMin) + newMin;
            return result;
          };

          const maxExtent = 20;

          const deltaX = maxX - minX;
          const deltaY = maxY - minY;
          const deltaZ = maxZ - minZ;
          var maxDelta = Math.max(deltaX, deltaY, deltaZ);

          const scaledX = scalePoint(
            coordinates.x,
            minX,
            maxX,
            -((deltaX / maxDelta) * maxExtent),
            (deltaX / maxDelta) * maxExtent
          );
          const scaledY = scalePoint(
            coordinates.y,
            minY,
            maxY,
            -((deltaY / maxDelta) * maxExtent),
            (deltaY / maxDelta) * maxExtent
          );
          const scaledZ = threeD
            ? scalePoint(
                coordinates.z,
                minZ,
                maxZ,
                -((deltaZ / maxDelta) * maxExtent),
                (deltaZ / maxDelta) * maxExtent
              )
            : 0;

          scaledCoordinates.x = scaledX;
          scaledCoordinates.y = scaledY;
          scaledCoordinates.z = scaledZ;
          const dataLength = data.length;
          createShape(
            dataLength,
            twoLegend,
            (scaledCoordinates = {
              x: scaledX,
              y: scaledY,
              z: scaledZ,
            }),
            colorInScene,
            opacity,
            {
              color: color,
              index: index,
              ...point,
            }
          );
        }
        middle.x += coordinates.x;
        middle.y += coordinates.y;
        middle.z += coordinates.z ?? 0;

        minX = Math.min(minX ?? Infinity, coordinates.x);
        maxX = Math.max(maxX ?? -Infinity, coordinates.x);
        minY = Math.min(minY ?? Infinity, coordinates.y);
        maxY = Math.max(maxY ?? -Infinity, coordinates.y);
        minZ = Math.min(minZ ?? Infinity, coordinates.z ?? 0);
        maxZ = Math.max(maxZ ?? -Infinity, coordinates.z ?? 0);

        if (index === data.length - 1) {
          const cubeBig = createBigCube(
            localMinX,
            localMaxX,
            localMinY,
            localMaxY,
            localMinZ,
            localMaxZ
          );
          setMinX(localMinX);
          setMaxX(localMaxX);
          setMinY(localMinY);
          setMaxY(localMaxY);
          setMinZ(localMinZ);
          setMaxZ(localMaxZ);

          sceneRef.current.add(cubeBig);
        } else {
          removeObjectByName("cube");
        }
      });

      middle.x /= data.length;
      middle.y /= data.length;
      middle.z /= data.length;
      if (cameraPosition) {
        camera.position.set(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
        camera.rotation.set(
          cameraRotation.x,
          cameraRotation.y,
          cameraRotation.z
        );
      } else {
        if (!threeD) {
          camera.position.x = middle.x;
          camera.position.y = middle.y;
          camera.position.z = 30;
          camera.lookAt(middle.x, middle.y, 0);
        } else {
          camera.position.set(middle.x, middle.y, middle.z + 20);
          camera.lookAt(middle.x, middle.y, middle.z);
        }
      }
      cameraRef.current = camera;

      // set up orbit controls

      const controls = new OrbitControls(camera, renderer.domElement);
      // controls.addEventListener("change", () => {
      //   console.log(controls);
      // });
      controls.minDistance = 0;
      controls.maxDistance = 70;
      // controls.addEventListener("change", () => {
      //   objArr.current.forEach(function (objData) {
      //     const proj = toScreenPosition(
      //       // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      //       objData.divObj,
      //       cameraRef.current

      //       // rendererRef.current
      //     );
      //     // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      //     objData.svgElem.setAttribute("cx", proj.x);
      //     // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      //     objData.svgElem.setAttribute("cy", proj.y);
      //     // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      //     const distance = objData.divObj.position.distanceTo(
      //       cameraRef.current.position
      //     );
      //     const scaleFactor = calculateScaleFactor(distance);
      //     // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      //     objData.svgElem.setAttribute("r", 5 * scaleFactor);
      //   });
      // });
      const miniControls = new OrbitControls(
        miniCamera,
        miniRenderer.domElement
      );
      controlsRef.current = controls;
      miniControlsRef.current = miniControls;
      miniControls.enableRotate = true;
      miniControls.enableDamping = true;

      controls.enableZoom = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enablePan = true;
      if (!threeD) {
        controls.enableRotate = false; // Disable rotation
        controls.enablePan = true; // Enable panning
      }
      let previousDistance = controls.target.distanceTo(
        controls.object.position
      );

      const stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
      // Animation loop
      const animate = () => {
        stats.begin();
        requestAnimationFrame(animate);
        camera.position.copy(miniCamera.position);
        camera.rotation.copy(miniCamera.rotation);
        controls.update();
        const currentDistance = controls.target.distanceTo(
          controls.object.position
        );

        // // Check if the user zoomed in or out
        // if (currentDistance < previousDistance) {
        //   // Trigger an event for zooming in
        //   // Call your function or dispatch an action, etc.
        // } else if (currentDistance > previousDistance) {
        //   // Trigger an event for zooming out
        //   // Call your function or dispatch an action, etc.
        // }
        previousDistance = currentDistance;

        sceneRef.current.traverse((obj: any) => {
          if (obj instanceof THREE.Mesh) {
            obj.lookAt(obj.position.clone().add(camera.position));
          }
        });
        renderer.render(scene, camera);
        stats.end();
      };

      function animateMini() {
        requestAnimationFrame(animateMini);
        miniCamera.position.copy(camera.position);
        miniCamera.rotation.copy(camera.rotation);

        miniControls.update();
        miniRenderer.render(miniScene, miniCamera);
      }
      animateMini();

      animate();

      // Clean up on unmount
      return () => {
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        if (miniContainerRef.current) {
          miniContainerRef.current.removeChild(miniRenderer.domElement);
        }
        renderer.dispose();
        renderer.forceContextLoss();
        miniRenderer.dispose();
        miniRenderer.forceContextLoss();
      };
    }, [
      data,
      technique,
      colorParamList,
      shapeParamList,
      colorKey,
      shapeKey,
      twoLegend,
      threeD,
      colorList,
      customFeatures,
      lightMode,
      // setColorList,
    ]);

    function drawSVG(svgContainer?: HTMLElement | null) {
      objArr.current.forEach(function (objData) {
        // Create an SVG circle element
        const svgCircle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        // svgCircle.setAttribute("r", `${coordinates.z}`); // Radius of the circle
        svgCircle.setAttribute("cx", "100"); // Center the circle horizontally
        svgCircle.setAttribute("cy", "200"); // Center the circle vertically
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        svgCircle.style.fill = objData.divObj.userData.color;
        svgCircle.style.position = "absolute";
        const proj = toScreenPosition(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
          objData.divObj,
          cameraRef.current

          // rendererRef.current
        );
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        svgCircle.setAttribute("cx", proj.x);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        svgCircle.setAttribute("cy", proj.y);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        const distance = objData.divObj.position.distanceTo(
          cameraRef.current.position
        );
        const scaleFactor = calculateScaleFactor(distance);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        svgCircle.setAttribute("r", 5 * scaleFactor);
        svgContainer!.appendChild(svgCircle);
      });
    }

    function downloadSVG() {
      let svgContainer = document.getElementById("svg-container");
      if (!svgContainer) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createElementNS' does not exist on type 'Document'.
        svgContainer = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgContainer!.id = "svg-container";
        svgContainer!.style.position = "absolute";
        svgContainer!.style.width = "100%";
        svgContainer!.style.height = "100%";
        svgContainer!.style.top = "0";
        svgContainer!.style.left = "0";
        svgContainer!.style.zIndex = "-1";
        document.body.appendChild(svgContainer!);
      }

      if (svgContainer) {
        svgContainer.innerHTML = "";
        drawSVG(svgContainer);
        drawBoxEdges(
          minX,
          maxX,
          minY,
          maxY,
          minZ,
          maxZ,
          svgContainer,
          cameraRef.current
        );

        // Serialize and download the SVG
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgContainer);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "scatterplot.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        drawSVG();
        drawBoxEdges(
          minX,
          maxX,
          minY,
          maxY,
          minZ,
          maxZ,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
          svgContainer,
          cameraRef.current
        );
        // Serialize and download the SVG
        const serializer = new XMLSerializer();
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        const svgString = serializer.serializeToString(svgContainer);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "scatterplot.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
    return (
      <div className="relative h-full flex overflow-hidden">
        <div
          className={
            loading
              ? "absolute inset-0 z-30 flex justify-center items-center bg-opacity-50 bg-gray-300"
              : "hidden"
          }
        >
          <PropagateLoader color={"#0066bd"} size={30} loading={true} />
        </div>
        {legendRefFull}
        <div
          className="h-full w-full"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onClick={onClick}
          ref={containerRef}
        />
        <div className={isLegendOpen ? "inline z-10" : "hidden"}>
          {twoLegend && (
            <div className="flex absolute right-64 top-24">
              <ShapeLegend
                screenshot={false}
                shapeKey={shapeKey}
                shapeParamList={shapeParamList}
                shapeParam={shapeParam}
                setShapeParam={(param: string) => setShapeParam(param)}
                shapeList={shapeList}
              />
            </div>
          )}
          <div className="flex absolute right-0 top-32">
            <ColorLegend
              lightMode={lightMode}
              keyList={keyList}
              setListParam={(param: string) => setListParam(param)}
              screenshot={false}
              colorKey={colorKey}
              colorParamList={colorParamList}
              colorParam={colorParam}
              setColorParam={(param: string) => setColorParam(param)}
              colorList={colorList}
              setCustomFeatures={(list: string[]) => setCustomFeatures(list)}
              customizations={customFeatures}
            />
          </div>
        </div>
        <div
          className="absolute z-20"
          style={{
            top: controllerPosition.top,
            left: controllerPosition.left,
          }}
        >
          <Controller
            controllerShown={controllerShown}
            onVisualizeClicked={() =>
              onVisualizeClicked && onVisualizeClicked(entityName)
            }
            onCompareClicked={() =>
              onCompareClicked && onCompareClicked(entityName)
            }
          />
        </div>
        <div
          className={threeD ? "absolute z-0 left-0 bottom-16 flex" : "hidden"}
        >
          <div
            className="h-24 w-24"
            onClick={onClickMini}
            onPointerMove={onPointerMoveMini}
            ref={miniContainerRef}
          />
          <p className="absolute bottom-12 left-24 w-20">{axisName}</p>
        </div>
        <div className="flex absolute bottom-8 right-0 m-8 z-20">
          <div className="flex flex-col">
            {identifierName && (
              <p className={`${lightMode ? "text-black" : "text-white"}`}>
                ID: {identifierName}
              </p>
            )}
            {info && (
              <p className={`${lightMode ? "text-black" : "text-white"}`}>
                Label: {info}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ScatterBoard;
