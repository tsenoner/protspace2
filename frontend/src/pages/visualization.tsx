// import { useEffect, useState } from "react";
// import Nav from "../components/Nav";
// import VisualizationComp from "../components/VisualizationComp";

// export default function Visualization() {
//   const [isMobile, setIsMobile] = useState(true);

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

//   return (
//     <div>
//       <Script src="https://cdn.jsdelivr.net/npm/jsfive@0.3.10/dist/browser/hdf5.js"></Script>
//       {isMobile ? (
//         <div className="overflow-hidden h-screen">
//           <Nav />
//           <MobileVisualization />
//           <Footer />
//         </div>
//       ) : (
//         <VisualizationComp />
//       )}
//     </div>
//   );
// }
