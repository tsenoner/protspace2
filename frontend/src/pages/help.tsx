// import React, { useEffect, useState } from "react";
// import Nav from "../components/Nav";
// import Footer from "../components/Footer";
// import HelpItem from "../components/HelpItem";
// import {
//   AdjustmentsVerticalIcon,
//   ArrowDownOnSquareIcon,
//   CameraIcon,
//   ChevronDoubleLeftIcon,
//   ClipboardDocumentListIcon,
//   CogIcon,
//   DocumentArrowDownIcon,
//   DocumentArrowUpIcon,
//   DocumentChartBarIcon,
//   MapIcon,
// } from "@heroicons/react/24/solid";

// export default function Help() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     // Initial check
//     handleResize();

//     // Add a resize event listener
//     window.addEventListener("resize", handleResize);

//     // Clean up the event listener on component unmount
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const visualization = (
//     <div className="md:m-8 m-2 border-b pb-4 border-gray-200">
//       <p className="m-2 font-bold text-xl md:text-3xl mb-8">Help</p>
//       <div>
//         <p className="m-2 font-bold md:text-xl text-lg">Buttons</p>
//         <ul>
//           <li>
//             <HelpItem
//               explanation="When clicked, it expands the buttons, and if the buttons are already expanded, this button is used to collapse them."
//               component={
//                 <div className="rounded-full bg-blue-700 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
//                   <ChevronDoubleLeftIcon className="w-6 m-auto text-white" />
//                 </div>
//               }
//             />
//           </li>
//           <li>
//             <HelpItem
//               explanation="Downloads the screenshot of the scatter plot in PNG format, with the option to include or exclude legends."
//               component={
//                 <div className="rounded-full bg-yellow-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md">
//                   <ArrowDownOnSquareIcon className="w-6 m-auto text-white" />
//                 </div>
//               }
//             />
//           </li>
//           <li>
//                 <HelpItem
//                     explanation="Downloads the molecule visualization in a PNG format."
//                     component={<div className = "rounded-full bg-blue-200 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" >
//                     <CameraIcon className="w-6 m-auto text-white"/>
//                 </div>
//             }
//             />
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="Toggles the visibility of legends in the scatter plot."
//                     component={< div className = "rounded-full bg-green-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" > <MapIcon className="w-6 m-auto text-white"/> </div>}/>
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="Exports the dimensionality reduction technique, data, camera positions, and highlighted item settings as a JSON file."
//                     component={< div className = "rounded-full bg-pink-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" > <DocumentArrowUpIcon className="w-6 m-auto text-white"/> </div>}/>
//             </li>
//             <li>
//                  <HelpItem
//                     explanation="Imports the dimensionality reduction technique, data, camera positions, and highlighted item settings. It only accepts JSON files."
//                     component={< div className = "rounded-full bg-purple-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" > <DocumentArrowDownIcon className="w-6 m-auto text-white"/> </div>}/>
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="Exports the data as a CSV file."
//                     component={< div className = "rounded-full bg-stone-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" > <ClipboardDocumentListIcon className="w-6 m-auto text-white"/> </div>}/>
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="Imports data to use in the scatter plot, specifically accepting CSV files."
//                     component={< div className = "rounded-full bg-red-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" > <DocumentChartBarIcon className="w-6 m-auto text-white"/> </div>}/>
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="Opens the Settings modal."
//                     component={< div className = "rounded-full bg-emerald-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" > <AdjustmentsVerticalIcon className="w-6 m-auto text-white"/> </div>}/>
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="Opens the File Settings modal."
//                     component={< div className = "rounded-full bg-gray-500 w-12 h-12 m-1 flex items-center cursor-pointer shadow-md" > <CogIcon className="w-6 m-auto text-white"/> </div>}/>
//             </li>
//         </ul>
//       </div>
//     </div>
//   );

//   const settings = (
//     <div className="md:m-8 m-2 border-b pb-4 border-gray-200">
//         <div>
//             <p className="m-2 font-bold md:text-xl text-lg">Settings</p>
//             <ul>
//                 <li>
//             <HelpItem
//               explanation="The available dimensionality reduction techniques include UMAP, PCA, and TSNE."
//               component={<p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base break-words">Technique</p>} />
//           </li>
//           <li>
//             <HelpItem
//               explanation="When enabled, two legends are displayed on the plot, utilizing both colors and shapes to represent data categories. Disabling this option will render the points as spheres. You can choose the legend keys using the provided dropdown menu."
//               component={<p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base break-words">2 Legends</p>}
//             />
//           </li>
//           <li>
//             <HelpItem
//                 explanation="When activated, the plot is displayed in a 3D environment, complete with visible axes. Conversely, deactivating this option results in a 2D rendering of the plot, placed on the XY plane."
//                 component={<p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base break-words"> 3D </p>}/>
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="For molecule visualization, 'cartoon', 'stick' and 'line' styles can be selected. The styles can be configured individually."
//                     component={<p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base break-words"> Atom Style </p>}/>
//             </li>
//             <li>
//                 <HelpItem
//                     explanation="To access the controller, you must double-click on a data point. The controller features two buttons for visualization and comparison. It automatically closes when the position of the points changes, such as during rotation."
//                     component={<p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base break-words"> Controller </p>}/>
//             </li>
//         </ul>
//       </div>
//     </div>
//   );

//   const navi = (
//     <div className="md:m-8 m-2 border-b pb-4 border-gray-200">
//       <div>
//         <p className="m-2 font-bold md:text-xl text-lg">Navigation</p>
//         <ul>
//           <li>
//             <HelpItem
//               explanation="The action can be performed using the primary mouse button or a single touch gesture."
//               component={<p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base break-words">Rotation</p>}
//             />
//           </li>
//           <li>
//             <HelpItem
//               explanation="The action can be performed using the scroll wheel, the second mouse button, or a pinch gesture with a double touch."
//               component={<p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base break-words">Zoom</p>}
//             />
//           </li>
//           <li>
//             <HelpItem
//                 explanation="The action can be performed by either pressing the middle mouse button or holding down the Ctrl key while clicking the primary mouse button."
//                 component={< p className="bg-stone-100 bg-opacity-10 p-1 shadow-sm rounded-sm text-sm md:text-base text-block break-words"> Translation </p>}/>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );

//   return (
//     <div className="home">
//       <Nav />
//       <main className="dark:bg-gradient-to-b dark:from-black dark:from-20% dark:to-secondaryDark dark:to-50% pb-12">
//         <div className="m-2 mt-12">
//         {visualization}
//         {settings}
//         {navi}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };
