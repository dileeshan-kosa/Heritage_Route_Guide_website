"use client";

import React, { useState } from "react";
import { TownData } from "../route-data";
import { 
  Compass, 
  Building2, 
  HeartPulse, 
  ShieldCheck, 
  Fuel,
  Info,
  Map
} from "lucide-react";

interface InteractiveMapProps {
  towns: TownData[];
  activeTownId: string;
  onTownSelect: (townId: string) => void;
  selectedPlace: { type: string; name: string } | null;
  clearSelectedPlace: () => void;
}

type FilterType = "all" | "history" | "hotels" | "hospitals" | "police" | "fuel";
type MapTabType = "route" | "google";

export default function InteractiveMap({ 
  towns, 
  activeTownId, 
  onTownSelect,
  selectedPlace,
  clearSelectedPlace
}: InteractiveMapProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState<MapTabType>("route");

  // Determine if a town has a category
  const hasCategory = (town: TownData, filter: FilterType) => {
    if (filter === "all") return true;
    if (filter === "history") return !!(town.history && town.history.length > 0);
    if (filter === "hotels") return !!(town.hotels && town.hotels.length > 0);
    if (filter === "hospitals") return !!(town.hospitals && town.hospitals.length > 0);
    if (filter === "police") return !!(town.police && town.police.length > 0);
    if (filter === "fuel") return !!(town.fuel && town.fuel.length > 0);
    return false;
  };

  // Get active town object
  const activeTown = towns.find(t => t.id === activeTownId) || towns[0];

  // Draw smooth SVG path through the towns ordered by coordinate
  const generatePathD = () => {
    if (towns.length === 0) return "";
    const sorted = [...towns].sort((a, b) => a.order - b.order);
    return sorted.reduce((acc, town, index) => {
      const command = index === 0 ? "M" : "L";
      return `${acc} ${command} ${town.coordinates.x}% ${town.coordinates.y}%`;
    }, "");
  };

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-250 rounded-3xl overflow-hidden shadow-xl p-5 md:p-6 transition-all duration-300">
      
      {/* Map Header & Tab Switches */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-wide flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-spin-slow" />
            Route Map Guide
          </h3>
          
          {/* Map Type Switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab("route")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "route"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm border border-zinc-200/50 dark:border-zinc-600/50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Route Map
            </button>
            <button
              onClick={() => setActiveTab("google")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "google"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm border border-zinc-200/50 dark:border-zinc-600/50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Google Map
            </button>
          </div>
        </div>
        
        {/* Filter Badges - Only visible for SVG Route Map */}
        {activeTab === "route" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              { id: "all", label: "Show All", icon: Compass, color: "hover:bg-zinc-100 dark:hover:bg-zinc-800" },
              { id: "history", label: "Historical", icon: Compass, color: "text-amber-705 dark:text-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border-amber-200/55 dark:border-amber-900/40" },
              { id: "hotels", label: "Stays", icon: Building2, color: "text-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200/55 dark:border-zinc-700/50" },
              { id: "hospitals", label: "Medical", icon: HeartPulse, color: "text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 border-red-200/55 dark:border-red-900/40" },
              { id: "police", label: "Police", icon: ShieldCheck, color: "text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 border-blue-200/55 dark:border-blue-900/40" },
              { id: "fuel", label: "Fuel", icon: Fuel, color: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200/55 dark:border-zinc-700/50" }
            ].map((btn) => {
              const Icon = btn.icon;
              const isSelected = activeFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id as FilterType)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm" 
                      : `bg-zinc-50 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 ${btn.color}`
                  }`}
                >
                  {btn.id !== "all" && <Icon className="w-3 h-3" />}
                  {btn.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div className="relative flex-1 min-h-[380px] bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
        {activeTab === "route" ? (
          <>
            {/* Map Grid / Gridlines */}
            <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-70 dark:opacity-50 pointer-events-none" />

            <svg className="w-full h-full absolute inset-0 select-none">
              {/* Base Road Highway Track */}
              <path
                d={generatePathD()}
                fill="none"
                stroke="rgba(0, 0, 0, 0.05)"
                className="dark:stroke-white/5"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={generatePathD()}
                fill="none"
                stroke="#d4d4d8"
                className="dark:stroke-zinc-700"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 4"
              />

              {/* Glowing Travel Progress Highlight Line */}
              {activeTown && (
                <path
                  d={(() => {
                    const sorted = [...towns].sort((a, b) => a.order - b.order);
                    const activeIndex = sorted.findIndex(t => t.id === activeTownId);
                    const progressTowns = sorted.slice(0, activeIndex + 1);
                    return progressTowns.reduce((acc, town, index) => {
                      const command = index === 0 ? "M" : "L";
                      return `${acc} ${command} ${town.coordinates.x}% ${town.coordinates.y}%`;
                    }, "");
                  })()}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-amber-500 transition-all duration-700"
                />
              )}

              {/* SVG Town Nodes */}
              {towns.map((town) => {
                const isActive = town.id === activeTownId;
                const matchesFilter = hasCategory(town, activeFilter);
                
                return (
                  <g 
                    key={town.id} 
                    className="cursor-pointer group"
                    onClick={() => onTownSelect(town.id)}
                  >
                    {/* Active Pulsing Ring */}
                    {isActive && (
                      <circle
                        cx={`${town.coordinates.x}%`}
                        cy={`${town.coordinates.y}%`}
                        r="12"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="2"
                        className="dark:stroke-amber-500 animate-ping"
                        style={{ transformOrigin: `${town.coordinates.x}% ${town.coordinates.y}%` }}
                      />
                    )}

                    {/* Base Outer Glow */}
                    <circle
                      cx={`${town.coordinates.x}%`}
                      cy={`${town.coordinates.y}%`}
                      r={isActive ? "9" : "6"}
                      fill={isActive ? "#d97706" : matchesFilter ? "#71717a" : "#e4e4e7"}
                      className="dark:fill-zinc-800 transition-all duration-300 group-hover:fill-amber-600 dark:group-hover:fill-amber-500 group-hover:scale-125"
                      style={{ transformOrigin: `${town.coordinates.x}% ${town.coordinates.y}%` }}
                    />

                    {/* Inner Dot */}
                    <circle
                      cx={`${town.coordinates.x}%`}
                      cy={`${town.coordinates.y}%`}
                      r={isActive ? "4" : "2"}
                      fill="#ffffff"
                      className="transition-all duration-300"
                    />

                    {/* Town Labels */}
                    <text
                      x={`${town.coordinates.x}%`}
                      y={`${town.coordinates.y}%`}
                      dy={town.coordinates.y > 50 ? "-14" : "20"}
                      textAnchor="middle"
                      className={`text-[10px] font-sans font-semibold tracking-wide transition-all duration-300 pointer-events-none ${
                        isActive 
                          ? "fill-amber-700 dark:fill-amber-400 text-xs scale-105" 
                          : matchesFilter
                            ? "fill-zinc-850 dark:fill-zinc-200 opacity-95 group-hover:fill-amber-700 dark:group-hover:fill-amber-400"
                            : "fill-zinc-400 dark:fill-zinc-600 opacity-45"
                      }`}
                    >
                      {town.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </>
        ) : (
          <iframe
            src={`https://maps.google.com/maps?q=${activeTown.lat},${activeTown.lng}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0 dark:invert-[0.9] dark:hue-rotate-180"
            allowFullScreen
            loading="lazy"
            title={`${activeTown.name} Live Map`}
          />
        )}

        {/* Selected Place Overlay Notification */}
        {selectedPlace && (
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-zinc-900 dark:bg-zinc-850 text-white border border-zinc-800 dark:border-zinc-700 rounded-xl flex items-start gap-2.5 text-xs shadow-xl animate-fade-in z-10">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-zinc-400 uppercase tracking-wider text-[9px] font-bold">
                Selected {selectedPlace.type}
              </span>
              <h4 className="font-bold text-amber-400 font-serif">{selectedPlace.name}</h4>
              <p className="text-[10px] text-zinc-300 mt-0.5">Located in {activeTown.name}</p>
            </div>
            <button 
              onClick={clearSelectedPlace}
              className="text-zinc-400 hover:text-white cursor-pointer px-1 text-[10px] uppercase font-bold"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* active town mini HUD */}
      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-3 items-center">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-550 shrink-0">
          <Compass className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Active Focus
            </span>
            <span className="w-1 h-1 rounded-full bg-amber-600 dark:bg-amber-500 animate-pulse" />
          </div>
          <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">
            {activeTown.name} {activeTown.sinhalaName && `(${activeTown.sinhalaName})`}
          </h4>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
            {activeTown.description}
          </p>
        </div>
      </div>
    </div>
  );
}
