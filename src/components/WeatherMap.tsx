
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reverseGeocode } from '@/services/weatherService';
import { useToast } from '@/components/ui/use-toast';
import { MapPin } from 'lucide-react';

interface WeatherMapProps {
  lat: number;
  lon: number;
  onLocationChange?: (lat: number, lon: number) => void;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const API_KEY = "81c7958e499bd5c72c6f5e1ee343220e";
  const { toast } = useToast();
  
  const generateMapUrl = (layer: string) => {
    // Map tile URL for OpenWeatherMap
    return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`;
  };
  
  useEffect(() => {
    // Skip map rendering during SSR
    if (typeof window === 'undefined' || !mapRef.current) return;
    
    // Load OpenStreetMap without using external libraries
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.title = 'Weather Map';
    iframeRef.current = iframe;
    
    // Use OpenStreetMap with our coordinates
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-1},${lat-1},${lon+1},${lat+1}&layer=mapnik&marker=${lat},${lon}`;
    
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(iframe);
    
    // Add overlay for click interaction since we can't interact directly with iframe content
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.cursor = 'pointer';
    overlay.title = 'Click to select location';
    
    overlay.addEventListener('click', async (event) => {
      if (!mapRef.current || !onLocationChange) return;
      
      // Calculate relative position in the map
      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Convert click position to coordinates (approximate)
      // This is a simplified calculation - in a real app you'd use proper map projections
      const mapWidth = rect.width;
      const mapHeight = rect.height;
      
      const lonRange = 2; // bbox is lon±1
      const latRange = 2; // bbox is lat±1
      
      const clickLon = lon - lonRange/2 + (x / mapWidth) * lonRange;
      const clickLat = lat + latRange/2 - (y / mapHeight) * latRange;
      
      try {
        // Update the toast to show we're fetching location
        toast({
          title: "Detecting location...",
          description: "Please wait while we find the location.",
          duration: 2000,
        });
        
        // Get the location name from coordinates
        const locationData = await reverseGeocode(clickLat, clickLon);
        
        if (locationData.length > 0) {
          toast({
            title: "Location selected",
            description: `${locationData[0].name}, ${locationData[0].country}`,
            duration: 3000,
          });
          
          onLocationChange(clickLat, clickLon);
        } else {
          toast({
            title: "Location not found",
            description: "Could not identify a location at this point.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error handling map click:", error);
        toast({
          title: "Error",
          description: "Failed to get location data",
          variant: "destructive",
        });
      }
    });
    
    mapRef.current.appendChild(overlay);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [lat, lon, onLocationChange, toast]);
  
  return (
    <Card className="glass weather-card h-[300px]">
      <div className="shimmer"></div>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center">
          <MapPin size={18} className="mr-2 text-weather-orange" />
          Weather Map
          <span className="text-xs ml-auto opacity-60">(Click to select location)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-[230px] bg-white/10 rounded-lg overflow-hidden cursor-pointer relative" />
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
