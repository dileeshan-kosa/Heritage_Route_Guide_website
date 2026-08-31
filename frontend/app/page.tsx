"use client";

import React, { useState, useEffect, useRef } from "react";
import { TownData } from "./route-data";
import TownSection from "./components/TownSection";
import InteractiveMap from "./components/InteractiveMap";
import { useRouter } from "next/navigation";
import { Compass, ArrowDown, Heart, Shield, Landmark, Flame, Sun, Moon, LogIn, LogOut, ShieldCheck, User } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{ username: string; email: string; role: string } | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [towns, setTowns] = useState<TownData[]>([]);
  const [activeTownId, setActiveTownId] = useState<string>("kurunegala");
  const [selectedPlace, setSelectedPlace] = useState<{ type: string; name: string } | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Sync state with local storage on mount
  useEffect(() => {
    const session = localStorage.getItem("user");
    if (session) {
      try {
        setUserSession(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fetch towns from SQLite backend
  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/towns");
        if (!res.ok) {
          // Fallback to port 5000 if backend is there
          const res5000 = await fetch("http://localhost:5000/api/towns");
          if (res5000.ok) {
            const data = await res5000.json();
            setTowns(data);
            return;
          }
        } else {
          const data = await res.json();
          setTowns(data);
        }
      } catch (err) {
        // Fallback fetch from 5000
        try {
          const res5000 = await fetch("http://localhost:5000/api/towns");
          if (res5000.ok) {
            const data = await res5000.json();
            setTowns(data);
          }
        } catch (e) {
          console.error("Error fetching towns:", e);
        }
      }
    };
    fetchTowns();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserSession(null);
  };

  // Sync state with HTML class for full root level theme support
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Scrollspy logic to update active town node on the map
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const townId = entry.target.getAttribute("data-town-id");
          if (townId) {
            setActiveTownId(townId);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Focus triggers when element is roughly in center of screen
      threshold: 0.1,
    });

    const sections = document.querySelectorAll("[data-town-id]");
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [towns]);

  // Smooth scroll to selected town from map node click
  const handleTownSelect = (townId: string) => {
    setActiveTownId(townId);
    const element = document.getElementById(`town-${townId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePlaceClick = (type: string, name: string) => {
    setSelectedPlace({ type, name });
  };

  const clearSelectedPlace = () => {
    setSelectedPlace(null);
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}>
      
      {/* Sticky Header Nav with Dark/Light Toggle */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleTownSelect("kurunegala")}>
            <Compass className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <span className="font-serif font-bold text-sm tracking-wide text-zinc-900 dark:text-zinc-50">
              Heritage Route Guide
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* User session status */}
            {userSession ? (
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Hi, {userSession.username}</span>
                  {userSession.role === "admin" && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold text-amber-750 bg-amber-500/20 dark:text-amber-400 rounded">
                      Admin
                    </span>
                  )}
                </div>

                {userSession.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-150 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-950/40 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="p-2 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}

            {/* Color Mode Switcher */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
              title="Toggle Color Theme"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4 text-zinc-850" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>White Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Immersive Hero Header */}
      <header className="relative w-full h-[85vh] flex flex-col justify-end items-center overflow-hidden">
        {/* Local Background Image of Anuradhapura */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: "url('/ruwanwelisaya.png')",
          }}
        />
        {/* Dynamic bottom fade and dark overlay that adapts to current theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-white/35 dark:via-zinc-950/20 to-black/25" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl px-6 pb-16 md:pb-24 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 dark:bg-amber-500/10 text-amber-850 dark:text-amber-400 border border-amber-500/35 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
              <Compass className="w-4 h-4" />
              Sri Lankan Heritage Route
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-serif leading-tight">
              Journey to the <br />
              <span className="text-amber-700 dark:text-amber-400">Sacred City</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-800 dark:text-zinc-200 max-w-xl leading-relaxed font-semibold">
              An interactive roadmap guide from the historical rock city of Kurunegala to Anuradhapura via Wariyapola. 
              Find essential municipal utilities, local hotels, and legendary historical landmarks.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <button 
              onClick={() => handleTownSelect("kurunegala")}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-white shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              Start Exploring Route
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">A10 & A28 Waypoints</span>
          </div>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex-1">
        
        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Hospitals</div>
              <div className="font-bold text-sm">5 Locations</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Police Stations</div>
              <div className="font-bold text-sm">7 Stations</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Fuel Stops</div>
              <div className="font-bold text-sm">9 Junctions</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Heritage Sites</div>
              <div className="font-bold text-sm">4 Sights</div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        {towns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Compass className="w-12 h-12 text-amber-600 dark:text-amber-500 animate-spin mb-4" />
            <p className="text-zinc-500 font-semibold text-sm">Loading dynamic route map guide...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Timeline list of towns */}
            <div className="col-span-1 lg:col-span-7 xl:col-span-8 relative pl-6 border-l-2 border-dashed border-zinc-200 dark:border-zinc-800">
              {towns.map((town) => (
                <TownSection
                  key={town.id}
                  town={town}
                  isActive={town.id === activeTownId}
                  onPlaceClick={handlePlaceClick}
                />
              ))}
            </div>

            {/* Right Column: Sticky Interactive Map */}
            <div className="col-span-1 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)]">
              <InteractiveMap
                towns={towns}
                activeTownId={activeTownId}
                onTownSelect={handleTownSelect}
                selectedPlace={selectedPlace}
                clearSelectedPlace={clearSelectedPlace}
              />
            </div>

          </div>
        )}
      </main>

      {/* Modern footer */}
      <footer className="w-full py-12 mt-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700 dark:text-amber-500" />
            <span className="font-bold font-serif text-zinc-900 dark:text-zinc-100">
              Sri Lankan Roadway Guide
            </span>
          </div>
          <p>© 2026 Kurunegala-Wariyapola-Anuradhapura Travel Guide. For educational & tourism purposes.</p>
        </div>
      </footer>

    </div>
  );
}
