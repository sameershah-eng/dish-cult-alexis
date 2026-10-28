import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, ExternalLink, Star } from 'lucide-react';
import { Restaurant } from '../../types';

interface InteractiveMapProps {
  restaurants?: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  height?: string;
}

// Dark map style JSON fallback when Map ID is not provided
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#141417' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0B0D' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#A8A29E' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#F6F1EA' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#F7B733' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#1E1E23' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1E1E23' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#141417' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2B2B33' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0B0B0D' }],
  },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  restaurants = [],
  selectedRestaurant,
  onSelectRestaurant,
  center = { lat: 55.8642, lng: -4.2518 }, // Glasgow default
  zoom = 13,
  className = '',
  height = '450px',
}) => {
  const browserKey =
    import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    '';

  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID';
  const [activeMarker, setActiveMarker] = useState<Restaurant | null>(selectedRestaurant || null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    if (selectedRestaurant) {
      setActiveMarker(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const defaultCenter = selectedRestaurant?.location?.lat
    ? { lat: selectedRestaurant.location.lat, lng: selectedRestaurant.location.lng }
    : center;

  // If no browser key is available, show an elegant dark fallback card
  if (!browserKey) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-8 rounded-2xl bg-coal border border-smoke text-center overflow-hidden ${className}`}
        style={{ minHeight: height }}
      >
        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-4">
          <MapPin className="w-7 h-7" />
        </div>
        <h4 className="font-serif text-lg font-bold text-cream">Interactive Dining Map</h4>
        <p className="text-xs text-muted max-w-sm mt-1 mb-4 leading-relaxed">
          {selectedRestaurant
            ? `${selectedRestaurant.name} · ${selectedRestaurant.address}`
            : 'Explore partner venues with real-time location mapping and routing.'}
        </p>

        {selectedRestaurant?.mapsUrl ? (
          <a
            href={selectedRestaurant.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-lg hover:shadow-brand/30 transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
          </a>
        ) : (
          <span className="text-[11px] text-muted border border-smoke px-3 py-1.5 rounded-lg bg-smoke/40">
            Coordinates: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-smoke shadow-2xl ${className}`} style={{ height }}>
      {quotaExceeded && (
        <div className="absolute top-0 inset-x-0 z-30 bg-amber-500/90 text-black px-3 py-1.5 text-xs text-center font-medium shadow-md">
          Google Maps Platform demo quota reached. Map is using cached tiles.
        </div>
      )}

      <APIProvider apiKey={browserKey}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={zoom}
          mapId={mapId}
          styles={DARK_MAP_STYLES}
          disableDefaultUI={false}
          zoomControl={true}
          gestureHandling="cooperative"
          className="w-full h-full"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          {/* If single venue mode */}
          {selectedRestaurant && selectedRestaurant.location?.lat ? (
            <AdvancedMarker
              position={{
                lat: selectedRestaurant.location.lat,
                lng: selectedRestaurant.location.lng,
              }}
              title={selectedRestaurant.name}
            >
              <Pin background="#E5173F" borderColor="#0B0B0D" glyphColor="#FFFFFF" />
            </AdvancedMarker>
          ) : (
            /* Multi-venue explore mode */
            restaurants.map((restaurant) => {
              if (!restaurant.location?.lat) return null;
              const isSelected = activeMarker?.id === restaurant.id;

              return (
                <AdvancedMarker
                  key={restaurant.id}
                  position={{
                    lat: restaurant.location.lat,
                    lng: restaurant.location.lng,
                  }}
                  title={restaurant.name}
                  onClick={() => {
                    setActiveMarker(restaurant);
                    onSelectRestaurant?.(restaurant);
                  }}
                >
                  <Pin
                    background={isSelected ? '#F7B733' : '#E5173F'}
                    borderColor="#0B0B0D"
                    glyphColor="#FFFFFF"
                    scale={isSelected ? 1.2 : 1.0}
                  />
                </AdvancedMarker>
              );
            })
          )}

          {/* Info Window for tapped restaurant */}
          {activeMarker && activeMarker.location?.lat && (
            <InfoWindow
              position={{
                lat: activeMarker.location.lat,
                lng: activeMarker.location.lng,
              }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-1 max-w-[220px] text-zinc-900">
                <h4 className="font-serif font-bold text-sm text-zinc-950">{activeMarker.name}</h4>
                <p className="text-xs text-zinc-600 mt-0.5">{activeMarker.cuisine} · {activeMarker.priceBand}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-semibold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{activeMarker.rating} ({activeMarker.reviewCount} reviews)</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{activeMarker.address}</p>
                {activeMarker.mapsUrl && (
                  <a
                    href={activeMarker.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 mt-2"
                  >
                    <span>Get directions</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Attribution notice per 7.6 */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
        <span className="text-[9px] text-muted/70 bg-ink/80 px-2 py-0.5 rounded backdrop-blur-sm">
          Data © Google · Dish Cult
        </span>
      </div>
    </div>
  );
};
