"use client";
import { SiMoleculer } from "react-icons/si";

export default function Nav() {
  return (
    <nav className="nav-bg">
      <div className="flex items-center">
        <SiMoleculer />
        <h1 className="mx-2 text-xl font-bold">ProtSpace</h1>
      </div>
      <div>
        <a href={"https://rostlab.org/"} className="flex mx-4 my-4">
          <div className="flex m-auto md:mx-4">
            <h1 className="font-bold">ROST</h1>
            <h1 className="font-thin">LAB</h1>
          </div>
        </a>
      </div>
    </nav>
  );
}
