// import React from "react";
// import { FaLinkedin, FaTwitter } from "react-icons/fa";

// interface PersonCardProps {
//   image: string;
//   name: string;
//   role: string;
//   twitterLink: string;
//   linkedinLink: string;
// }

// const PersonCard: React.FC<PersonCardProps> = ({
//   image,
//   name,
//   role,
//   twitterLink,
//   linkedinLink,
// }) => {
//   return (
//     <div className="bg-accentBeige bg-opacity-20 rounded-md drop-shadow-md inline-block">
//       <div className="md:h-60 md:w-60 relative mx-auto my-8 w-40 h-40">
//         <div className="md:m-2">
//           <Image
//             src={image}
//             alt={`Profile of ${name}`}
//             layout="fill"
//             objectFit="cover"
//             className="rounded-full drop-shadow-md"
//           />
//         </div>
//       </div>
//       <div className="text-center inline-block w-full mb-8">
//         <h1 className="md:text-base text-sm md:m-2 m-1">{name}</h1>
//         <p className="font-light md:text-base text-sm">{role}</p>
//         <div className="flex justify-center md:m-2 m-1">
//           <Link href={twitterLink} className="mx-1">
//             <FaTwitter />
//           </Link>
//           <Link href={linkedinLink} className="mx-1">
//             <FaLinkedin />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonCard;
