"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // Close mobile menu on route change or resize
  useEffect(() => {
    const closeMenu = () => setMobileOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  return (
    <NavigationMenu
      className={`
        fixed top-4 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90
        backdrop-blur shadow-lg rounded-xl px-2 py-2 transition-all duration-300
        ${show ? "translate-y-0" : "-translate-y-24"}
        w-full
        sm:w-fit sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:mx-auto
      `}
      style={{ minWidth: 0, maxWidth: "100vw" }}
    >
      {/* Hamburger for mobile */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="font-bold text-lg pl-2">Menu</span>
        <button
          aria-label="Open Menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2"
        >
          {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-4 text-gray-700 dark:text-gray-400 min-w-max">
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
        
        
        {/* Admin Panel Button */}
        {pathname !== '/admin' && (
        <NavigationMenuItem>
          <div className="relative group">
            <Link
              href="/admin"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              title="Admin Dashboard"
            >
              <span className="mr-2">🎛️</span>
              Admin
            </Link>
            
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
              <div className="relative">
                <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-gray-700 dark:border-gray-600">
                  Analytics & Management
                </div>
                {/* Arrow pointing up */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-800"></div>
              </div>
            </div>
          </div>
        </NavigationMenuItem>
        )}        {mounted && (
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

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute left-0 top-full w-full bg-white dark:bg-gray-950 shadow-lg rounded-b-xl flex flex-col items-start gap-2 px-4 py-4 sm:hidden z-50"
        >
          <NavigationMenuItem>
            <NavigationMenuLink href="#about" className={navigationMenuTriggerStyle()} onClick={() => setMobileOpen(false)}>
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#skills" className={navigationMenuTriggerStyle()} onClick={() => setMobileOpen(false)}>
              Skills
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#projects" className={navigationMenuTriggerStyle()} onClick={() => setMobileOpen(false)}>
              Projects
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#experience" className={navigationMenuTriggerStyle()} onClick={() => setMobileOpen(false)}>
              Experience
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#contact" className={navigationMenuTriggerStyle()} onClick={() => setMobileOpen(false)}>
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#downloadCv" className={navigationMenuTriggerStyle()} onClick={() => setMobileOpen(false)}>
              Download CV
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          {/* Admin Panel Button for Mobile */}
          {pathname !== '/admin' && (
          <NavigationMenuItem>
            <Link
              href="/admin"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              onClick={() => setMobileOpen(false)}
            >
              <span className="mr-2">🎛️</span>
              Admin Panel
            </Link>
          </NavigationMenuItem>
          )}

          {mounted && (
            <button
              aria-label="Toggle Dark Mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-cyan-400 hover:text-black dark:hover:bg-cyan-400 dark:hover:text-black transition"
            >
              {theme === "dark" ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-800" />
              )}
            </button>
          )}
        </div>
      )}
    </NavigationMenu>
  );
}

export default Navbar