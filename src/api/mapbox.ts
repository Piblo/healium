import queryString from "query-string";

const baseUrl = `https://api.mapbox.com`;
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export async function searchCity(cityName: string): Promise<PlacesResponse> {
  const query = queryString.stringify({
    country: "es",
    proximity: "ip",
    access_token: token,
    types: ["place", "country", "region"],
    language: "es",
  });

  const response = await fetch(
    `${baseUrl}/geocoding/v5/mapbox.places/${cityName}.json?${query}`
  );

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Mapbox API error");
  }

  return response.json();
}

export interface PlacesResponse {
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}

export interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text: string;
  place_name: string;
  bbox: number[];
  center: number[];
  geometry: Geometry;
  context?: Context[];
}

export interface Context {
  id: string;
  wikidata: string;
  text: string;
  short_code?: string;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  wikidata: string;
}
