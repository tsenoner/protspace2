"use client";
import { useColorMode } from "@chakra-ui/react";
import { SiMoleculer } from "react-icons/si";

export default function Nav() {
  const { colorMode } = useColorMode();
  return (
    <nav className="nav-bg mt-4">
      <div className="flex items-center">
        <SiMoleculer color={colorMode === "light" ? "black" : "white"} />
        <h1
          className={`mx-2 text-md font-bold ${
            colorMode === "light" ? "text-black" : "text-white"
          }
            `}
        >
          ProtSpace
        </h1>
      </div>
      <div>
        <a href={"https://rostlab.org/"} className="flex text-sm">
          <div
            className={`flex ${
              colorMode === "light" ? "text-black" : "text-white"
            }`}
          >
            <h1 className="font-bold">ROST</h1>
            <h1 className="font-thin">LAB</h1>
          </div>
        </a>
      </div>
    </nav>
  );
}
