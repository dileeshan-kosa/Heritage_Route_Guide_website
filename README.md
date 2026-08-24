# Kurunegala to Anuradhapura via Wariyapola - Travel Roadway Guide

A premium, interactive frontend travel guide website designed for tourists traveling from **Kurunegala** to the sacred city of **Anuradhapura** via **Wariyapola** (along the A10 and A28 highways). 

This application offers an aesthetic and sequential roadmap detailing vital utility stations (hospitals, police stations, fuel stations, hotels) and rich historical landmarks.

## Key Features

- **Sequential Timeline**: A clear, ordered travel checklist detailing nine key intermediate stops (Kurunegala, Wariyapola, Padeniya, Galgamuwa, Ambanpola, Mahagalkadawala, Tambuttegama, Talawa, and Anuradhapura).
- **Split-Screen Layout**:
  - **Left Side**: Scrollable card list organizing municipal facilities, contacts, and legends.
  - **Right Side**: A sticky interactive map container with tab toggling.
- **Dual Map Integration**:
  - **Route Map (SVG)**: A stylized vector highway track with progressive highlight, glowing town nodes, and category-based highlighting filters (e.g. Stays, Medical, Police, Fuel, Sights).
  - **Google Map (Iframe)**: A live Google Map embed that automatically centers on the selected town as you scroll or click.
- **Scrollspy Synchronization**: An intersection observer automatically tracks travel progress and lights up corresponding map nodes in real-time as you scroll.
- **Color Theme Switcher**: A sticky glassmorphic navigation header providing one-click switching between **White Theme** (crisp minimalist light design) and **Dark Theme** (rich deep-green tinted dark mode).
- **Offline Assets**: Background images are generated and stored locally in the `/public` folder to ensure fast, offline-friendly page loads.

## Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Library**: React 19 & TypeScript
- **Icons**: Lucide React
- **Styling**: Vanilla Tailwind CSS v4

---

## Getting Started

To run the project locally, install dependencies and launch the dev server:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the website.

4. **Production Build**:
   To compile and optimize the app for production:
   ```bash
   npm run build
   npm run start
   ```

---

## Project Structure

- `app/`
  - `components/`
    - `InteractiveMap.tsx`: Handles both the SVG route highway path and the dynamic Google Maps iframe embed.
    - `TownSection.tsx`: Formats the details cards for each waypoint category (e.g. Hospital, Hotel).
  - `page.tsx`: Core layout, theme switcher, and scroll-spy observer logic.
  - `globals.css`: Tailwind configuration and custom CSS variables for light/dark mode.
  - `route-data.ts`: Structured dataset containing names, Sinhala translation tags, geographical coordinates, and specific place attributes for all towns.
- `public/`
  - `ruwanwelisaya.png`: Local high-resolution background hero photo of the stupa.
