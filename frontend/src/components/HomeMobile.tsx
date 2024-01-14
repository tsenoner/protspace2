// import React from "react";
// import { CardMobile } from "./Card";

// const HomeMobile: React.FC = () => {
//   return (
//     <main>
//       <div className="h-full home">
//         <div className="absolute top-8 left-0 w-1/2">
//           <img
//             src="molstar-image1.png"
//             className="wiggle"
//             alt="Molstar Image"
//           />
//         </div>
//         <div className="absolute top-1/5 right-8 w-1/2">
//           <img
//             src="molstar-image2.png"
//             className="wiggle"
//             alt="Molstar Image"
//           />
//         </div>

//         <div className="flex items-end">
//           <div className="absolute top-1/3 m-4 z-10">
//             <h1 className="text-xl font-bold m-4 bg-white bg-opacity-40 dark:bg-transparent">
//               A New Way of Visualization
//             </h1>
//             <p className="m-4 text-sm text-justify bg-white bg-opacity-40 dark:bg-transparent">
//               Welcome to RostSpace, your gateway to molecular visualization and
//               data exploration. Create stunning 2D and 3D plots, customize
//               parameters, and uncover insights with legends and filters. Capture
//               your discoveries with screenshots and share your findings
//               effortlessly. Dive into a world of scientific exploration at
//               RostSpace!
//             </p>
//             <div className="btn">
//               {/* <Link href={"#how-it-works"}>Learn More</Link> */}
//             </div>
//           </div>
//         </div>
//         <div
//           className="absolute h-full top-full content-center justify-center dark:bg-secondaryDark w-full"
//           id="how-it-works"
//         >
//           <div className="card-div my-auto">
//             <h1 className="flex justify-center text-lg m-2">How It Works?</h1>
//             <p className="m-2 text-sm">
//               RostSpace empowers you to generate embeddings through
//               dimensionality reduction techniques and explore them on
//               interactive 2D or 3D scatter plots. Dive even deeper by
//               visualizing protein molecules through seamless point interaction.
//               Experience the simplicity of this application in just four easy
//               steps.
//             </p>
//             <div className="carousel carousel-center w-full">
//               <div id="item1" className="w-full">
//                 <CardMobile
//                   id="item1"
//                   text="Step 1: Easily upload H5(required), CSV, Fasta, or PDB files, and fine-tune parameters to your preference. Alternatively, explore with our example datasets."
//                 />
//               </div>
//               <div id="item2" className="w-full">
//                 <CardMobile
//                   id="item2"
//                   text="Step 2: Watch as the scatter plot swiftly materializes, enabling you to effortlessly filter points through search or legend selections. Zoom, rotate, and pan with utmost ease."
//                 />
//               </div>
//               <div id="item3" className="w-full">
//                 <CardMobile
//                   id="item3"
//                   text="Step 3: For PDB files, simply double-click to open the controller. Choose between visualization or comparison mode, allowing you to explore molecules. Customize styles effortlessly through the settings modal."
//                 />
//               </div>
//               <div id="item4" className="w-full">
//                 <CardMobile
//                   id="item1"
//                   text="Step 4: Seamlessly import and export projects and embeddings. Capture screenshots and tailor the setup to match your preferences with ease. You've mastered the essentials—time to dive in!"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-center w-full py-2 gap-2">
//               <a href="#item1">
//                 <div className="w-2 h-2 rounded-full bg-white"></div>
//               </a>
//               <a href="#item2">
//                 <div className="w-2 h-2 rounded-full bg-white"></div>
//               </a>
//               <a href="#item3">
//                 <div className="w-2 h-2 rounded-full bg-white"></div>
//               </a>
//               <a href="#item4">
//                 <div className="w-2 h-2 rounded-full bg-white"></div>
//               </a>
//             </div>
//           </div>
//         </div>

//         <div
//           className="flex h-full absolute w-full dark:bg-secondaryDark justify-center"
//           style={{
//             top: "200%",
//           }}
//         >
//           <div className="absolute top-2 w-1/2">
//             <img
//               src="molstar-image3.png"
//               className="wiggle"
//               alt="Molstar Image"
//             />
//           </div>
//           <div className="absolute text-right m-4 bottom-1/4">
//             <h1 className="text-lg m-4 z-10 bg-white bg-opacity-40 dark:bg-transparent">
//               Analysis and Visualization
//             </h1>
//             <p className="m-4 text-justify text-sm z-10 bg-white bg-opacity-40 dark:bg-transparent">
//               With RostSpace, you&apos;re the architect of your own scientific
//               exploration. Unleash your creativity by crafting stunning
//               visualizations using techniques like UMAP, PCA, and t-SNE.
//               <br />
//               Experience the magic of molecule visualization in 2D or 3D. Dive
//               into data intricacies with two legends, fine-tune parameters, and
//               uncover hidden insights effortlessly.
//               <br />
//               Capture discoveries with screenshots, sharing your findings
//               globally. RostSpace is your portal to endless scientific
//               exploration. Dive in and soar with curiosity!
//               <br />
//               This is our first version, and we&apos;re excited to have you on
//               board. We&apos;re committed to enhancing your experience, and in
//               future updates, we&apos;ll be adding many more features and
//               improving performance. Stay tuned for exciting developments!
//             </p>
//             <div className="btn">
//               <Link href={"/visualization"}>Start Now</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default HomeMobile;
