// import { NextPage } from "next";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import lostImage from "../../public/undraw_missed_chances_k-3-cq.svg";
// import Footer from "../components/Footer";
// import Nav from "../components/Nav";

// const Custom404: NextPage = () => {
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

//   return (
//     <div className="overflow-hidden min-h-screen flex flex-col home">
//       <Nav />
//       <div className="flex flex-col items-center justify-center flex-grow">
//         <Image src={lostImage} alt="404 Not Found" className="w-96 h-96 mb-4" />
//         <h1 className="text-3xl font-bold mb-2 p-4">404 - Page Not Found</h1>
//         <p>{"Sorry, the page you're looking for doesn't exist."}</p>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Custom404;
