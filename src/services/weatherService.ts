
import { useToast } from "@/components/ui/use-toast";

const API_KEY = "81c7958e499bd5c72c6f5e1ee343220e";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      "3h": number;
    };
    snow?: {
      "3h": number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface GeocodingData {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export const fetchCurrentWeather = async (
  city: string,
  units: string = "metric"
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather data not found for ${city}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number,
  units: string = "metric"
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather data not found for coordinates: ${lat}, ${lon}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw error;
  }
};

export const fetchForecast = async (
  city: string,
  units: string = "metric"
): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast data not found for ${city}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const fetchForecastByCoords = async (
  lat: number,
  lon: number,
  units: string = "metric"
): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast data not found for coordinates: ${lat}, ${lon}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast by coordinates:", error);
    throw error;
  }
};

export const geocodeCity = async (city: string): Promise<GeocodingData[]> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed for ${city}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error geocoding city:", error);
    throw error;
  }
};

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<GeocodingData[]> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed for coordinates: ${lat}, ${lon}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    throw error;
  }
};

export const getWeatherIconUrl = (iconCode: string, size: '2x' | '4x' = '4x'): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

export const getBackgroundGradient = (weatherId: number, isDay: boolean): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  
  // Clear sky
  if (weatherId === 800) {
    return isDay ? 'bg-gradient-clear-day' : 'bg-gradient-clear-night';
  }
  
  // Clouds
  if (weatherId >= 801 && weatherId <= 804) {
    return 'bg-gradient-cloudy';
  }
  
  // Rain, drizzle
  if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) {
    return 'bg-gradient-rainy';
  }
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId <= 232) {
    return 'bg-gradient-thunderstorm';
  }
  
  // Snow
  if (weatherId >= 600 && weatherId <= 622) {
    return 'bg-gradient-snowy';
  }
  
  // Atmosphere (mist, fog, etc)
  if (weatherId >= 701 && weatherId <= 781) {
    return 'bg-gradient-misty';
  }
  
  // Default
  return isDay ? 'bg-gradient-clear-day' : 'bg-gradient-clear-night';
};

export const formatTemperature = (temp: number, units: string): string => {
  const roundedTemp = Math.round(temp);
  const symbol = units === 'metric' ? '°C' : '°F';
  return `${roundedTemp}${symbol}`;
};

export const formatDateTime = (timestamp: number, timezone: number, format: 'time' | 'date' | 'day' | 'full' = 'full'): string => {
  // Convert timestamp to milliseconds and adjust for timezone
  const date = new Date((timestamp + timezone) * 1000);
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
  };
  
  switch (format) {
    case 'time':
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
    case 'date':
      options.month = 'short';
      options.day = 'numeric';
      break;
    case 'day':
      options.weekday = 'short';
      break;
    case 'full':
      options.weekday = 'short';
      options.month = 'short';
      options.day = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const isDay = (data: WeatherData): boolean => {
  const currentTime = data.dt;
  return currentTime > data.sys.sunrise && currentTime < data.sys.sunset;
};

export const getWeatherDescription = (weatherId: number): string => {
  // Clear
  if (weatherId === 800) return "Clear sky";
  
  // Clouds
  if (weatherId === 801) return "Few clouds";
  if (weatherId === 802) return "Scattered clouds";
  if (weatherId === 803) return "Broken clouds";
  if (weatherId === 804) return "Overcast clouds";
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) return "Thunderstorm";
  
  // Drizzle
  if (weatherId >= 300 && weatherId < 400) return "Drizzle";
  
  // Rain
  if (weatherId >= 500 && weatherId < 600) {
    if (weatherId === 511) return "Freezing rain";
    return "Rain";
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) return "Snow";
  
  // Atmosphere
  if (weatherId === 701) return "Mist";
  if (weatherId === 711) return "Smoke";
  if (weatherId === 721) return "Haze";
  if (weatherId === 731) return "Dust";
  if (weatherId === 741) return "Fog";
  if (weatherId === 751) return "Sand";
  if (weatherId === 761) return "Dust";
  if (weatherId === 762) return "Volcanic ash";
  if (weatherId === 771) return "Squalls";
  if (weatherId === 781) return "Tornado";
  
  return "Unknown";
};

export const groupForecastByDay = (forecast: ForecastData) => {
  const dailyData = forecast.list.reduce<Record<string, typeof forecast.list[0][]>>((acc, item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(item);
    return acc;
  }, {});
  
  return Object.entries(dailyData).map(([date, items]) => {
    // Find the item with the highest temperature for each day
    const maxTempItem = items.reduce((max, item) => 
      item.main.temp > max.main.temp ? item : max, items[0]);
    
    // Find the item with the lowest temperature for each day
    const minTempItem = items.reduce((min, item) => 
      item.main.temp < min.main.temp ? item : min, items[0]);
    
    // Use noon forecast as representative for the day, or first item if noon not available
    const middayIndex = items.findIndex(item => 
      item.dt_txt.includes("12:00:00")
    );
    const representative = middayIndex !== -1 ? items[middayIndex] : items[0];
    
    return {
      date,
      timestamp: new Date(date).getTime() / 1000,
      temp_max: maxTempItem.main.temp,
      temp_min: minTempItem.main.temp,
      weather: representative.weather[0],
      items
    };
  });
};
