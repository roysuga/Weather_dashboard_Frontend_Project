
import React from "react";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Moon,
  CloudSun,
  CloudMoon,
  Wind
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  weatherId: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  weatherId, 
  isDay = true, 
  className,
  size = 24
}) => {
  const getIcon = () => {
    // Clear
    if (weatherId === 800) {
      return isDay ? <Sun size={size} className="text-weather-yellow" /> : <Moon size={size} className="text-white" />;
    }
    
    // Few clouds
    if (weatherId === 801) {
      return isDay ? 
        <CloudSun size={size} className="text-weather-cloud-light" /> : 
        <CloudMoon size={size} className="text-weather-cloud-light" />;
    }
    
    // Clouds (scattered, broken, overcast)
    if (weatherId >= 802 && weatherId <= 804) {
      return <Cloud size={size} className="text-weather-cloud-dark" />;
    }
    
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning size={size} className="text-weather-thunder" />;
    }
    
    // Drizzle
    if (weatherId >= 300 && weatherId < 400) {
      return <CloudDrizzle size={size} className="text-weather-rain" />;
    }
    
    // Rain
    if (weatherId >= 500 && weatherId < 600) {
      return <CloudRain size={size} className="text-weather-rain" />;
    }
    
    // Snow
    if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow size={size} className="text-weather-snow" />;
    }
    
    // Atmosphere (mist, fog, etc)
    if (weatherId >= 700 && weatherId < 800) {
      return <CloudFog size={size} className="text-weather-mist" />;
    }
    
    // Default
    return <Sun size={size} className="text-weather-yellow" />;
  };

  return (
    <div className={cn("animate-pulse-light", className)}>
      {getIcon()}
    </div>
  );
};

export default WeatherIcon;
