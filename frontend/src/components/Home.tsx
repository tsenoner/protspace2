// import React from "react";
// import { Card } from "./Card";

// const Home: React.FC = () => {
//   return (
//     <main>
//       <div className="h-full home">
//         <div className="absolute top-8 left-1/2 w-1/4">
//           <img
//             src="molstar-image1.png"
//             className="wiggle"
//             alt="Molstar Image"
//           />
//         </div>
//         <div className="absolute top-1/3 right-32 w-1/4">
//           <img
//             src="molstar-image2.png"
//             className="wiggle"
//             alt="Molstar Image"
//           />
//         </div>

//         <div className="flex items-end">
//           <div className="absolute top-1/2 w-1/2 m-12">
//             <h1 className="lg:text-5xl text-3xl font-bold m-4">
//               A New Way of Visualization
//             </h1>
//             <p className="m-4 lg:text-xl text-base text-justify">
//               Welcome to RostSpace, your gateway to molecular visualization and
//               data exploration. Create stunning 2D and 3D plots, customize
//               parameters, and uncover insights with legends and filters. Capture
//               your discoveries with screenshots and share your findings
//               effortlessly. Dive into a world of scientific exploration at
//               RostSpace!
//             </p>
//             <div className="btn">
//               <Link href={"#how-it-works"}>Learn More</Link>
//             </div>
//           </div>
//         </div>
//         <div
//           className="absolute h-full top-full flex content-center dark:bg-secondaryDark"
//           id="how-it-works"
//         >
//           <div className="card-div my-auto">
//             <h1 className="flex justify-center lg:text-4xl text-2xl m-2">
//               How It Works?
//             </h1>
//             <p className="lg:m-12 m-2 lg:text-xl text-base">
//               RostSpace empowers you to generate embeddings through
//               dimensionality reduction techniques and explore them on
//               interactive 2D or 3D scatter plots. Dive even deeper by
//               visualizing protein molecules through seamless point interaction.
//               Experience the simplicity of this application in just four easy
//               steps.
//             </p>
//             <div className="grid grid-cols-2 w-full m-4 gap-1 lg:gap-2">
//               <Card
//                 id="item1"
//                 text="Step 1: Easily upload H5(required), CSV, Fasta, or PDB files, and fine-tune parameters to your preference. Alternatively, explore with our example datasets."
//               />
//               <Card
//                 id="item2"
//                 text="Step 2: Watch as the scatter plot swiftly materializes, enabling you to effortlessly filter points through search or legend selections. Zoom, rotate, and pan with utmost ease."
//               />
//               <Card
//                 id="item3"
//                 text="Step 3: For PDB files, simply double-click to open the controller. Choose between visualization or comparison mode, allowing you to explore molecules. Customize styles effortlessly through the settings modal."
//               />
//               <Card
//                 id="item4"
//                 text="Step 4: Seamlessly import and export projects and embeddings. Capture screenshots and tailor the setup to match your preferences with ease. You've mastered the essentials—time to dive in!"
//               />
//             </div>
//           </div>
//         </div>

//         <div
//           className="flex h-full absolute w-full dark:bg-secondaryDark"
//           style={{
//             top: "200%",
//           }}
//         >
//           <div className="absolute w-1/3 top-24">
//             <img
//               src="molstar-image3.png"
//               className="ml-36 wiggle"
//               alt="Molstar Image"
//             />
//           </div>
//           <div className="absolute text-right w-2/5 m-12 right-0 bottom-1/4">
//             <h1 className="m-4 lg:text-4xl text-2xl">
//               Analysis and Visualization
//             </h1>
//             <p className="m-4 text-justify lg:text-xl text-base">
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

// export default Home;
