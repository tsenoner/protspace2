import * as htmlToImage from 'html-to-image';
import {
  MouseEvent,
  MutableRefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import Stats from 'stats.js';
import * as THREE from 'three';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useScreenshot } from 'use-react-screenshot';
import { createBigCube, createCube, downloadImage, drawBoxEdges } from '../../helpers/utils';
import '../../styles/tailwind.css';
import ColorLegend from '../ColorLegend/ColorLegend';
import Controller from '../Controller/Controller';
import ShapeLegend from '../ShapeLegend/ShapeLegend';
import { ScatterBoardProps, ScatterBoardRef } from './ScatterBoard.types';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const stats = new Stats();
stats.showPanel(1);
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
      customFeatures
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
    const [axisName, setAxisName] = useState('');
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const pointer = useMemo(() => new THREE.Vector2(), []);
    const [info, setInfo] = useState('');
    const [identifierName, setIdentifierName] = useState('');
    const [controllerShown, setControllerShown] = useState(false);
    const [controllerPosition, setControllerPosition] = useState<{
      top?: string;
      left?: string;
    }>({});
    const takeScreenshot = useScreenshot();
    const [entityName, setEntityName] = useState('');
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
          <div className={'inline'}>
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
        lightMode
      ]
    );

    useImperativeHandle(ref, () => ({
      downloadScreenshot() {
        createScreenshot();
      },
      downloadSVG() {
        downloadSVG();
      }
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
        .toPng(document.getElementById('pngFile') as HTMLElement, { backgroundColor: 'white' })
        .then(function (dataUrl) {
          downloadImage(
            dataUrl,
            {
              name: 'legend'
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
        y: vector.y
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
          top: containerY + 'px',
          left: containerX + 'px'
        });

        raycaster.setFromCamera(pointer, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children);

        if (intersects.length > 0) {
          const intersection = intersects[0];
          const obj = intersection.object;

          if (obj instanceof THREE.InstancedMesh) {
            const instanceId = intersection.instanceId;
            if (instanceId !== undefined) {
              const clickedColor = new THREE.Color(0xfd1c03);
              const defaultColor = new THREE.Color(0xffffff);

              // Reset all instances to the default color
              for (let j = 0; j < obj.count; j++) {
                obj.setColorAt(j, defaultColor);
              }

              // Set the clicked instance to red
              obj.setColorAt(instanceId, clickedColor);
              obj.instanceColor!.needsUpdate = true;

              const userData = obj.userData.instanceUserData[instanceId];
              setEntityName(userData.identifier);
              setControllerShown(true);
              return;
            }
          }
        }

        // If we reach here, it means no point was clicked
        // Reset all InstancedMesh objects to default color
        sceneRef.current.children.forEach((child) => {
          if (child instanceof THREE.InstancedMesh) {
            const defaultColor = new THREE.Color(0xffffff);
            for (let j = 0; j < child.count; j++) {
              child.setColorAt(j, defaultColor);
            }
            child.instanceColor!.needsUpdate = true;
          }
        });

        setEntityName('');
        setControllerShown(false);
      },
      [raycaster, pointer]
    );

    const updateVisibility = useCallback(
      (categoriesToHide: string) => {
        const categoriesToHideArray = categoriesToHide ? categoriesToHide.split(',') : [];

        const searchCategories = new Set(searchItems.map((item) => item.name));
        categoryMeshes.current.forEach((categoryMesh, key) => {
          const isNotHidden = !categoriesToHideArray.includes(key);
          const isSearched = searchItems.length === 0 || searchCategories.has(key);

          categoryMesh.mesh.visible = isNotHidden && isSearched;
        });

        rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      },
      [searchItems]
    );

    useEffect(() => {
      updateVisibility(colorParam);
    }, [updateVisibility, colorParam, data, searchItems, dataItems]);

    const throttle = (func: (...args: any[]) => void, limit: number) => {
      let inThrottle: boolean;
      return function (this: any, ...args: any[]) {
        if (!inThrottle) {
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

        const intersects = raycaster.intersectObjects(sceneRef.current.children);
        let newInfo = '';
        let newIdentifierName = '';

        for (let i = 0; i < intersects.length; i++) {
          const intersection = intersects[i];
          const obj = intersection.object;

          if (obj instanceof THREE.InstancedMesh) {
            const instanceId = intersection.instanceId;
            if (instanceId !== undefined) {
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
              break;
            }
          }
        }

        setInfo(newInfo);
        setIdentifierName(newIdentifierName);
      }, 50),
      [raycaster, pointer, customFeatures, colorKey]
    );
    const onPointerDown = useCallback(() => {
      setEntityName('');
      setControllerShown(false);
    }, []);

    const onClickMini = useCallback(
      (event: { clientX: number; clientY: number }) => {
        const miniContainerRect = miniContainerRef.current.getBoundingClientRect();

        const containerX = event.clientX - miniContainerRect.left;
        const containerY = event.clientY - miniContainerRect.top;

        pointer.x = (containerX / miniContainerRect.width) * 2 - 1;
        pointer.y = -(containerY / miniContainerRect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, miniCameraRef.current);

        const intersects = raycaster.intersectObjects(miniSceneRef.current.children);

        for (let i = 0; i < intersects.length; i++) {
          const obj = intersects[i].object;
          if (obj instanceof THREE.Mesh) {
            if (obj.userData.name === 'XY Plane') {
              miniCameraRef.current.position.set(0, 0, 30);
              cameraRef.current.position.set(0, 0, 30);
            } else if (obj.userData.name === 'YZ Plane') {
              miniCameraRef.current.position.set(30, 0, 0);
              cameraRef.current.position.set(30, 0, 0);
            } else if (obj.userData.name === 'XZ Plane') {
              miniCameraRef.current.position.set(0, 30, 0);
              cameraRef.current.position.set(0, 30, 0);
            }
            controlsRef.current.update();
            miniControlsRef.current.update();
            return;
          } else {
            if (obj.userData.name === 'X Axis') {
              miniCameraRef.current.position.set(30, 0, 0);
              cameraRef.current.position.set(30, 0, 0);
            } else if (obj.userData.name === 'Y Axis') {
              miniCameraRef.current.position.set(0, 30, 0);
              cameraRef.current.position.set(0, 30, 0);
            } else if (obj.userData.name === 'Z Axis') {
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
        const miniContainerRect = miniContainerRef.current.getBoundingClientRect();

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

        const intersects = raycaster.intersectObjects(miniSceneRef.current.children);
        let name = '';
        for (let i = 0; i < intersects.length; i++) {
          const obj = intersects[i].object;
          if (obj instanceof THREE.Line || obj instanceof THREE.Mesh) {
            obj.material.color.set('#16FF00');
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
      } else {
        if (featureValue === 'NaN') {
          return '#000000';
        }
      }

      const index = colorParamList.indexOf(featureValue);
      if (index !== -1) {
        return colorList[index];
      }

      return '#ff0000';
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

      const xAxisMaterialMini = new THREE.LineBasicMaterial({
        color: '#C2DEDC',
        linewidth: 3
      });
      const xAxisGeometryMini = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(20, 0, 0)
      ]);
      const xAxisMini = new THREE.Line(xAxisGeometryMini, xAxisMaterialMini);
      xAxisMini.userData.name = 'X Axis';
      xAxisMini.userData.color = '#C2DEDC';
      miniScene.add(xAxisMini);

      const yAxisMaterialMini = new THREE.LineBasicMaterial({
        color: '#ECE5C7',
        linewidth: 3
      });
      const yAxisGeometryMini = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 20, 0)
      ]);
      const yAxisMini = new THREE.Line(yAxisGeometryMini, yAxisMaterialMini);
      yAxisMini.userData.name = 'Y Axis';
      yAxisMini.userData.color = '#ECE5C7';
      miniScene.add(yAxisMini);

      const zAxisMaterialMini = new THREE.LineBasicMaterial({
        color: '#CDC2AE',
        linewidth: 3
      });
      const zAxisGeometryMini = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 20)
      ]);
      const zAxisMini = new THREE.Line(zAxisGeometryMini, zAxisMaterialMini);
      zAxisMini.userData.name = 'Z Axis';
      zAxisMini.userData.color = '#CDC2AE';
      miniScene.add(zAxisMini);

      const cubeSize = 6;
      const cubeColor = 0xff0000;
      const cube = createCube(cubeSize, cubeColor);
      miniScene.add(cube);
      miniContainerRef.current.appendChild(miniRenderer.domElement);

      miniCamera.position.z = 30;

      const scene = new THREE.Scene();
      scene.background = lightMode ? new THREE.Color(0xffffff) : new THREE.Color(0x2e2e3a);
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.setScalar(1);
      scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

      const renderer = new THREE.WebGLRenderer({
        powerPreference: 'high-performance'
      });
      sceneRef.current = scene;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const middle = {
        x: 0,
        y: 0,
        z: 0
      };
      let coordinates: {
        x: number;
        y: number;
        z?: number;
      } = {
        x: 0,
        y: 0,
        z: 0
      };
      let minX: number = Infinity;
      let maxX: number = -Infinity;
      let minY: number = Infinity;
      let maxY: number = -Infinity;
      let minZ: number = Infinity;
      let maxZ: number = -Infinity;

      data.forEach((point: any) => {
        if (threeD) {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
            z: point.coordinates.z
          };
        } else {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y
          };
        }
        if (
          // eslint-disable-next-line no-constant-binary-expression
          (typeof coordinates.x === 'undefined') == undefined ||
          typeof coordinates.y === 'undefined'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          setErrorMessage &&
            setErrorMessage('Could not find the coordinates. Please check the CSV file.');
          return;
        }

        minX = Math.min(minX ?? Infinity, coordinates.x);
        maxX = Math.max(maxX ?? -Infinity, coordinates.x);
        minY = Math.min(minY ?? Infinity, coordinates.y);
        maxY = Math.max(maxY ?? -Infinity, coordinates.y);
        minZ = Math.min(minZ ?? Infinity, coordinates.z ?? 0);
        maxZ = Math.max(maxZ ?? -Infinity, coordinates.z ?? 0);
      });

      let localMinX = Infinity;
      let localMaxX = -Infinity;
      let localMinY = Infinity;
      let localMaxY = -Infinity;
      let localMinZ = Infinity;
      let localMaxZ = -Infinity;

      const scaledCoordinates: {
        x: number;
        y: number;
        z?: number;
      } = {
        x: 0,
        y: 0,
        z: 0
      };

      data.forEach((point: any) => {
        if (threeD) {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
            z: point.coordinates.z
          };
        } else {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y
          };
        }
        if (
          // eslint-disable-next-line no-constant-binary-expression
          (typeof coordinates.x === 'undefined') == undefined ||
          typeof coordinates.y === 'undefined'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          setErrorMessage &&
            setErrorMessage('Could not find the coordinates. Please check the CSV file.');
          return;
        }

        const scaledX = scalePoint(coordinates.x, minX, maxX, -40, 40);

        const scaledY = scalePoint(coordinates.y, minY, maxY, -40, 40);
        const scaledZ = threeD ? scalePoint(coordinates.z || 0, minZ, maxZ, -40, 40) : 0;

        localMinX = Math.min(localMinX ?? Infinity, scaledX);
        localMaxX = Math.max(localMaxX ?? -Infinity, scaledX);
        localMinY = Math.min(localMinY ?? Infinity, scaledY);
        localMaxY = Math.max(localMaxY ?? -Infinity, scaledY);
        localMinZ = Math.min(localMinZ ?? Infinity, scaledZ ?? 0);
        localMaxZ = Math.max(localMaxZ ?? -Infinity, scaledZ ?? 0);
      });

      data.forEach((point: any, index: any) => {
        if (threeD) {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y,
            z: point.coordinates.z
          };
        } else {
          coordinates = {
            x: point.coordinates.x,
            y: point.coordinates.y
          };
        }
        if (
          // eslint-disable-next-line no-constant-binary-expression
          (typeof point.coordinates.x === 'undefined') == undefined ||
          typeof point.coordinates.y === 'undefined'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          setErrorMessage &&
            setErrorMessage('Could not find the coordinates. Please check the CSV file.');
          return;
        }

        if (point.coordinates.x && point.coordinates.y) {
          // if (
          //   searchItems.length &&
          //   !searchItems.find((item: Item) => {
          //     for (const key in point.features) {
          //       if (item.name == point.features[key]) {
          //         return true;
          //       }
          //     }
          //     return false;
          //   })
          // ) {
          //   colorInScene = '#EEEEEE';
          // }

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

          const maxExtent = 40;

          const deltaX = maxX - minX;
          const deltaY = maxY - minY;
          const deltaZ = maxZ - minZ;
          const maxDelta = Math.max(deltaX, deltaY, deltaZ);

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
          removeObjectByName('cube');
        }
      });

      middle.x /= data.length;
      middle.y /= data.length;
      middle.z /= data.length;
      if (cameraPosition) {
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);
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
      const miniControls = new OrbitControls(miniCamera, miniRenderer.domElement);
      controlsRef.current = controls;
      miniControlsRef.current = miniControls;
      miniControls.enableRotate = true;
      miniControls.enableDamping = true;

      controls.enableZoom = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enablePan = true;
      controls.maxDistance = 200;

      const loadVisibleData = async (camera: THREE.PerspectiveCamera): Promise<void> => {
        // Remove existing meshes from the scene
        categoryMeshes.current.forEach((meshData) => {
          sceneRef.current?.remove(meshData.mesh);
        });

        // Create new meshes
        const newMeshes = await createShape(
          data,
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
          threeD,
          false
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
        if (colorParam) {
          updateVisibility(colorParam);
        }
        // Render the scene
        rendererRef.current?.render(sceneRef.current!, camera);
      };

      function hexToRGBA(hex: string) {
        // Remove the '#' if it's there
        hex = hex.replace('#', '');

        // Extract the RGB values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Extract the alpha value (if present)
        let a = 1;
        if (hex.length === 8) {
          a = parseInt(hex.substring(6, 8), 16) / 255;
        }

        return { r: r / 255, g: g / 255, b: b / 255, a: a };
      }

      const updateExistingMeshes = () => {
        categoryMeshes.current.forEach((categoryMesh, key) => {
          // Update material color
          const newColor = getFeatureColor(key, customFeatures, colorList, colorParamList);

          const rgbaColor = hexToRGBA(newColor);
          // Update the material
          if (!(categoryMesh.mesh.material instanceof THREE.MeshBasicMaterial)) {
            categoryMesh.mesh.material = new THREE.MeshBasicMaterial();
          }
          const material = categoryMesh.mesh.material as THREE.MeshBasicMaterial;
          if (newColor.length >= 8) {
            material.color.setRGB(rgbaColor.r, rgbaColor.g, rgbaColor.b);
            material.opacity = rgbaColor.a;
            material.transparent = rgbaColor.a < 1;
          } else {
            material.color.set(newColor);
          }
          // Update visibility based on the current state
          const isVisible = shouldBeVisible();
          categoryMesh.mesh.visible = isVisible;
        });
      };

      const shouldBeVisible = (): boolean => {
        // For now return true
        return true;
      };

      loadVisibleData(camera);

      if (!threeD) {
        controls.enableRotate = false;
        controls.enablePan = true;
      }

      const animate = () => {
        stats.begin();

        requestAnimationFrame(animate);
        camera.position.copy(miniCamera.position);
        camera.rotation.copy(miniCamera.rotation);
        controls.update();

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
      lightMode
    ]);

    const drawSVG = useCallback(
      (svgContainer?: HTMLElement | null) => {
        categoryMeshes.current.forEach((categoryMesh) => {
          const { mesh, count } = categoryMesh;

          // Skip drawing if the mesh is not visible
          if (!mesh.visible) return;

          const color = (mesh.material as THREE.MeshBasicMaterial).color;

          for (let i = 0; i < count; i++) {
            const svgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

            const matrix = new THREE.Matrix4();
            mesh.getMatrixAt(i, matrix);
            const position = new THREE.Vector3();
            position.setFromMatrixPosition(matrix);

            const proj = toScreenPosition(position, cameraRef.current);
            svgCircle.setAttribute('cx', proj.x.toString());
            svgCircle.setAttribute('cy', proj.y.toString());

            svgCircle.style.fill = `rgb(${color.r * 255},${color.g * 255},${color.b * 255})`;
            svgCircle.style.position = 'absolute';

            const distance = position.distanceTo(cameraRef.current.position);
            const scaleFactor = calculateScaleFactor(distance);
            svgCircle.setAttribute('r', (5 * scaleFactor).toString());
            svgContainer!.appendChild(svgCircle);
          }
        });
      },
      [calculateScaleFactor, toScreenPosition]
    );

    const downloadSVG = useCallback(() => {
      let svgContainer = document.getElementById('svg-container') as HTMLElement;
      if (!svgContainer) {
        // @ts-expect-error - need to cast to HTMLElement
        svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.id = 'svg-container';
        svgContainer.style.position = 'absolute';
        svgContainer.style.width = '100%';
        svgContainer.style.height = '100%';
        svgContainer.style.top = '0';
        svgContainer.style.left = '0';
        svgContainer.style.zIndex = '-1';
        document.body.appendChild(svgContainer);
      }

      svgContainer.innerHTML = '';
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
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'scatterplot.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }, [drawSVG, drawBoxEdges, minX, maxX, minY, maxY, minZ, maxZ]);
    const createShape = useCallback(
      (
        cluster: any,
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
        isThreeD: boolean,
        useSVG: boolean = false
      ): Promise<Map<string, { mesh: THREE.InstancedMesh; count: number }>> => {
        return new Promise((resolve) => {
          const maxExtent = 40;
          const deltaX = maxX - minX;
          const deltaY = maxY - minY;
          const deltaZ = maxZ - minZ;
          const maxDelta = Math.max(deltaX, deltaY, deltaZ);

          const createMeshes = (geometry: THREE.BufferGeometry) => {
            const newCategoryMeshes = new Map<
              string,
              { mesh: THREE.InstancedMesh; count: number }
            >();

            // Count instances per category
            const categoryCounts = new Map<string, number>();
            for (let i = 0; i < length; i++) {
              const point = cluster[i];
              const categoryKey = point.features[_colorKey];
              categoryCounts.set(categoryKey, (categoryCounts.get(categoryKey) || 0) + 1);
            }

            // Create meshes
            categoryCounts.forEach((count, categoryKey) => {
              const material = new THREE.MeshBasicMaterial({
                transparent: true,
                color: new THREE.Color(
                  getFeatureColor(categoryKey, _customFeatures, _colorList, _colorParamList)
                ),
                opacity: 1,
                side: THREE.DoubleSide,
                depthTest: false
              });
              const mesh = new THREE.InstancedMesh(geometry, material, count);
              // @ts-expect-error - need to cast to Object3D
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
              if (useSVG) {
                dummyObject.scale.set(0.01, -0.01, 0.01); // Scale and flip Y for SVG
              }
              dummyObject.updateMatrix();
              meshData.mesh.setMatrixAt(meshData.count, dummyObject.matrix);

              // Set user data for this instance
              meshData.mesh.userData.instanceUserData.push({
                ...point,
                identifier: point.identifier,
                features: point.features,
                color: getFeatureColor(categoryKey, _customFeatures, _colorList, _colorParamList),
                coordinates: { x: scaledX, y: scaledY, z: scaledZ }
              });

              meshData.count++;
            }

            newCategoryMeshes.forEach((meshData) => {
              meshData.mesh.instanceMatrix.needsUpdate = true;
            });

            return newCategoryMeshes;
          };

          const geometry = new THREE.SphereGeometry(0.3);
          resolve(createMeshes(geometry));
        });
      },
      []
    );

    const onColorKeyDoubleClick = (selectedColorKey: string | null | undefined) => {
      if (selectedColorKey) {
        setColorParam(selectedColorKey);
        updateVisibility(selectedColorKey);
      } else {
        setColorParam('');
        updateVisibility('');
      }
    };

    useEffect(() => {
      const onWindowResize = () => {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();

        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize, false);
      return () => {
        window.removeEventListener('resize', onWindowResize, false);
      };
    }, []);

    return (
      <div className="relative h-full flex overflow-hidden">
        <div
          className={
            loading
              ? 'absolute inset-0 z-30 flex justify-center items-center bg-opacity-50 bg-gray-300'
              : 'hidden'
          }>
          <PropagateLoader color={'#0066bd'} size={30} loading={true} />
        </div>
        {legendRefFull}
        <div
          className="h-full w-full"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onClick={onClick}
          ref={containerRef}
        />
        <div className={isLegendOpen ? 'inline z-10' : 'hidden'}>
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
            left: controllerPosition.left
          }}>
          <Controller
            controllerShown={controllerShown}
            onVisualizeClicked={() => onVisualizeClicked && onVisualizeClicked(entityName)}
            onCompareClicked={() => onCompareClicked && onCompareClicked(entityName)}
          />
        </div>
        <div className={threeD ? 'absolute z-0 left-0 bottom-16 flex' : 'hidden'}>
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
              <p className={`${lightMode ? 'text-black' : 'text-white'}`}>ID: {identifierName}</p>
            )}
            {info && <p className={`${lightMode ? 'text-black' : 'text-white'}`}>Label: {info}</p>}
          </div>
        </div>
      </div>
    );
  }
);

ScatterBoard.displayName = 'ScatterBoard';
export default ScatterBoard;
