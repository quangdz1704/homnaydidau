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

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const query = searchParams.get("query")?.trim().slice(0, 120) ?? "";
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

  const { latitude, longitude } = cityDetails.center;
  const params = new URLSearchParams({
    categories: geoapifyCategories.join(","),
    filter: `circle:${longitude},${latitude},${cityDetails.searchRadiusMeters}`,
    bias: `proximity:${longitude},${latitude}`,
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
        address: place.address_line2 ?? place.formatted ?? cityDetails.label,
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
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400" } },
    );
  } catch {
    return trendResponse(validCategory, validCity, "Không kết nối được nguồn trực tiếp nên Shuff chuyển sang gợi ý địa phương.");
  }
}
