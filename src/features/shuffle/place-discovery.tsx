"use client";

import { useState } from "react";
import { ExternalLink, Flame, LoaderCircle, MapPin, Search } from "lucide-react";
import { getCity } from "@/data/places";
import { formatDistance } from "@/domain/places/ranking";
import type { CityKey, PlaceSearchResponse, PlanStep } from "@/types";

const placeCategories = new Set(["food", "cafe", "movie", "outdoor", "creative", "game", "discover", "chill", "active", "learn"]);

export function PlaceDiscovery({ step, city }: { step: PlanStep; city: CityKey }) {
  const [result, setResult] = useState<PlaceSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cityDetails = getCity(city);
  const query = [step.searchQuery, step.selectedChoice ?? step.title].filter(Boolean).join(" ");

  if (!placeCategories.has(step.category)) return null;

  async function discover() {
    setLoading(true);
    setError("");
    try {
      const searchParams = new URLSearchParams({ city, query, category: step.category });
      const response = await fetch(`/api/places/search?${searchParams}`);
      if (!response.ok) throw new Error("search-failed");
      setResult(await response.json() as PlaceSearchResponse);
    } catch {
      setError("Chưa tải được gợi ý. Bạn vẫn có thể mở Maps để tìm ngay.");
    } finally {
      setLoading(false);
    }
  }

  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} ${cityDetails.label}`)}`;

  return (
    <section className="place-discovery" aria-label={`Gợi ý địa điểm cho ${step.title}`}>
      {!result && (
        <button className="place-discovery__trigger" onClick={() => void discover()} disabled={loading}>
          {loading ? <LoaderCircle className="is-spinning" size={17} /> : <Flame size={17} />}
          <span><strong>{loading ? "Đang tìm chỗ hợp gu..." : "Tìm địa điểm thật quanh đây"}</strong><small>{cityDetails.shortLabel} · xếp theo khoảng cách và độ phù hợp</small></span>
          {!loading && <Search size={16} />}
        </button>
      )}

      <div aria-live="polite">
        {error && (
          <div className="place-discovery__error"><span>{error}</span><a href={directMapsUrl} target="_blank" rel="noreferrer">Mở Maps <ExternalLink size={13} /></a></div>
        )}

        {result?.source === "geoapify" && (
          <div className="place-results">
            <div className="place-results__heading">
              <span><MapPin size={14} /> Gần và hợp hoạt động</span>
              <small title={result.attribution}><a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Powered by Geoapify</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a></small>
            </div>
            {result.places.slice(0, 5).map((place) => {
              const distance = formatDistance(place.distanceMeters);
              return (
                <a className="place-card" key={place.id} href={place.googleMapsUri} target="_blank" rel="noreferrer">
                  <div className="place-card__score" aria-label={`Điểm phù hợp ${place.fitScore} trên 99`}><Flame size={13} />{place.fitScore}</div>
                  <div className="place-card__body">
                    <strong>{place.name}</strong>
                    <small>{place.primaryType && `${place.primaryType} · `}{place.address}</small>
                    <div>
                      {distance && <span><MapPin size={12} /> Cách trung tâm khoảng {distance}</span>}
                      <span>Xem đánh giá trên Google Maps</span>
                    </div>
                  </div>
                  <ExternalLink size={15} />
                </a>
              );
            })}
            <button className="place-results__refresh" onClick={() => void discover()} disabled={loading}>Làm mới gợi ý</button>
          </div>
        )}

        {result?.source === "trend-pack" && (
          <div className="trend-results">
            <div className="place-results__heading"><span><Flame size={14} /> Gợi ý hợp khu vực</span><small>{result.message}</small></div>
            <div className="trend-grid">
              {result.trends.map((trend) => (
                <a key={trend.id} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${trend.query} ${cityDetails.label}`)}`} target="_blank" rel="noreferrer">
                  <span>{trend.emoji}</span><div><strong>{trend.title}</strong><small>{trend.description}</small></div><ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {result && <a className="place-discovery__maps" href={directMapsUrl} target="_blank" rel="noreferrer"><MapPin size={14} /> Xem thêm và đọc đánh giá trên Google Maps <ExternalLink size={12} /></a>}
    </section>
  );
}
