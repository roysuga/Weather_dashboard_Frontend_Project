import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchCurrentWeather, 
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
  reverseGeocode,
  WeatherData,
  ForecastData,
  GeocodingData,
  getBackgroundGradient,
  isDay
} from '@/services/weatherService';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import WeatherMap from './WeatherMap';
import UnitToggle from './UnitToggle';
import LocationInfo from './LocationInfo';
import WeatherSkeleton from './WeatherSkeleton';
import ProfileButton from './ProfileButton';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  name: string;
  email: string;
}

const WeatherDashboard: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<string>('metric');
  const [bgGradient, setBgGradient] = useState('bg-gradient-clear-day');
  const [user, setUser] = useState<User | null>(null);
  
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('weatherUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  // Get user's location on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await fetchWeatherData(latitude, longitude);
          } catch (err) {
            setError('Failed to fetch weather data');
            setLoading(false);
            toast({
              title: "Error",
              description: "Failed to fetch weather data",
              variant: "destructive",
            });
            // Fall back to default city if geolocation fails
            await fetchWeatherDataByCity("London");
          }
        },
        async (err) => {
          console.error("Geolocation error:", err);
          // Fall back to default city if geolocation fails
          await fetchWeatherDataByCity("London");
        }
      );
    } else {
      // Fall back to default city if geolocation is not supported
      fetchWeatherDataByCity("London");
    }
  }, []);
  
  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
  
    try {
      // Get location name from coordinates
      const geoData = await reverseGeocode(lat, lon);
  
      if (geoData.length === 0) {
        throw new Error("Location not found");
      }
  
      // Fetch weather and forecast
      const [weatherData, forecast] = await Promise.all([
        fetchWeatherByCoords(lat, lon, units),
        fetchForecastByCoords(lat, lon, units)
      ]);
  
      // Override location name if needed
      let displayName = geoData[0].name;
      if (displayName.toLowerCase().includes("kangini bhavan")) {
        displayName = "Bengaluru";
      }
  
      setCurrentWeather({
        ...weatherData,
        name: displayName,
      });
  
      setForecastData(forecast);
  
      // Set background based on weather condition
      const dayTime = isDay(weatherData);
      const gradient = getBackgroundGradient(weatherData.weather[0].id, dayTime);
      setBgGradient(gradient);
  
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data');
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchWeatherDataByCity = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecast] = await Promise.all([
        fetchCurrentWeather(city, units),
        fetchForecast(city, units)
      ]);
      
      setCurrentWeather(weatherData);
      setForecastData(forecast);
      
      // Set background based on weather condition
      const dayTime = isDay(weatherData);
      const gradient = getBackgroundGradient(weatherData.weather[0].id, dayTime);
      setBgGradient(gradient);
      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data');
      toast({
        title: "Error",
        description: "Failed to fetch weather data for " + city,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLocationSelect = (location: GeocodingData) => {
    fetchWeatherData(location.lat, location.lon);
  };
  
  const handleUnitToggle = (newUnit: string) => {
    if (units === newUnit) return;
    
    setUnits(newUnit);
    
    if (currentWeather) {
      // Re-fetch data with new units
      if (currentWeather.coord) {
        fetchWeatherData(currentWeather.coord.lat, currentWeather.coord.lon);
      } else {
        fetchWeatherDataByCity(currentWeather.name);
      }
    }
  };
  
  const detectCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          toast({
            title: "Location detected",
            description: "Getting weather for your current location",
          });
          await fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          toast({
            title: "Error",
            description: "Could not get your location. Please check your browser settings.",
            variant: "destructive",
          });
        }
      );
    } else {
      setLoading(false);
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };
  
  const handleMapLocationChange = (lat: number, lon: number) => {
    fetchWeatherData(lat, lon);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className={cn("min-h-screen p-4 transition-colors duration-500", bgGradient)}>
      {user && (
        <div className="max-w-7xl mx-auto pt-4 pb-0 px-4">
          <h2 className="text-white font-medium text-xl">Welcome, {user.name}!</h2>
        </div>
      )}
      <div className="max-w-7xl mx-auto text-white">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-8">
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-2">Weather Dashboard</h1>
            {!loading && currentWeather && (
              <LocationInfo 
                city={currentWeather.name} 
                country={currentWeather.sys.country}
                date={new Date()} 
              />
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <SearchBar 
                onSearch={fetchWeatherDataByCity}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            
            <Button 
              onClick={detectCurrentLocation}
              className="h-9 px-3 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading}
            >
              <Navigation size={18} className="mr-2" />
              My Location
            </Button>
            
            <UnitToggle units={units} onToggle={handleUnitToggle} />
            
            {/* Theme toggle button */}
            <Button
              onClick={toggleTheme}
              className="h-9 px-3 glass hover:bg-white/30"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="mr-2" />
              ) : (
                <Moon size={18} className="mr-2" />
              )}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            
            <ProfileButton />
          </div>
        </div>
        
        {loading ? (
          <WeatherSkeleton />
        ) : error ? (
          <div className="bg-red-500/20 p-4 rounded-lg text-center">
            <p>{error}</p>
            <button 
              onClick={() => fetchWeatherDataByCity("London")}
              className="mt-2 underline"
            >
              Try again with default city
            </button>
          </div>
        ) : (
          currentWeather && forecastData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-3">
                <CurrentWeather data={currentWeather} units={units} />
              </div>
              
              <div className="lg:col-span-3">
                <HourlyForecast data={forecastData} units={units} />
              </div>
              
              <div className="lg:col-span-2">
                <DailyForecast data={forecastData} units={units} />
              </div>
              
              <div className="lg:col-span-1">
                <WeatherMap 
                  lat={currentWeather.coord.lat} 
                  lon={currentWeather.coord.lon}
                  onLocationChange={handleMapLocationChange}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;