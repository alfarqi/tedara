import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

const MapComponent: React.FC<GoogleMapProps> = ({ center, zoom, onLocationSelect, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add click listener to map
      newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          onLocationSelect(lat, lng);
        }
      });

      setMap(newMap);
    }
  }, [ref, map, center, zoom, onLocationSelect]);

  useEffect(() => {
    if (map) {
      // Update map center when center prop changes
      map.setCenter(center);
    }
  }, [map, center]);

  useEffect(() => {
    if (map) {
      // Remove existing marker
      if (marker) {
        marker.setMap(null);
      }

      // Create new marker
      const newMarker = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Selected Location'
      });

      // Add drag listener to marker
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        if (position) {
          const lat = position.lat();
          const lng = position.lng();
          onLocationSelect(lat, lng);
        }
      });

      setMarker(newMarker);
    }
  }, [map, center, onLocationSelect]);

  return <div ref={ref} className={className} />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-500 text-sm">Failed to load map</p>
            <p className="text-gray-400 text-xs">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-yellow-500 mb-2">⚠️</div>
          <p className="text-gray-500 text-sm">Google Maps API key not configured</p>
          <p className="text-gray-400 text-xs">Please add VITE_GOOGLE_MAPS_API_KEY to your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent {...props} />
    </Wrapper>
  );
};







