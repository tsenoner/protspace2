import * as htmlToImage from "html-to-image";
import React, {
  MouseEvent,
  MutableRefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import Stats from "stats.js";
import * as THREE from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useScreenshot } from "use-react-screenshot";
import { Item } from "../../helpers/data";
import {
  createBigCube,
  createCube,
  downloadImage,
  drawBoxEdges,
} from "../../helpers/utils";
import "../../styles/tailwind.css";
import ColorLegend from "../ColorLegend/ColorLegend";
import Controller from "../Controller/Controller";
import ShapeLegend from "../ShapeLegend/ShapeLegend";
import { ScatterBoardProps, ScatterBoardRef } from "./ScatterBoard.types";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

var stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

interface CategoryMesh {
  mesh: THREE.InstancedMesh;
  count: number;
}

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
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const pointer = useMemo(() => new THREE.Vector2(), []);
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
    const categoryMeshes = useRef(new Map<string, CategoryMesh>());

    const legendRefFull = useMemo(
      () => (
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
      ),
      [
        keyList,
        colorKey,
        colorParamList,
        colorParam,
        colorList,
        setCustomFeatures,
        customFeatures,
        lightMode,
      ]
    );

    useImperativeHandle(ref, () => ({
      downloadScreenshot() {
        createScreenshot();
      },
      downloadSVG() {
        downloadSVG();
      },
    }));

    const removeObjectByName = useCallback((name: string) => {
      const selectedObject = sceneRef.current.getObjectByName(name);

      if (selectedObject) {
        sceneRef.current.remove(selectedObject);
      }
    }, []);

    const createScreenshot = useCallback(async () => {
      setLoading(true);
      htmlToImage
        // @ts-ignore
        .toPng(document.getElementById("pngFile"), { backgroundColor: "white" })
        .then(function (dataUrl) {
          downloadImage(
            dataUrl,
            {
              name: "legend",
            },
            setLoading
          );
        });
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const imageLegend = await takeScreenshot(rendererRef.current.domElement);
      await downloadImage(imageLegend, {}, setLoading);
    }, [takeScreenshot]);

    const calculateScaleFactor = useCallback((distance: number) => {
      const minScale = 0.5;
      const maxDistance = 60;
      return 1 - Math.min(distance / maxDistance, 1) * (1 - minScale);
    }, []);

    function toScreenPosition(position: THREE.Vector3, camera: THREE.Camera) {
      const widthHalf = 0.5 * window.innerWidth;
      const heightHalf = 0.5 * window.innerHeight;
      const vector =
        position.x !== 0 && position.y !== 0 && position.x !== undefined
          ? position.clone().project(camera)
          : position.clone();

      vector.x = vector.x * widthHalf + widthHalf;
      vector.y = -(vector.y * heightHalf) + heightHalf;

      return {
        x: vector.x,
        y: vector.y,
      };
    }

    const onClick = useCallback(
      (event: MouseEvent<HTMLElement>): void => {
        if (event.detail === 1) {
          setControllerShown(false);
          return;
        }
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerX = event.clientX - containerRect.left;
        const containerY = event.clientY - containerRect.top;
        setControllerPosition({
          top: containerY + "px",
          left: containerX + "px",
        });

        raycaster.setFromCamera(pointer, cameraRef.current);
        const intersects = raycaster.intersectObjects(
          sceneRef.current.children
        );
        for (let i = 0; i < intersects.length; i++) {
          const obj = intersects[i].object;
          if (
            obj instanceof THREE.Mesh &&
            obj.geometry.type !== "BufferGeometry"
          ) {
            obj.material.color.set("#FD1C03");
            obj.material.opacity = 1;
            setEntityName(obj.userData.identifier);
            setControllerShown(true);
            return;
          }
        }
        setControllerShown(false);
      },
      [raycaster, pointer]
    );

    const parseHex = useCallback((hex: string | any[]) => {
      let colorCode = hex.slice(0, 7);
      let opacity = 1;

      if (hex.length === 9) {
        let opacityHex = hex.slice(7, 9);
        // @ts-ignore
        opacity = parseInt(opacityHex, 16) / 255;
      }

      return { colorCode, opacity };
    }, []);

    const matrixPool = new Array(10000)
      .fill(null)
      .map(() => new THREE.Matrix4());
    let poolIndex = 0;

    const getMatrix = () => {
      if (poolIndex >= matrixPool.length) poolIndex = 0;
      return matrixPool[poolIndex++];
    };

    // Convert instanceUserData to a typed array
    const convertToTypedArray = (instanceUserData: any[]) => {
      const array = new Float32Array(instanceUserData.length * 3);
      instanceUserData.forEach((data, i) => {
        array[i * 3] = parseFloat(data.coordinates.x || 0);
        array[i * 3 + 1] = parseFloat(data.coordinates.y || 0);
        array[i * 3 + 2] = parseFloat(data.coordinates.z || 0);
      });
      return array;
    };

    const updateVisibility = useCallback(
      (keyToRemove: string | null, onlyShowKey: string | null = null) => {
        categoryMeshes.current.forEach((categoryMesh, key) => {
          if (onlyShowKey) {
            categoryMesh.mesh.visible = key === onlyShowKey;
          } else if (keyToRemove) {
            categoryMesh.mesh.visible = key !== keyToRemove;
          } else {
            categoryMesh.mesh.visible = true;
          }
        });
        rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      },
      []
    );

    const colorReset = () => {
      if (colorParam) {
        updateVisibility(colorParam);
      } else {
        updateVisibility(null);
      }
      // objArr.current.forEach((objData: any) => {
      //   const mesh = objData.divObj as THREE.InstancedMesh;
      //   const colorInstance = new THREE.Color();
      //   mesh.setColorAt(0, colorInstance.set(objData.color));
      //   // Check if the mesh has the instanceColor attribute
      //   if (!mesh.instanceColor) {
      //     console.error("InstanceColor attribute is missing");
      //     return;
      //   }

      //   // Iterate over each instance's userData
      //   mesh.userData.instanceUserData.forEach(
      //     (instanceUserData: any, index: number) => {
      //       let color = new THREE.Color(instanceUserData.color.slice(0, 7));
      //       let opacity =
      //         parseInt(instanceUserData.color.slice(7, 9), 16) / 255 || 0.8;
      //       let svgOpacity = 1.0;

      //       const customization = customFeatures.find(
      //         (feature: {
      //           featureName: any;
      //           customName: any;
      //           category: string;
      //         }) =>
      //           feature.featureName === instanceUserData.features[colorKey] &&
      //           feature.category === colorKey
      //       );

      //       if (
      //         colorParam !== "" &&
      //         colorParam !== instanceUserData.features[colorKey]
      //       ) {
      //         color.set("#EEEEEE");
      //         opacity = 0.4;
      //         svgOpacity = 0.4;
      //       }

      //       const isMatched = searchItems.some((item) => {
      //         return Object.values(instanceUserData.features).includes(
      //           item.name
      //         );
      //       });

      //       if (isMatched) {
      //         color.set(
      //           customization ? customization.color : instanceUserData.color
      //         );
      //       } else if (searchItems.length) {
      //         color.set("#EEEEEE");
      //         opacity = 0.4;
      //         svgOpacity = 0.4;
      //       }

      //       if (
      //         dataItems[0] &&
      //         instanceUserData.features[dataItems[0].category] === entityName
      //       ) {
      //         color.set("#0400ff");
      //         opacity = 1;
      //         svgOpacity = 1.0;
      //       }

      //       if (customization) {
      //         const isCustomizationIncludeSearch = searchItems.some((item) => {
      //           return Object.values(customization).includes(item.name);
      //         });
      //         if (isCustomizationIncludeSearch) {
      //           color.set(customization.color);
      //           opacity = 1;
      //         }
      //       }

      //       mesh.setColorAt(index, colorInstance.set(color));
      //     }
      //   );

      //   // Ensure instanceColor is updated
      //   mesh.instanceColor.needsUpdate = true;
      // });

      rendererRef.current &&
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    useEffect(() => {
      colorReset();
    }, [data, colorParam, searchItems, dataItems]);

    const throttle = (func: (...args: any[]) => void, limit: number) => {
      let inThrottle: boolean;
      return function (...args: any[]) {
        if (!inThrottle) {
          // @ts-ignore
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const onPointerMove = useCallback(
      throttle((event: { clientX: number; clientY: number }) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, cameraRef.current);

        const intersects = raycaster.intersectObjects(
          sceneRef.current.children
        );
        let newInfo = "";
        let newIdentifierName = "";

        for (let i = 0; i < intersects.length; i++) {
          const intersection = intersects[i];
          const obj = intersection.object;

          if (obj instanceof THREE.InstancedMesh) {
            const instanceId = intersection.instanceId;
            if (instanceId !== undefined) {
              // const color = new THREE.Color(0x16ff00); // green color
              // obj.setColorAt(instanceId, color);
              // obj.instanceColor!.needsUpdate = true;
              const userData = obj.userData.instanceUserData[instanceId];
              const customFeature = customFeatures.find(
                (feature: { featureName: any }) =>
                  feature.featureName === userData.features[colorKey]
              );
              if (customFeature) {
                newInfo = customFeature.customName;
              } else {
                newInfo = userData.features[colorKey];
              }
              newIdentifierName = userData.identifier;
              break; // exit loop early as we only need the first intersection
            }
          }
        }

        setInfo(newInfo);
        setIdentifierName(newIdentifierName);
      }, 50),
      [raycaster, pointer, customFeatures, colorKey]
    );
    const onPointerDown = useCallback(() => {
      setEntityName("");
      setControllerShown(false);
    }, []);

    const onClickMini = useCallback(
      (event: { clientX: number; clientY: number }) => {
        const miniContainerRect =
          miniContainerRef.current.getBoundingClientRect();

        const containerX = event.clientX - miniContainerRect.left;
        const containerY = event.clientY - miniContainerRect.top;

        pointer.x = (containerX / miniContainerRect.width) * 2 - 1;
        pointer.y = -(containerY / miniContainerRect.height) * 2 + 1;

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
      },
      [raycaster, pointer]
    );

    const onPointerMoveMini = useCallback(
      (event: { clientX: number; clientY: number }) => {
        const miniContainerRect =
          miniContainerRef.current.getBoundingClientRect();

        const containerX = event.clientX - miniContainerRect.left;
        const containerY = event.clientY - miniContainerRect.top;

        pointer.x = (containerX / miniContainerRect.width) * 2 - 1;
        pointer.y = -(containerY / miniContainerRect.height) * 2 + 1;

        miniSceneRef.current.traverse((obj: any) => {
          if (obj instanceof THREE.Line || obj instanceof THREE.Mesh) {
            obj.material.color.set(obj.userData.color);
          }
        });
        raycaster.setFromCamera(pointer, miniCameraRef.current);

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
      },
      [raycaster, pointer]
    );

    const getFeatureColor = (
      featureValue: string,
      customFeatures: any[],
      colorList: string[],
      colorParamList: string[]
    ): string => {
      const customization = customFeatures.find(
        (c) => c.featureName === featureValue && c.category === colorKey
      );
      if (customization && customization.color) {
        return customization.color;
      }

      const index = colorParamList.indexOf(featureValue);
      if (index !== -1) {
        return colorList[index];
      }

      return "#ff0000";
    };

    const scalePoint = (
      point: number,
      min: number,
      max: number,
      newMin: number,
      newMax: number
    ) => {
      const result = ((point - min) / (max - min)) * (newMax - newMin) + newMin;
      return result;
    };

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
      scene.background = lightMode
        ? new THREE.Color(0xffffff)
        : new THREE.Color(0x2e2e3a);
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      let light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.setScalar(1);
      scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

      const renderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
      });
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

      data.forEach((point: any) => {
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

      data.forEach((point: any) => {
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

        const scaledX = scalePoint(coordinates.x, minX, maxX, -40, 40);

        const scaledY = scalePoint(coordinates.y, minY, maxY, -40, 40);
        const scaledZ = threeD
          ? scalePoint(coordinates.z || 0, minZ, maxZ, -40, 40)
          : 0;

        localMinX = Math.min(localMinX ?? Infinity, scaledX);
        localMaxX = Math.max(localMaxX ?? -Infinity, scaledX);
        localMinY = Math.min(localMinY ?? Infinity, scaledY);
        localMaxY = Math.max(localMaxY ?? -Infinity, scaledY);
        localMinZ = Math.min(localMinZ ?? Infinity, scaledZ ?? 0);
        localMaxZ = Math.max(localMaxZ ?? -Infinity, scaledZ ?? 0);
      });
      var colorInScene = "";
      data.forEach((point: any, index: any) => {
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
        // let color = getFeatureColor(
        //   point.features[colorKey],
        //   customFeatures,
        //   colorList,
        //   colorParamList
        // );

        if (point.coordinates.x && point.coordinates.y) {
          colorInScene = "#FF0000";
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

          const scalePoint = (
            point: number,
            min: number,
            max: number,
            newMin: number,
            newMax: number
          ) => {
            const result =
              ((point - min) / (max - min)) * (newMax - newMin) + newMin;
            return result;
          };

          const maxExtent = 40;

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
                coordinates.z || 0,
                minZ,
                maxZ,
                -((deltaZ / maxDelta) * maxExtent),
                (deltaZ / maxDelta) * maxExtent
              )
            : 0;

          scaledCoordinates.x = scaledX;
          scaledCoordinates.y = scaledY;
          scaledCoordinates.z = scaledZ;
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

      const controls = new OrbitControls(camera, renderer.domElement);
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

      const loadVisibleData = (camera: THREE.PerspectiveCamera): void => {
        // Remove existing meshes from the scene
        categoryMeshes.current.forEach((meshData) => {
          sceneRef.current?.remove(meshData.mesh);
        });

        // Create new meshes
        const newMeshes = createShape(
          data,
          colorInScene,
          data.length,
          colorList,
          customFeatures,
          colorParamList,
          colorKey,
          minX,
          maxX,
          minY,
          maxY,
          minZ,
          maxZ,
          threeD
        );

        // Clear existing meshes
        categoryMeshes.current.clear();
        // Add new meshes to the scene and update categoryMeshes
        newMeshes.forEach((meshData, key) => {
          categoryMeshes.current.set(key, meshData);
          sceneRef.current?.add(meshData.mesh);
        });

        // Update existing meshes
        updateExistingMeshes();

        // Render the scene
        rendererRef.current?.render(sceneRef.current!, camera);
      };

      const updateExistingMeshes = () => {
        categoryMeshes.current.forEach((categoryMesh, key) => {
          // Update material color
          const newColor = getFeatureColor(
            key,
            customFeatures,
            colorList,
            colorParamList
          );
          (categoryMesh.mesh.material as THREE.MeshBasicMaterial).color.set(
            newColor
          );

          // Update visibility based on the current state
          const isVisible = shouldBeVisible(key);
          categoryMesh.mesh.visible = isVisible;
        });
      };

      // Helper function to determine if a category should be visible
      const shouldBeVisible = (category: string): boolean => {
        return true;
      };

      // Call loadVisibleData
      loadVisibleData(camera);

      if (!threeD) {
        controls.enableRotate = false;
        controls.enablePan = true;
      }
      let previousDistance = controls.target.distanceTo(
        controls.object.position
      );

      const updateMesh = (mesh: THREE.InstancedMesh) => {
        const colorInstance = new THREE.Color();
        for (let i = 0; i < mesh.count; i++) {
          const userData = mesh.userData.instanceUserData[i];
          let newColor = getFeatureColor(
            userData.features[colorKey],
            customFeatures,
            colorList,
            colorParamList
          );
          mesh.setColorAt(i, colorInstance.set(newColor));
        }
        mesh.instanceColor!.needsUpdate = true;
      };

      const animate = () => {
        stats.begin();

        requestAnimationFrame(animate);
        camera.position.copy(miniCamera.position);
        camera.rotation.copy(miniCamera.rotation);
        controls.update();
        // if (shapeMesh) {
        //   updateMesh(shapeMesh);
        // }
        const currentDistance = controls.target.distanceTo(
          controls.object.position
        );

        previousDistance = currentDistance;

        // sceneRef.current.traverse((obj: any) => {
        //   if (obj instanceof THREE.Mesh) {
        //     obj.lookAt(obj.position.clone().add(camera.position));
        //   }
        // });
        renderer.render(scene, camera);
        stats.end();
      };

      const animateMini = () => {
        requestAnimationFrame(animateMini);
        miniCamera.position.copy(camera.position);
        miniCamera.rotation.copy(camera.rotation);

        miniControls.update();
        miniRenderer.render(miniScene, miniCamera);
      };
      animateMini();

      animate();

      return () => {
        // if (shapeMesh) {
        //   sceneRef.current.remove(shapeMesh);
        //   shapeMesh.geometry.dispose();
        // }
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
    ]);

    const drawSVG = useCallback(
      (svgContainer?: HTMLElement | null) => {
        objArr.current.forEach(function (objData) {
          const svgCircle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          // @ts-ignore
          const instanceMesh = objData.divObj;
          // @ts-ignore
          const instanceId = objData.instanceId; // Assuming instanceId is stored in objData

          if (!(instanceMesh instanceof THREE.Object3D)) {
            console.error(
              "objData.divObj is not an instance of THREE.Object3D"
            );
            return;
          }
          // @ts-ignore
          const matrixWorld = instanceMesh.instanceMatrix;
          const position = new THREE.Vector3();
          const matrix = new THREE.Matrix4();
          matrix.fromArray(matrixWorld.array, instanceId * 16);
          position.setFromMatrixPosition(matrix);

          svgCircle.setAttribute("cx", "100");
          svgCircle.setAttribute("cy", "200");

          svgCircle.style.fill = instanceMesh.userData.color;
          svgCircle.style.position = "absolute";

          const proj = toScreenPosition(position, cameraRef.current);
          svgCircle.setAttribute("cx", proj.x.toString());
          svgCircle.setAttribute("cy", proj.y.toString());

          const distance = position.distanceTo(cameraRef.current.position);
          const scaleFactor = calculateScaleFactor(distance);
          svgCircle.setAttribute("r", (5 * scaleFactor).toString());
          svgContainer!.appendChild(svgCircle);
        });
      },
      [calculateScaleFactor, toScreenPosition]
    );

    const downloadSVG = useCallback(() => {
      let svgContainer = document.getElementById("svg-container");
      if (!svgContainer) {
        // @ts-ignore
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
          cameraRef.current,
          toScreenPosition
        );

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
          // @ts-ignore
          svgContainer,
          cameraRef.current,
          toScreenPosition
        );
        const serializer = new XMLSerializer();
        // @ts-ignore
        const svgString = serializer.serializeToString(svgContainer);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "scatterplot.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }, [drawSVG, drawBoxEdges, minX, maxX, minY, maxY, minZ, maxZ]);

    const createShape = useCallback(
      (
        cluster: any,
        color: string,
        length: number,
        _colorList: string[],
        _customFeatures: any[],
        _colorParamList: string[],
        _colorKey: string,
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        minZ: number,
        maxZ: number,
        isThreeD: boolean
      ): Map<string, { mesh: THREE.InstancedMesh; count: number }> => {
        const newCategoryMeshes = new Map<
          string,
          { mesh: THREE.InstancedMesh; count: number }
        >();
        const geometry = new THREE.SphereGeometry(0.3);

        const maxExtent = 40;
        const deltaX = maxX - minX;
        const deltaY = maxY - minY;
        const deltaZ = maxZ - minZ;
        const maxDelta = Math.max(deltaX, deltaY, deltaZ);

        // Count instances per category
        const categoryCounts = new Map<string, number>();
        for (let i = 0; i < length; i++) {
          const point = cluster[i];
          const categoryKey = point.features[_colorKey];
          categoryCounts.set(
            categoryKey,
            (categoryCounts.get(categoryKey) || 0) + 1
          );
        }

        // Create meshes
        categoryCounts.forEach((count, categoryKey) => {
          const material = new THREE.MeshBasicMaterial({
            transparent: true,
            color: new THREE.Color(
              getFeatureColor(
                categoryKey,
                _customFeatures,
                _colorList,
                _colorParamList
              )
            ),
            opacity: 1,
          });
          const mesh = new THREE.InstancedMesh(geometry, material, count);
          // @ts-ignore
          objArr.current.push({ divObj: mesh });
          mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
          mesh.userData.instanceUserData = [];
          newCategoryMeshes.set(categoryKey, { mesh, count: 0 });
        });

        // Set instance matrices and user data
        for (let i = 0; i < length; i++) {
          const point = cluster[i];
          const categoryKey = point.features[_colorKey];
          const meshData = newCategoryMeshes.get(categoryKey)!;

          const scaledX = scalePoint(
            parseFloat(point.coordinates.x),
            minX,
            maxX,
            -((deltaX / maxDelta) * maxExtent),
            (deltaX / maxDelta) * maxExtent
          );
          const scaledY = scalePoint(
            parseFloat(point.coordinates.y),
            minY,
            maxY,
            -((deltaY / maxDelta) * maxExtent),
            (deltaY / maxDelta) * maxExtent
          );
          const scaledZ = isThreeD
            ? scalePoint(
                parseFloat(point.coordinates.z) || 0,
                minZ,
                maxZ,
                -((deltaZ / maxDelta) * maxExtent),
                (deltaZ / maxDelta) * maxExtent
              )
            : 0;

          const dummyObject = new THREE.Object3D();
          dummyObject.position.set(scaledX, scaledY, scaledZ);
          dummyObject.updateMatrix();
          meshData.mesh.setMatrixAt(meshData.count, dummyObject.matrix);

          // Set user data for this instance
          meshData.mesh.userData.instanceUserData.push({
            ...point,
            identifier: point.identifier,
            features: point.features,
            color: getFeatureColor(
              categoryKey,
              _customFeatures,
              _colorList,
              _colorParamList
            ),
            coordinates: { x: scaledX, y: scaledY, z: scaledZ },
          });

          meshData.count++;
        }
        newCategoryMeshes.forEach((meshData) => {
          meshData.mesh.instanceMatrix.needsUpdate = true;
        });

        return newCategoryMeshes;
      },
      []
    );

    const onColorKeyDoubleClick = (
      selectedColorKey: string | null | undefined
    ) => {
      updateVisibility(null, selectedColorKey);
    };

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
              onDoubleClick={onColorKeyDoubleClick}
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
