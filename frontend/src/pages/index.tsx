// import React, {useEffect, useState} from "react";
// import {NextPage} from "next";
// import Nav from "../components/Nav";
// import Footer from "../components/Footer";
// import HomeMobile from "../components/HomeMobile";
// import Home from "../components/Home";

// const HomePage : NextPage = () => {
//     const [isMobile,
//         setIsMobile] = useState(false);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         // Initial check
//         handleResize();

//         // Add a resize event listener
//         window.addEventListener('resize', handleResize);

//         // Clean up the event listener on component unmount
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     return (
//         <div>
//             <Nav/>
//             {isMobile ? <HomeMobile /> : <Home/>}
//             <Footer/>
//         </div>
//     );
// };

// export default HomePage;
