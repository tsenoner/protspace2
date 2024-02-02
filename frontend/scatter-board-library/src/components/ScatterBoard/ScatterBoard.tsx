import React, {
  useRef,
  useEffect,
  useState,
  MutableRefObject,
  MouseEvent,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import html2canvas from "html2canvas";
import { useScreenshot, createFileName } from "use-react-screenshot";
import PropagateLoader from "react-spinners/PropagateLoader";
import Controller from "../Controller/Controller";
import { Item, truncate } from "../../helpers/data";
import ColorLegend from "../ColorLegend/ColorLegend";
import ShapeLegend from "../ShapeLegend/ShapeLegend";
import { ScatterBoardProps, ScatterBoardRef } from "./ScatterBoard.types";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

import "../../styles/tailwind.css";

const ScatterBoard = forwardRef<ScatterBoardRef, ScatterBoardProps>(
  (
    {
      cameraRef = useRef() as MutableRefObject<THREE.PerspectiveCamera>,
      setColorParam,
      setShapeParam,
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
      shapeList,
      setErrorMessage,
      onVisualizeClicked,
      onCompareClicked,
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
    const [controllerShown, setControllerShown] = useState(false);
    const [controllerPosition, setControllerPosition] = useState<{
      top?: string;
      left?: string;
    }>({});
    const [imageSrc, takeScreenshot] = useScreenshot();
    const [entityName, setEntityName] = useState("");
    const objArr = useRef([]);
    // const renderer = new THREE.WebGLRenderer({ antialias: true });

    const legendRefFull = (
      <div className="absolute h-full w-full -z-20" ref={legendRef}>
        <div className={"inline"}>
          {twoLegend && (
            <div className="flex absolute right-64">
              <ShapeLegend
                screenshot={true}
                shapeKey={shapeKey}
                shapeParamList={shapeParamList}
                shapeParam={shapeParam}
                setShapeParam={(param: string) => setShapeParam(param)}
                shapeList={shapeList}
              />
            </div>
          )}
          <div className="flex absolute right-0">
            <ColorLegend
              screenshot={true}
              colorKey={colorKey}
              colorParamList={colorParamList}
              colorParam={colorParam}
              setColorParam={(param: string) => setColorParam(param)}
              colorList={colorList}
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

    async function createScreenshot() {
      setLoading(true);
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
        if (isLegendOpen) {
          const legend = await html2canvas(legendRef.current, {
            backgroundColor: null,
          });

          const aspectRatio = legend.width / legend.height;

          let targetWidth = window.innerWidth;
          let targetHeight = window.innerHeight;

          if (width / height > aspectRatio) {
            targetWidth = height * aspectRatio;
          } else {
            targetHeight = width / aspectRatio;
          }

          // Calculate the position to center the image
          const xOffset = (width - targetWidth) / 2;
          const yOffset = (height - targetHeight) / 2;
          mergedContext.drawImage(
            legend,
            xOffset,
            yOffset,
            targetWidth,
            targetHeight
          );
        }
        a.href = mergedCanvas.toDataURL();
        a.download = createFileName(extension, name);
        a.click();
        setLoading(false);

        document.getElementById("mergedCanvas")?.remove();
        document.getElementById("a")?.remove();
        URL.revokeObjectURL(imageSrc);
      };
    };

    function updateSvgAxes(camera: any, renderer: any) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      const svgContainerRect = document
        .getElementById("svg-container")
        .getBoundingClientRect();

      function projectToScreen(
        obj: THREE.Object3D<THREE.Event>,
        camera: THREE.Camera,
        renderer: {
          context: { canvas: { clientWidth: number; clientHeight: number } };
        }
      ) {
        var vector = new THREE.Vector3();
        var widthHalf = 0.5 * window.innerWidth;
        var heightHalf = 0.5 * window.innerHeight;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = vector.x * widthHalf + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;

        return {
          x: vector.x + svgContainerRect.left,
          y: vector.y + svgContainerRect.top,
        };
      }

      // Create temporary Object3D for projection
      const tempObj = new THREE.Object3D();

      // Project the X axis endpoint
      tempObj.position.copy(new THREE.Vector3(20, 0, 0)); // X axis endpoint
      const xAxis2D = projectToScreen(tempObj, camera, renderer);

      // Project the Y axis endpoint
      tempObj.position.copy(new THREE.Vector3(0, 20, 0)); // Y axis endpoint
      const yAxis2D = projectToScreen(tempObj, camera, renderer);

      // Update SVG lines
      const xAxisSvg = document.getElementById("svg-x-axis");
      const yAxisSvg = document.getElementById("svg-y-axis");

      xAxisSvg?.setAttribute("x2", xAxis2D.x.toString());
      xAxisSvg?.setAttribute("y2", xAxis2D.y.toString());

      yAxisSvg?.setAttribute("x2", yAxis2D.x.toString());
      yAxisSvg?.setAttribute("y2", yAxis2D.y.toString());
    }
    let maxX = -Infinity,
      minX = Infinity,
      maxY = -Infinity,
      minY = Infinity,
      maxZ = -Infinity,
      minZ = Infinity;

    function createShape(
      twoLegend: boolean,
      path: string,
      coordinates: {
        x: number;
        y: number;
        z?: number;
      },
      colorInScene: string,
      opacity: number,
      userData: any
    ) {
      minX = Math.min(minX, coordinates.x);
      maxX = Math.max(maxX, coordinates.x);
      minY = Math.min(minY, coordinates.y);
      maxY = Math.max(maxY, coordinates.y);
      minZ = Math.min(minZ, coordinates.z ?? 0); // Assuming z can be optional
      maxZ = Math.max(maxZ, coordinates.z ?? 0);

      const loader = new SVGLoader();
      let group;
      // const divElement = document.createElement("div");
      // divElement.innerHTML = "Info about " + userData[dataItems[0].category];
      // divElement.style.background = "red";
      // divElement.className = "info-div"; // Add a class for styling
      // document.body.appendChild(divElement);
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

      // Create an SVG circle element
      const svgCircle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      // svgCircle.setAttribute("r", `${coordinates.z}`); // Radius of the circle
      svgCircle.setAttribute("cx", "100"); // Center the circle horizontally
      svgCircle.setAttribute("cy", "200"); // Center the circle vertically
      svgCircle.style.fill = userData.color; // Color from userData
      svgCircle.style.position = "absolute";
      svgContainer!.appendChild(svgCircle);

      loader.load(
        // resource URL
        path,
        // called when the resource is loaded
        function (data: any) {
          if (twoLegend) {
            const paths = data.paths;
            group = new THREE.Group();

            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];
              const material = new THREE.MeshBasicMaterial({
                transparent: true,
                color: colorInScene,
                side: THREE.FrontSide,
                depthTest: false,
                opacity: opacity,
              });

              const shapes = SVGLoader.createShapes(path);

              for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];
                const geometry = new THREE.ShapeGeometry(shape);
                // Apply scaling transformation to the geometry
                geometry.scale(0.01, 0.01, 1);

                const mesh = new THREE.Mesh(geometry, material);
                mesh.scale.y = -mesh.scale.y;
                mesh.userData = userData;
                group.add(mesh);
              }
            }
            group.position.set(
              coordinates.x,
              coordinates.y,
              coordinates.z ?? 0
            );
            group.rotation.set(0, 0, 0);
            sceneRef.current.add(group);
          } else {
            const geometry = new THREE.SphereGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({
              transparent: true,
              color: colorInScene,
              side: THREE.FrontSide,
              depthTest: false,
              opacity: opacity,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = userData;
            mesh.position.set(coordinates.x, coordinates.y, coordinates.z ?? 0);
            // objArr.current.push({ divObj: mesh, divElem: divElement });
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
            objArr.current.push({ divObj: mesh, svgElem: svgCircle });

            sceneRef.current.add(mesh);
          }
        }
      );
    }

    function calculateScaleFactor(distance: number) {
      // Simple linear scaling based on distance
      // You may need to adjust the formula to get the desired effect
      const minScale = 0.5; // Minimum scale at maximum distance
      const maxDistance = 50; // Adjust as per your scene's size
      return 1 - Math.min(distance / maxDistance, 1) * (1 - minScale);
    }

    useEffect(() => {
      colorReset();
    }, [data, colorParam, shapeParam, searchItems]);

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
          setEntityName(obj.userData[dataItems[0].category]);
          setControllerShown(true);
          return;
        }
      }
      setControllerShown(false);
    }

    function colorReset() {
      objArr.current.forEach((objData) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        let color = objData.divObj.userData.color;
        let opacity = 0.8;
        let svgOpacity = 1.0; // SVGs use a 0-1 range for opacity

        // Apply the same logic for determining color and opacity
        if (
          colorParam !== "" &&
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
          colorParam !== objData.divObj.userData[colorKey]
        ) {
          color = "#EEEEEE";
          opacity = 0.4;
          svgOpacity = 0.4;
        }
        if (
          shapeParam !== "" &&
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
          shapeParam !== objData.divObj.userData[shapeKey]
        ) {
          color = "#EEEEEE";
          opacity = 0.4;
          svgOpacity = 0.4;
        }
        if (
          searchItems.length &&
          !searchItems.find((item) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
            for (const key in objData.divObj.userData) {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
              if (item.name == objData.divObj.userData[key]) {
                return true;
              }
            }
            return false;
          })
        ) {
          color = "#EEEEEE";
          opacity = 0.4;
          svgOpacity = 0.4;
        }

        if (
          dataItems[0] &&
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
          objData.divObj.userData[dataItems[0].category] === entityName
        ) {
          color = "#FD1C03";
          opacity = 1;
          svgOpacity = 1.0;
        }

        // Update 3D object
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        objData.divObj.material.color.set(color);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        objData.divObj.material.opacity = opacity;

        // Update SVG element
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        objData.svgElem.style.fill = color;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        objData.svgElem.style.opacity = svgOpacity;
      });
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
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (
          obj instanceof THREE.Mesh &&
          obj.geometry.type !== "BufferGeometry"
        ) {
          obj.material.color.set("#16FF00");
          obj.material.opacity = 0.8;
          if (twoLegend) {
            setInfo(
              truncate(obj.userData[shapeKey], 30) +
                " " +
                truncate(obj.userData[colorKey], 30)
            );
          } else {
            obj.geometry.type !== "BufferGeometry" &&
              setInfo(
                obj.userData.identifier +
                  " | " +
                  truncate(obj.userData[colorKey], 30)
              );
          }
          break;
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

      return cubeEdges;

      // return cube;
    }

    useEffect(() => {
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

      var xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      var xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(20, 0, 0),
      ]);
      var xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);

      scene.add(xAxis);

      // Create the Y-axis line segment
      var yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      var yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 20, 0),
      ]);
      var yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
      scene.add(yAxis);

      if (threeD) {
        // Create the Z-axis line segment
        var zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
        var zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 20),
        ]);
        var zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
        scene.add(zAxis);
      }
      const middle = {
        x: 0,
        y: 0,
        z: 0,
      };
      let coordinates;
      let minX: number;
      let maxX: number;
      let minY: number;
      let maxY: number;
      let minZ: number;
      let maxZ: number;
      data.forEach(async (point: any, index: any) => {
        if (threeD) {
          if (technique === "umap") {
            coordinates = {
              x: point.x_umap_3D,
              y: point.y_umap_3D,
              z: point.z_umap_3D,
            };
          } else if (technique === "pca") {
            coordinates = {
              x: point.x_pca_3D,
              y: point.y_pca_3D,
              z: point.z_pca_3D,
            };
          } else {
            coordinates = {
              x: point.x_tsne_3D,
              y: point.y_tsne_3D,
              z: point.z_tsne_3D,
            };
          }
        } else {
          if (technique === "umap") {
            coordinates = {
              x: point.x_umap_3D,
              y: point.y_umap_3D,
            };
          } else if (technique === "pca") {
            coordinates = {
              x: point.x_pca_3D,
              y: point.x_pca_3D,
            };
          } else {
            coordinates = {
              x: point.x_tsne_2D,
              y: point.y_tsne_2D,
            };
          }
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

        let shape =
          shapeList[shapeParamList.indexOf(point[shapeKey]) % shapeList.length];

        let color =
          point[colorKey] === "NaN"
            ? "#9CB4CC"
            : colorList[
                colorParamList.indexOf(point[colorKey]) % colorList.length
              ];

        if (coordinates.x && coordinates.y) {
          let colorInScene = color;
          let opacity = 0.8;
          if (colorParam !== "" && colorParam !== point[colorKey]) {
            colorInScene = "#EEEEEE";
            opacity = 0.4;
          }
          if (shapeParam !== "" && shapeParam !== point[shapeKey]) {
            colorInScene = "#EEEEEE";
            opacity = 0.4;
          }
          if (
            searchItems.length &&
            !searchItems.find((item: Item) => {
              for (const key in point) {
                if (item.name == point[key]) {
                  return true;
                }
              }
              return false;
            })
          ) {
            colorInScene = "#EEEEEE";
            opacity = 0.4;
          }
          createShape(twoLegend, shape, coordinates, colorInScene, opacity, {
            color: color,
            index: index,
            ...point,
          });
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
          const cubeBig = createBigCube(minX, maxX, minY, maxY, minZ, maxZ);
          sceneRef.current.add(cubeBig);
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
      controls.minDistance = 10;
      controls.maxDistance = 50;
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

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        camera.position.copy(miniCamera.position);
        camera.rotation.copy(miniCamera.rotation);
        // if (cubeBig) {
        //   cubeBig.lookAt(camera.position);
        // }
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
    ]);

    // function downloadSVG() {
    //   updateSvgAxes(cameraRef.current, rendererRef.current);
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

    //   const svgContainer = document.getElementById("svg-container");
    //   if (!svgContainer) {
    //     console.error("SVG container not found");
    //     return;
    //   }
    //   // Serialize the SVG content
    //   const serializer = new XMLSerializer();
    //   const svgString = serializer.serializeToString(svgContainer);

    //   // Create a Blob from the SVG string
    //   const blob = new Blob([svgString], { type: "image/svg+xml" });

    //   // Create a download link
    //   const downloadLink = document.createElement("a");
    //   downloadLink.href = URL.createObjectURL(blob);
    //   downloadLink.download = "scatterplot.svg";

    //   // Append the link to the body, click it, and then remove it
    //   document.body.appendChild(downloadLink);
    //   downloadLink.click();
    //   document.body.removeChild(downloadLink);
    // }

    function drawSVG() {
      objArr.current.forEach(function (objData) {
        const proj = toScreenPosition(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
          objData.divObj,
          cameraRef.current

          // rendererRef.current
        );
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        objData.svgElem.setAttribute("cx", proj.x);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        objData.svgElem.setAttribute("cy", proj.y);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        const distance = objData.divObj.position.distanceTo(
          cameraRef.current.position
        );
        const scaleFactor = calculateScaleFactor(distance);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
        objData.svgElem.setAttribute("r", 5 * scaleFactor);
      });
    }

    function downloadSVG() {
      // Clear existing SVG content
      let svgContainer = document.getElementById("svg-container");
      // Function to project 3D coordinates to 2D
      function projectToScreen(obj3D: THREE.Vector3) {
        const vector = new THREE.Vector3();
        const widthHalf = 0.5 * window.innerWidth;
        const heightHalf = 0.5 * window.innerHeight;

        // Assuming obj3D is a THREE.Vector3 representing a position in 3D space
        vector.copy(obj3D);
        vector.project(cameraRef.current);

        vector.x = vector.x * widthHalf + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;

        return { x: vector.x, y: vector.y };
      }

      // Create and add SVG lines for axes
      const axesPoints = {
        x: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 0, 0)],
        y: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 20, 0)],
        z: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 20)],
      };
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'never'.
      Object.entries(axesPoints).forEach(([axis, points]) => {
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        const start = projectToScreen(points[0]);
        const end = projectToScreen(points[1]);

        line.setAttribute("x1", start.x.toString());
        line.setAttribute("y1", start.y.toString());
        line.setAttribute("x2", end.x.toString());
        line.setAttribute("y2", end.y.toString());
        line.style.stroke =
          axis === "x" ? "red" : axis === "y" ? "green" : "blue";
        line.style.strokeWidth = "2";

        // svgContainer!.appendChild(line);
      });

      // Create and add SVG circles for each 3D object
      drawSVG();

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
              screenshot={false}
              colorKey={colorKey}
              colorParamList={colorParamList}
              colorParam={colorParam}
              setColorParam={(param: string) => setColorParam(param)}
              colorList={colorList}
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
          className={threeD ? "absolute z-20 left-0 bottom-96 flex" : "hidden"}
        >
          <div
            className="h-24 w-24"
            onClick={onClickMini}
            onPointerMove={onPointerMoveMini}
            ref={miniContainerRef}
          />
          <p className="absolute bottom-12 left-24 w-20">{axisName}</p>
        </div>
        <div className="flex absolute bottom-12 right-0 m-8 z-20">
          <div>
            <p>{info}</p>
          </div>
        </div>
      </div>
    );
  }
);

export default ScatterBoard;
