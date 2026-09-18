"use client";

import { useState } from "react";
import { Crosshair, ExternalLink, Flame, LoaderCircle, MapPin, Search } from "lucide-react";
import { getCity } from "@/data/places";
import { formatDistance } from "@/domain/places/ranking";
import type { CityKey, CurrentLocation, PlaceSearchResponse, PlaceSuggestion, PlanStep } from "@/types";

const placeCategories = new Set(["food", "cafe", "movie", "outdoor", "creative", "game", "discover", "chill", "active", "learn"]);

export function PlaceDiscovery({ step, city, currentLocation, onChoosePlace }: { step: PlanStep; city: CityKey; currentLocation: CurrentLocation | null; onChoosePlace: (place: PlaceSuggestion) => void }) {
  const [result, setResult] = useState<PlaceSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState<CurrentLocation | null>(currentLocation);
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "unavailable">("idle");
  const cityDetails = getCity(city);
  const query = [step.searchQuery, step.selectedChoice ?? step.title].filter(Boolean).join(" ");

  if (!placeCategories.has(step.category)) return null;

  async function discover(origin = location) {
    setLoading(true);
    setError("");
    try {
      const searchParams = new URLSearchParams({ city, query, category: step.category });
      if (origin) {
        searchParams.set("latitude", String(origin.latitude));
        searchParams.set("longitude", String(origin.longitude));
      }
      const response = await fetch(`/api/places/search?${searchParams}`);
      if (!response.ok) throw new Error("search-failed");
      setResult(await response.json() as PlaceSearchResponse);
    } catch {
      setError("Chưa tải được gợi ý. Bạn vẫn có thể mở Maps để tìm ngay.");
    } finally {
      setLoading(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      setError("Thiết bị này chưa hỗ trợ định vị. Mình vẫn tìm theo khu vực bạn đã chọn nhé.");
      return;
    }
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        setLocation(nextLocation);
        setLocationStatus("granted");
        void discover(nextLocation);
      },
      () => {
        setLocationStatus("unavailable");
        setError("Chưa lấy được vị trí. Bạn vẫn có thể xem gợi ý quanh khu vực đã chọn.");
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }

  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} ${cityDetails.label}`)}`;

  return (
    <section className="place-discovery" aria-label={`Gợi ý địa điểm cho ${step.title}`}>
      {!result && (
        <div className="place-discovery__actions">
          <button className="place-discovery__trigger" onClick={() => void discover()} disabled={loading}>
            {loading ? <LoaderCircle className="is-spinning" size={17} /> : <Flame size={17} />}
            <span><strong>{loading ? "Đang tìm chỗ hợp gu..." : "Tìm địa điểm theo khu vực"}</strong><small>{cityDetails.shortLabel} · xếp theo khoảng cách và độ phù hợp</small></span>
            {!loading && <Search size={16} />}
          </button>
          <button className="place-discovery__location" onClick={useCurrentLocation} disabled={loading || locationStatus === "requesting"}>
            {locationStatus === "requesting" ? <LoaderCircle className="is-spinning" size={15} /> : <Crosshair size={15} />}
            {locationStatus === "granted" ? "Đang dùng vị trí hiện tại" : "Dùng vị trí hiện tại"}
          </button>
        </div>
      )}

      <div aria-live="polite">
        {error && (
          <div className="place-discovery__error"><span>{error}</span><a href={directMapsUrl} target="_blank" rel="noreferrer">Mở Maps <ExternalLink size={13} /></a></div>
        )}

        {result?.source === "geoapify" && (
          <div className="place-results">
            <div className="place-results__heading">
              <span><MapPin size={14} /> {location ? "Gần vị trí hiện tại" : "Gần và hợp hoạt động"}</span>
              <small title={result.attribution}><a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Powered by Geoapify</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a></small>
            </div>
            {result.places.slice(0, 5).map((place) => {
              const distance = formatDistance(place.distanceMeters);
              return (
                <article className="place-card" key={place.id}>
                  <div className="place-card__score" aria-label={`Điểm phù hợp ${place.fitScore} trên 99`}><Flame size={13} />{place.fitScore}</div>
                  <div className="place-card__body">
                    <strong>{place.name}</strong>
                    <small>{place.primaryType && `${place.primaryType} · `}{place.address}</small>
                    <div>
                      {distance && <span><MapPin size={12} /> Cách trung tâm khoảng {distance}</span>}
                      <span>Xem đánh giá trên Google Maps</span>
                    </div>
                  </div>
                  <div className="place-card__actions"><button onClick={() => onChoosePlace(place)}>Chọn chỗ này</button><a href={place.googleMapsUri} target="_blank" rel="noreferrer" aria-label={`Mở ${place.name} trên Google Maps`}><ExternalLink size={15} /></a></div>
                </article>
              );
            })}
            <button className="place-results__refresh" onClick={() => void discover()} disabled={loading}>Làm mới gợi ý</button>
          </div>
        )}

        {result?.source === "trend-pack" && (
          <div className="trend-results">
            <div className="place-results__heading"><span><Flame size={14} /> Gợi ý hợp khu vực</span><small>{result.message}</small></div>
            <div className="trend-grid">
              {result.trends.map((trend) => {
                const googleMapsUri = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${trend.query} ${cityDetails.label}`)}`;
                return <article key={trend.id}>
                  <span>{trend.emoji}</span><div><strong>{trend.title}</strong><small>{trend.description}</small></div><div className="trend-card__actions"><button onClick={() => onChoosePlace({ id: trend.id, name: trend.title, address: trend.description, googleMapsUri, fitScore: 0 })}>Chọn chỗ này</button><a href={googleMapsUri} target="_blank" rel="noreferrer" aria-label={`Mở ${trend.title} trên Google Maps`}><ExternalLink size={14} /></a></div>
                </article>;
              })}
            </div>
          </div>
        )}
      </div>

      {result && <a className="place-discovery__maps" href={directMapsUrl} target="_blank" rel="noreferrer"><MapPin size={14} /> Xem thêm và đọc đánh giá trên Google Maps <ExternalLink size={12} /></a>}
    </section>
  );
}
