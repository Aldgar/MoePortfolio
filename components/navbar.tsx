"use client";
import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShow(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShow(false); // scrolling down
      } else {
        setShow(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
   <NavigationMenu
  className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur shadow-lg rounded-xl px-4 py-2 transition-transform duration-300 w-fit mx-auto ${
    show ? "translate-y-0" : "-translate-y-24"
  }`}
>
  <div className="flex items-center gap-4 text-gray-700 dark:text-gray-400">
    <NavigationMenuItem>
      <NavigationMenuLink href="#about" className={navigationMenuTriggerStyle()}>
        About
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#skills" className={navigationMenuTriggerStyle()}>
        Skills
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#projects" className={navigationMenuTriggerStyle()}>
        Projects
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#experience" className={navigationMenuTriggerStyle()}>
        Experience
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#contact" className={navigationMenuTriggerStyle()}>
        Contact
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#downloadCv" className={navigationMenuTriggerStyle()}>
        Download CV
      </NavigationMenuLink>
    </NavigationMenuItem>
    {mounted && (
      <button
        aria-label="Toggle Dark Mode"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-cyan-400 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black transition"
      >
        {theme === "dark" ? (
          <FaSun className="text-yellow-400" />
        ) : (
          <FaMoon className="text-gray-800" />
        )}
      </button>
    )}
  </div>
</NavigationMenu>
  );
}

export default Navbar;