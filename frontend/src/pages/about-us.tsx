// import React, {useEffect, useState} from "react";
// import {NextPage} from "next";
// import PersonCard from "../components/PersonCard";
// import Nav from "../components/Nav";
// import Footer from "../components/Footer";

// const AboutUs : NextPage = () => {
//     const [isMobile,
//         setIsMobile] = useState(false);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         handleResize();

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);
//     return (
//         <div className="home">
//             <Nav/>
//             <main>
//                 <div className="m-8 pb-12">
//                     <h1 className="text-xl font-bold m-4 mt-12 md:text-3xl">Meet our team of developers and creators</h1>
//                     <p className="m-4 mt-8 text-justify md:text-base text-sm">
//                     Welcome to RostSpace, where science and technology converge to unveil the mesmerizing world of proteins. Our journey began at the intersection of curiosity and innovation, sparked by a shared passion for unraveling the mysteries of life&apos;s building blocks.
//                     Together with our team, we blend creativity with precision to make the invisible visible. We are more than scientists and engineers; we are explorers charting uncharted territories at the molecular level. Our mission is to make these intricate structures accessible and understandable, fostering breakthroughs that will redefine the boundaries of healthcare, biotechnology, and beyond. Join us on this exhilarating expedition, where we turn molecules into masterpieces and scientific dreams into reality.
//                     </p>
//                     <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mx-4 my-12 md:gap-16">
//                         <PersonCard
//                             image="https://media.licdn.com/dms/image/C5603AQHggtw4WpRdyQ/profile-displayphoto-shrink_800_800/0/1517527161219?e=2147483647&v=beta&t=Uk98e8kil6ugPVktdNU6RWCu0z_rRalEkFL9xxMaXqI"
//                             name="Prof. Dr. Burkhard Rost"
//                             role="Supervisor"
//                             twitterLink="https://twitter.com/rostlab"
//                             linkedinLink="https://www.linkedin.com/"></PersonCard>
//                         <PersonCard
//                             image="https://media.licdn.com/dms/image/C4D03AQEBTXrexAopRA/profile-displayphoto-shrink_200_200/0/1540224809551?e=1697673600&v=beta&t=utLZEeC5t9jxaW2LKx3LIk-VjVgEIUL56YtMLt6LLZs"
//                             name="Tobias Olenyi"
//                             role="Advisor"
//                             twitterLink="https://twitter.com/rostlab"
//                             linkedinLink="https://www.linkedin.com/"></PersonCard>
//                         <PersonCard
//                             image="https://www.rostlab.org/sites/default/files/fileadmin/images/members/TobiasSenoner.jpg"
//                             name="Tobias Senoner"
//                             role="Advisor"
//                             twitterLink="https://twitter.com/rostlab"
//                             linkedinLink="https://www.linkedin.com/"></PersonCard>
//                         <PersonCard
//                             image="https://www.rostlab.org/sites/default/files/fileadmin/images/members/IvanKoludarov.jpg"
//                             name="Ivan Koludarow"
//                             role="Advisor"
//                             twitterLink="https://twitter.com/rostlab"
//                             linkedinLink="https://www.linkedin.com/"></PersonCard>
//                         <PersonCard
//                             image="https://media.licdn.com/dms/image/C4D03AQFnGTo0liIjig/profile-displayphoto-shrink_800_800/0/1615895994684?e=2147483647&v=beta&t=xA0hizGHIycvRTstiwZpFR9qbkg2NHZlb0ppf_YmcJI"
//                             name="Elif Caliskan"
//                             role="Developer"
//                             twitterLink="https://twitter.com/rostlab"
//                             linkedinLink="https://www.linkedin.com/"></PersonCard>
//                         <PersonCard
//                             image="https://www.rostlab.org/sites/default/files/fileadmin/images/members/AntonSpannagl.JPG"
//                             name="Anton Spannagl"
//                             role="Developer"
//                             twitterLink="https://twitter.com/rostlab"
//                             linkedinLink="https://www.linkedin.com/"></PersonCard>

//                     </div>
//                 </div>
//             </main>
//             <Footer/>
//         </div>
//     );
// };

// export default AboutUs;
