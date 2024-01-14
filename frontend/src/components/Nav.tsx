"use client";
import { useTheme } from "next-themes";
import { useState } from "react";
import { MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";
import { SiMoleculer } from "react-icons/si";

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="nav-bg">
      <div className="flex items-center">
        <SiMoleculer />
        <h1 className="mx-2 text-xl font-bold">ProtSpace</h1>
      </div>
      <div
        className={`inline-block text-center place-content-center z-10 absolute right-4 top-3 md:relative md:right-0 md:top-0 ${
          menuOpen ? "drop-shadow-none" : "md:drop-shadow-none drop-shadow-md"
        }rounded-lg p-2 md:p-0`}
      >
        <li
          className="cursor-pointer flex md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MdMenu
            className={`text-2xl md:hidden ${menuOpen ? "m-auto" : "ml-auto"}`}
          ></MdMenu>
        </li>
        <li
          className={`items-center ${
            menuOpen
              ? "block bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 md:flex md:visible"
              : "invisible md:flex md:visible"
          }`}
          id="menu"
        >
          <a href="/" className="nav-title">
            <h1 className="m-auto">Home</h1>
          </a>
          <a href="/visualization" className="nav-title">
            <h1 className="m-auto">Visualization</h1>
          </a>
          <a href="/about-us" className="nav-title">
            <h1 className="m-auto">About Us</h1>
          </a>
          <a href="/help" className="nav-title">
            <h1 className="m-auto">Help</h1>
          </a>
          <div className="flex m-2 cursor-pointer">
            {theme == "dark" ? (
              <MdLightMode
                className="m-auto"
                onClick={() =>
                  theme == "dark" ? setTheme("light") : setTheme("dark")
                }
              />
            ) : (
              <MdDarkMode
                className="m-auto"
                onClick={() =>
                  theme == "dark" ? setTheme("light") : setTheme("dark")
                }
              />
            )}
          </div>
          <a href={"https://rostlab.org/"} className="flex mx-4 my-4">
            <div className="flex m-auto md:mx-4">
              <h1 className="font-bold">ROST</h1>
              <h1 className="font-thin">LAB</h1>
            </div>
          </a>
        </li>
      </div>
    </nav>
  );
}
