// import React, {
//   useEffect,
//   useRef,
//   useMemo,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import { useScreenshot, createFileName } from "use-react-screenshot";
// import { XMarkIcon } from "@heroicons/react/24/solid";
// import PropagateLoader from "react-spinners/PropagateLoader";
// import { setSelectedMols, setErrorMessage } from "../redux/actions/settings";
// import Tag from "./Tag";
// import { truncate } from "../helpers/search";
// import { useAppDispatch, useAppSelector } from "../helpers/hooks";
// import { GLViewer } from "3dmol";
// import { MdFullscreen } from "react-icons/md";

// const backendUrl = "http://localhost:8000";

// export interface MoleculeViewerRef {
//   downloadScreenshot: () => void | undefined;
// }

// const MoleculeViewer = forwardRef<MoleculeViewerRef>((_, ref) => {
//   const viewerRef = useRef<HTMLDivElement | null>(null);
//   const dispatch = useAppDispatch();
//   const selectedMols = useAppSelector((state) => state.settings.selectedMols);
//   const pdbExists = useAppSelector((state) => state.settings.pdbExists);
//   const atomStyle = useAppSelector((state) => state.settings.atomStyle);
//   const [imageSrc, takeScreenshot] = useScreenshot();
//   const [loading, setLoading] = useState(false);
//   const takeScreenshotMemo = useMemo(() => takeScreenshot, [takeScreenshot]);

//   const handleFullScreen = () => {
//     const element = viewerRef.current;
//     if (element) {
//       if (element.requestFullscreen) {
//         element.requestFullscreen();
//       }
//     }
//   };
//   useEffect(() => {
//     if (!pdbExists && selectedMols.length > 0) {
//       dispatch(setSelectedMols([]));
//       dispatch(
//         setErrorMessage(
//           "PDB folder doesn't exist. Please upload a PDB directory."
//         )
//       );
//       return;
//     }
//     import("3dmol").then((module) => {
//       if (!viewerRef.current || typeof window === "undefined") {
//         return;
//       }

//       const element = viewerRef.current;
//       const config = {
//         rows: 1,
//         cols: selectedMols.length,
//         control_all: true, //mouse controls all viewers
//       };

//       const viewer: GLViewer[][] = module.createViewerGrid(element, config);
//       setLoading(true); // Dispatch action to set loading state
//       const fetchData = async () => {
//         try {
//           for (let index = 0; index < selectedMols.length; index++) {
//             const response = await fetch(
//               `${backendUrl}/pdb/${selectedMols[index]}`
//             );
//             const data = await response.text();

//             viewer[0][index].addModel(data, "pdb");
//             viewer[0][index].setStyle(atomStyle);
//             if (selectedMols.length === 1) {
//               viewer[0][index].setClickable(
//                 {},
//                 true,
//                 function (
//                   atom: any,
//                   _viewer: any,
//                   _event: any,
//                   _container: any
//                 ) {
//                   viewer[0][index].removeAllLabels();

//                   viewer[0][index].addLabel(atom.serial + ":" + atom.resn, {
//                     position: atom,
//                     backgroundColor: "darkgreen",
//                     backgroundOpacity: 0.8,
//                   });
//                   viewer[0][index].render();
//                 }
//               );
//             }

//             viewer[0][index].zoomTo();
//             viewer[0][index].render();
//             viewer[0][index].zoom(1.2, 1000);
//           }
//           setLoading(false); // Dispatch action to set loading state
//         } catch (error) {
//           console.error(`Failed to load PDB: ${error}`);
//           dispatch(setSelectedMols([]));
//           dispatch(setErrorMessage("Failed to load PDB file"));
//         }
//       };

//       fetchData();

//       return () => {
//         for (let viewerElement of viewer[0]) {
//           viewerElement.removeAllShapes();
//           viewerElement.removeAllLabels();
//           viewerElement.removeAllSurfaces();
//           viewerElement.clear();
//         }
//       };
//     });
//   }, [atomStyle, selectedMols, dispatch]);

//   useImperativeHandle(ref, () => ({
//     downloadScreenshot() {
//       if (selectedMols.length) {
//         takeScreenshotMemo(viewerRef.current);
//       } else {
//         dispatch(setErrorMessage("There is no selected molecule"));
//       }
//     },
//   }));

//   const download = (image: any, { name = "img", extension = "png" } = {}) => {
//     const a = document.createElement("a");
//     a.href = image;
//     a.download = createFileName(extension, name);
//     a.click();
//   };

//   useEffect(() => {
//     if (imageSrc) {
//       download(imageSrc, {
//         name: selectedMols.length === 1 ? selectedMols[0] : "molecules",
//         extension: "png",
//       });
//     }
//   }, [imageSrc]);

//   const baseWidth = 300; // Width when selectedMols.length is 1
//   const widthIncrement = 150; // Width increase for each additional item

//   const calculatedWidth =
//     selectedMols.length > 0
//       ? Math.min(baseWidth + (selectedMols.length - 1) * widthIncrement, 900)
//       : 0;

//   return (
//     <div
//       style={{
//         width: `${calculatedWidth}px`,
//         height: "288px",
//         display: "flex",
//         flexDirection: "column",
//         borderWidth: selectedMols.length ? 1 : 0,
//         borderColor: "#1f2937",
//         position: "absolute",
//         bottom: 60,
//         left: 2,
//       }}
//     >
//       <div className="flex overflow-x-scroll absolute z-10 max-w-4xl pt-1">
//         {selectedMols.map((mol: string, ix: number) => (
//           <Tag
//             key={ix}
//             text={truncate(mol, 10)}
//             index={ix}
//             onClick={() =>
//               dispatch(
//                 setSelectedMols(
//                   selectedMols.filter((clicked: string) => clicked !== mol)
//                 )
//               )
//             }
//           />
//         ))}
//       </div>
//       <XMarkIcon
//         className="absolute top-2 right-2 z-10 w-4"
//         onClick={() => dispatch(setSelectedMols([]))}
//       />
//       <button
//         className="absolute top-60 bottom-0 right-4 z-10 w-4 cursor-pointer"
//         onClick={handleFullScreen}
//       >
//         <MdFullscreen size="24px" />
//       </button>
//       {loading && (
//         <div className="flex items-center justify-center w-full h-full bg-white absolute z-30">
//           <PropagateLoader
//             className="text-blue-500"
//             color="#0066bd"
//             size={8}
//             loading={true}
//           />
//         </div>
//       )}
//       <div className="flex h-72" id="molDiv" ref={viewerRef} />
//     </div>
//   );
// });

// MoleculeViewer.displayName = "MoleculeViewer";
// export default MoleculeViewer;
