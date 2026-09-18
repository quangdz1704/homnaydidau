import { NextResponse } from "next/server";
import { getGeoapifyCategories, getPlaceTypeLabel } from "@/data/geoapify";
import { CITY_OPTIONS, getCity, getTrendSuggestions } from "@/data/places";
import { calculateFitScore, calculateQueryRelevance } from "@/domain/places/ranking";
import type { Category, CityKey, PlaceSearchResponse, PlaceSuggestion } from "@/types";

export const dynamic = "force-dynamic";

const categories: Category[] = ["food", "cafe", "movie", "outdoor", "creative", "game", "discover", "chill", "active", "learn", "home"];

interface GeoapifyFeature {
  properties?: {
    place_id?: string;
    name?: string;
    formatted?: string;
    address_line2?: string;
    categories?: string[];
    distance?: number;
    lat?: number;
    lon?: number;
  };
}

function trendResponse(category: Category, city: CityKey, message: string) {
  return NextResponse.json<PlaceSearchResponse>(
    { source: "trend-pack", trends: getTrendSuggestions(category, city), message },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

function googleMapsUrl(name: string, city: string, latitude?: number, longitude?: number) {
  const location = latitude !== undefined && longitude !== undefined
    ? `${name} ${latitude},${longitude}`
    : `${name} ${city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

function validCoordinate(value: string | null, minimum: number, maximum: number) {
  if (value === null) return undefined;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= minimum && coordinate <= maximum
    ? coordinate
    : undefined;
}

async function reverseGeocode(latitude: number, longitude: number) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) return null;
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    lang: "vi",
    format: "json",
    limit: "1",
    apiKey,
  });
  const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?${params}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) return null;
  const payload = await response.json() as {
    results?: Array<{
      formatted?: string;
      neighbourhood?: string;
      suburb?: string;
      district?: string;
      city_district?: string;
      county?: string;
      municipality?: string;
      city?: string;
      state_district?: string;
      state?: string;
      country?: string;
    }>;
  };
  const place = payload.results?.[0];
  if (!place) return null;
  const parts = [
    place.neighbourhood,
    place.suburb,
    place.district,
    place.city_district,
    place.county,
    place.municipality,
    place.city,
    place.state_district,
    place.state,
  ].filter((part): part is string => Boolean(part));
  const uniqueParts = parts.filter((part, index) =>
    parts.findIndex((candidate) => candidate.localeCompare(part, "vi", { sensitivity: "base" }) === 0) === index,
  );
  if (uniqueParts.length) return uniqueParts.slice(0, 3).join(", ");
  return place.formatted?.split(",").map((part) => part.trim()).filter((part) => part && part !== place.country).slice(-3).join(", ") || null;
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const query = searchParams.get("query")?.trim().slice(0, 120) ?? "";
  const latitude = validCoordinate(searchParams.get("latitude"), -90, 90);
  const longitude = validCoordinate(searchParams.get("longitude"), -180, 180);
  if (searchParams.get("mode") === "reverse") {
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Thiếu toạ độ vị trí." }, { status: 400 });
    }
    try {
      const label = await reverseGeocode(latitude, longitude);
      return NextResponse.json({ label }, { headers: { "Cache-Control": "private, no-store" } });
    } catch {
      return NextResponse.json({ label: null }, { headers: { "Cache-Control": "private, no-store" } });
    }
  }
  if (!CITY_OPTIONS.some((option) => option.value === city) || !categories.includes(category as Category) || !query) {
    return NextResponse.json({ error: "Thiếu thành phố hoặc nội dung tìm kiếm." }, { status: 400 });
  }

  const validCity = city as CityKey;
  const validCategory = category as Category;
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return trendResponse(validCategory, validCity, "Geoapify chưa được cấu hình; Shuff đang dùng bộ gợi ý địa phương.");
  }

  const cityDetails = getCity(validCity);
  const geoapifyCategories = getGeoapifyCategories(validCategory, query);
  if (!geoapifyCategories.length) {
    return trendResponse(validCategory, validCity, "Hoạt động này phù hợp làm tại nhà nên chưa cần tìm địa điểm.");
  }

  const center = latitude !== undefined && longitude !== undefined
    ? { latitude, longitude, radius: 8_000, label: "vị trí hiện tại" }
    : { ...cityDetails.center, radius: cityDetails.searchRadiusMeters, label: cityDetails.label };
  const params = new URLSearchParams({
    categories: geoapifyCategories.join(","),
    filter: `circle:${center.longitude},${center.latitude},${center.radius}`,
    bias: `proximity:${center.longitude},${center.latitude}`,
    limit: "20",
    lang: "vi",
    apiKey,
  });

  try {
    const response = await fetch(`https://api.geoapify.com/v2/places?${params}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(7_000),
    });

    if (!response.ok) {
      return trendResponse(validCategory, validCity, "Nguồn địa điểm trực tiếp đang bận nên Shuff chuyển sang gợi ý địa phương.");
    }

    const payload = await response.json() as { features?: GeoapifyFeature[] };
    const places: PlaceSuggestion[] = (payload.features ?? []).flatMap((feature, rank) => {
      const place = feature.properties;
      if (!place?.place_id || !place.name) return [];
      const relevance = calculateQueryRelevance(query, place.name, place.categories);
      return [{
        id: place.place_id,
        name: place.name,
        address: place.address_line2 ?? place.formatted ?? center.label,
        distanceMeters: place.distance,
        googleMapsUri: googleMapsUrl(place.name, cityDetails.label, place.lat, place.lon),
        primaryType: getPlaceTypeLabel(place.categories),
        fitScore: calculateFitScore({ distanceMeters: place.distance, rank, relevance }),
      }];
    }).sort((a, b) => b.fitScore - a.fitScore);

    if (!places.length) {
      return trendResponse(validCategory, validCity, "Chưa thấy địa điểm phù hợp; thử một gợi ý gần gũi hơn nhé.");
    }

    return NextResponse.json<PlaceSearchResponse>(
      { source: "geoapify", places, attribution: "Dữ liệu địa điểm từ Geoapify và OpenStreetMap" },
      { headers: { "Cache-Control": latitude !== undefined ? "private, no-store" : "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400" } },
    );
  } catch {
    return trendResponse(validCategory, validCity, "Không kết nối được nguồn trực tiếp nên Shuff chuyển sang gợi ý địa phương.");
  }
}
