export type _Location = {
  lat: number;
  lng: number;
};

export type Viewport = {
  northeast: _Location;
  southwest: _Location;
};

export type Geometry = {
  location: _Location;
  viewport: Viewport;
};

export type PlusCode = {
  compound_code: string;
  global_code: string;
};

export type OpeningHours = {
  open_now?: boolean;
};

export type Result = {
  business_status: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours: OpeningHours;
  place_id: string;
  plus_code: PlusCode;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
};

export type Recomendations = {
  html_attributions: any[];
  results: Result[];
  status: string;
};
