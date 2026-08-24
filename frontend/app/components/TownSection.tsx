"use client";

import React from "react";
import { TownData } from "../route-data";
import { 
  HeartPulse, 
  ShieldCheck, 
  Fuel, 
  Building2, 
  Compass, 
  MapPin,
  ChevronRight
} from "lucide-react";

interface TownSectionProps {
  town: TownData;
  isActive: boolean;
  onPlaceClick: (type: string, name: string) => void;
}

export default function TownSection({ town, isActive, onPlaceClick }: TownSectionProps) {
  return (
    <section 
      id={`town-${town.id}`}
      data-town-id={town.id}
      className={`relative mb-24 scroll-mt-24 transition-all duration-700 ${
        isActive ? "opacity-100 scale-[1.01]" : "opacity-60 scale-100"
      }`}
    >
      {/* Timeline connector & indicator */}
      <div className="absolute left-[-25px] top-0 bottom-[-96px] w-[2px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none md:left-[-33px]">
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 transition-all duration-500 ${
          isActive 
            ? "bg-amber-600 dark:bg-amber-500 scale-125 shadow-lg shadow-amber-600/30" 
            : "bg-zinc-300 dark:bg-zinc-700"
        }`} />
      </div>

      <div className="pl-6 md:pl-10">
        {/* Title */}
        <div className="flex flex-wrap items-baseline gap-3 mb-4">
          <span className="text-sm font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            Stop {town.order}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            {town.name}
          </h2>
          {town.sinhalaName && (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-sans border border-zinc-200 dark:border-zinc-700">
              {town.sinhalaName}
            </span>
          )}
        </div>

        {/* Intro */}
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-2xl text-base">
          {town.description}
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Historical Sights */}
          {town.history && town.history.length > 0 && (
            <div className="col-span-1 md:col-span-2 border border-amber-500/20 bg-amber-500/[0.02] dark:bg-amber-500/[0.01] rounded-2xl p-6 transition-all duration-300 hover:border-amber-500/40">
              <div className="flex items-center gap-2 mb-4 text-amber-750 dark:text-amber-500">
                <Compass className="w-5 h-5" />
                <h3 className="font-semibold text-lg font-serif">Heritage & Landmarks</h3>
              </div>
              <div className="space-y-4">
                {town.history.map((hist, idx) => (
                  <div key={idx} className="group">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      {hist.title}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {hist.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotels */}
          {town.hotels && town.hotels.length > 0 && (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3.5 text-zinc-855 dark:text-zinc-300">
                <Building2 className="w-4.5 h-4.5 text-amber-600 dark:text-amber-500" />
                <h3 className="font-semibold text-base font-serif">Hotels & Stays</h3>
              </div>
              <ul className="space-y-3">
                {town.hotels.map((h, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => onPlaceClick("hotel", h.name)}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors group border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-200 flex items-center justify-between">
                      <span>{h.name}</span>
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
                    </div>
                    {h.details && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{h.details}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hospitals */}
          {town.hospitals && town.hospitals.length > 0 && (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3.5 text-red-650 dark:text-red-450">
                <HeartPulse className="w-4.5 h-4.5" />
                <h3 className="font-semibold text-base font-serif">Hospitals & Health</h3>
              </div>
              <ul className="space-y-3">
                {town.hospitals.map((h, idx) => (
                  <li 
                    key={idx}
                    onClick={() => onPlaceClick("hospital", h.name)}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer transition-colors group border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-200 flex items-center justify-between">
                      <span>{h.name}</span>
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-red-500 transition-colors" />
                    </div>
                    {h.details && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{h.details}</p>}
                    {h.contact && (
                      <span className="inline-block text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/40">
                        Tel: {h.contact}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Police Stations */}
          {town.police && town.police.length > 0 && (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3.5 text-blue-600 dark:text-blue-405">
                <ShieldCheck className="w-4.5 h-4.5" />
                <h3 className="font-semibold text-base font-serif">Police Stations</h3>
              </div>
              <ul className="space-y-3">
                {town.police.map((p, idx) => (
                  <li 
                    key={idx}
                    onClick={() => onPlaceClick("police", p.name)}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors group border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-200 flex items-center justify-between">
                      <span>{p.name}</span>
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                    {p.details && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{p.details}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fuel Stations */}
          {town.fuel && town.fuel.length > 0 && (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3.5 text-zinc-800 dark:text-zinc-300">
                <Fuel className="w-4.5 h-4.5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-semibold text-base font-serif">Fuel Stations</h3>
              </div>
              <ul className="space-y-3">
                {town.fuel.map((f, idx) => (
                  <li 
                    key={idx}
                    onClick={() => onPlaceClick("fuel", f.name)}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors group border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-200 flex items-center justify-between">
                      <span>{f.name}</span>
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
                    </div>
                    {f.details && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{f.details}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
