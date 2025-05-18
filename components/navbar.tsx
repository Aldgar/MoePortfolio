"use client";
import React, { useEffect, useState } from 'react'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar() {
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShow(true)
        setLastScrollY(window.scrollY)
        return
      }
      if (window.scrollY > lastScrollY) {
        setShow(false) // scrolling down
      } else {
        setShow(true) // scrolling up
      }
      setLastScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <NavigationMenu
      className={`fixed left-1/2 transform -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur shadow rounded-xl px-4 py-1 transition-transform duration-300 ${
  show ? 'translate-y-0' : '-translate-y-24'
}`}
    >
      <NavigationMenuItem className="flex items-center justify-center py-2 text-gray-700 dark:text-gray-400 gap-2">
        <NavigationMenuLink href="#about" className={navigationMenuTriggerStyle()}>
          About
        </NavigationMenuLink>
        <NavigationMenuLink href="#skills" className={navigationMenuTriggerStyle()}>
          Skills
        </NavigationMenuLink>
        <NavigationMenuLink href="#projects" className={navigationMenuTriggerStyle()}>
          Projects
        </NavigationMenuLink>
        <NavigationMenuLink href="#experience" className={navigationMenuTriggerStyle()}>
          Experience
        </NavigationMenuLink>
        <NavigationMenuLink href="#contact" className={navigationMenuTriggerStyle()}>
          Contact
        </NavigationMenuLink>
        <NavigationMenuLink href="#downloadCv" className={navigationMenuTriggerStyle()}>
          Download CV
        </NavigationMenuLink>
        {/* Dark/Light Toggle Button */}
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
      </NavigationMenuItem>
    </NavigationMenu>
  )
}

export default Navbar