export interface PlaceItem {
  id?: number;
  name: string;
  details?: string;
  contact?: string;
}

export interface HistoricalItem {
  id?: number;
  title: string;
  description: string;
}

export interface TownData {
  id: string;
  name: string;
  tamilName?: string;
  sinhalaName?: string;
  description: string;
  order: number;
  coordinates: { x: number; y: number }; // SVG map percentage coordinates
  lat: number;
  lng: number;
  hospitals?: PlaceItem[];
  police?: PlaceItem[];
  fuel?: PlaceItem[];
  hotels?: PlaceItem[];
  history?: HistoricalItem[];
}
