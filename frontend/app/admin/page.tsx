"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Compass, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Info,
  Building2, 
  Fuel, 
  HeartPulse, 
  ShieldCheck as PoliceIcon,
  BookOpen,
  Phone,
  Check,
  X
} from "lucide-react";
import Link from "next/link";
import { TownData } from "../route-data";

export default function AdminPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [towns, setTowns] = useState<TownData[]>([]);
  const [selectedTownId, setSelectedTownId] = useState<string>("kurunegala");
  const [selectedCategory, setSelectedCategory] = useState<string>("hotel"); // "hotel", "fuel", "hospital", "police", "history"
  
  // Form states
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Notification states
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== "admin") {
        router.push("/");
      } else {
        setAdminUser(parsed);
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const fetchTowns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/towns");
      if (res.ok) {
        const data = await res.json();
        setTowns(data);
      }
    } catch (e) {
      console.error("Failed to fetch towns:", e);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchTowns();
    }
  }, [adminUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const clearForm = () => {
    setName("");
    setDetails("");
    setContact("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification("Name / Title is required", "error");
      return;
    }

    const payload = {
      town_id: selectedTownId,
      type: selectedCategory,
      name: name.trim(),
      details: details.trim() || null,
      contact: contact.trim() || null
    };

    try {
      if (editingId) {
        // Edit existing place
        const res = await fetch(`http://localhost:5000/api/places/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: payload.name,
            details: payload.details,
            contact: payload.contact
          })
        });

        if (res.ok) {
          showNotification("Item updated successfully", "success");
          clearForm();
          fetchTowns();
        } else {
          showNotification("Failed to update item", "error");
        }
      } else {
        // Add new place
        const res = await fetch("http://localhost:5000/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showNotification("Item added successfully", "success");
          clearForm();
          fetchTowns();
        } else {
          showNotification("Failed to add item", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showNotification("Server error encountered", "error");
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name || item.title || "");
    setDetails(item.details || item.description || "");
    setContact(item.contact || "");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/places/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        showNotification("Item deleted successfully", "success");
        fetchTowns();
        if (editingId === id) {
          clearForm();
        }
      } else {
        showNotification("Failed to delete item", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Server error encountered", "error");
    }
  };

  // Get current active town object
  const currentTown = towns.find(t => t.id === selectedTownId);

  // Get items for selected town and category
  const getCategoryItems = () => {
    if (!currentTown) return [];
    if (selectedCategory === "hotel") return currentTown.hotels || [];
    if (selectedCategory === "fuel") return currentTown.fuel || [];
    if (selectedCategory === "hospital") return currentTown.hospitals || [];
    if (selectedCategory === "police") return currentTown.police || [];
    if (selectedCategory === "history") {
      return (currentTown.history || []).map((h: any) => ({
        id: h.id,
        name: h.title,
        details: h.description,
        contact: ""
      }));
    }
    return [];
  };

  const items = getCategoryItems();

  const getCategoryIcon = (cat: string) => {
    if (cat === "hotel") return <Building2 className="w-4 h-4 text-amber-500" />;
    if (cat === "fuel") return <Fuel className="w-4 h-4 text-orange-500" />;
    if (cat === "hospital") return <HeartPulse className="w-4 h-4 text-red-500" />;
    if (cat === "police") return <PoliceIcon className="w-4 h-4 text-blue-500" />;
    return <BookOpen className="w-4 h-4 text-purple-500" />;
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
        <div className="animate-pulse text-zinc-500 font-semibold text-sm">Verifying administration access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 flex flex-col">
      {/* Header */}
      <nav className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <span className="font-serif font-bold text-sm tracking-wide text-zinc-900 dark:text-zinc-50">
              Heritage Route Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/30 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Town selector list */}
        <div className="w-full lg:w-1/4 shrink-0">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-2">Select Stop Town</h2>
          <div className="space-y-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-2xl shadow-sm">
            {towns.map((town) => (
              <button
                key={town.id}
                onClick={() => {
                  setSelectedTownId(town.id);
                  clearForm();
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedTownId === town.id
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/25"
                    : "hover:bg-zinc-150 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350"
                }`}
              >
                <span>{town.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedTownId === town.id 
                    ? "bg-white/20 text-white" 
                    : "bg-zinc-100 dark:bg-zinc-850 text-zinc-500"
                }`}>
                  Stop {town.order}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Operations Panel */}
        <div className="flex-1 flex flex-col">
          {notification && (
            <div className={`p-4 mb-6 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in border ${
              notification.type === "success" 
                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30" 
                : "bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-450 border-red-100 dark:border-red-900/30"
            }`}>
              {notification.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {notification.message}
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            {[
              { id: "hotel", label: "Hotels & Stays", icon: Building2 },
              { id: "fuel", label: "Fuel Stations", icon: Fuel },
              { id: "hospital", label: "Hospitals", icon: HeartPulse },
              { id: "police", label: "Police Stations", icon: PoliceIcon },
              { id: "history", label: "Heritage & Landmarks", icon: BookOpen }
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    clearForm();
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-250 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <div className="xl:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50 mb-5 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                {editingId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-amber-500" />}
                {editingId ? "Modify Existing Item" : "Register New Place"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    {selectedCategory === "history" ? "Heritage/Sight Title" : "Place/Business Name"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={selectedCategory === "history" ? "e.g. Ancient Temple" : "e.g. Heritage Rest Inn"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    Short Description / Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details, opening times, or unique details..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                {selectedCategory !== "history" && (
                  <div>
                    <label className="block text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                      Contact Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 037 222 3456"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                )}

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-md shadow-amber-600/15 transition-all text-center cursor-pointer"
                  >
                    {editingId ? "Save Modifications" : "Add to Roadmap"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={clearForm}
                      className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold transition-all cursor-pointer flex items-center justify-center"
                      title="Cancel Edit"
                    >
                      <X className="w-4 h-4 text-zinc-650 dark:text-zinc-300" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="xl:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                  {getCategoryIcon(selectedCategory)}
                  Current Records in {currentTown?.name}
                </h3>
                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold">
                  {items.length} records
                </span>
              </div>

              {items.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                  <Info className="w-8 h-8 text-zinc-400 mb-2.5" />
                  <p className="text-zinc-500 font-bold text-xs">No registered locations for this stop & category.</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Use the panel on the left to add the first location!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5">
                  {items.map((item: any) => (
                    <div 
                      key={item.id} 
                      className={`p-5 rounded-2xl bg-white dark:bg-zinc-900 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        editingId === item.id 
                          ? "border-amber-500 shadow-md shadow-amber-500/5 ring-1 ring-amber-500" 
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                        <div className="font-bold text-sm text-zinc-950 dark:text-zinc-55 font-serif truncate">
                          {item.name || item.title}
                        </div>
                        {(item.details || item.description) && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                            {item.details || item.description}
                          </p>
                        )}
                        {item.contact && (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-2 py-0.5 rounded w-fit font-bold">
                            <Phone className="w-3 h-3" />
                            {item.contact}
                          </div>
                        )}
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400 text-zinc-450 border border-zinc-150 dark:border-zinc-750 transition-colors cursor-pointer"
                          title="Modify Entry"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-450 text-zinc-450 border border-zinc-150 dark:border-zinc-750 transition-colors cursor-pointer"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </main>

      {/* Footer / Back Navigation */}
      <div className="max-w-7xl w-full mx-auto px-6 mb-8 flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-white shadow-md transition-all hover:scale-105 cursor-pointer text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Heritage Roadmap Guide
        </Link>
      </div>

      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
        <p>© 2026 Kurunegala-Wariyapola-Anuradhapura Travel Guide. Administrator Control System.</p>
      </footer>
    </div>
  );
}
