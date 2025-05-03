
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WeatherData, formatTemperature, formatDateTime, isDay, getWeatherDescription } from '@/services/weatherService';
import WeatherIcon from './WeatherIcon';
import { ThermometerSun, Gauge, Wind, Droplets } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
  units: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, units }) => {
  const dayTime = isDay(data);
  const weatherId = data.weather[0].id;
  const description = getWeatherDescription(weatherId);
  
  return (
    <Card className="glass overflow-hidden weather-card">
      <div className="shimmer"></div>
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="flex items-center gap-4">
            <WeatherIcon weatherId={weatherId} isDay={dayTime} size={48} />
            <div>
              <h2 className="text-3xl font-bold">{data.name}</h2>
              <p className="text-sm opacity-80">{formatDateTime(data.dt, data.timezone, 'full')}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-5xl font-bold tracking-tighter">
              {formatTemperature(data.main.temp, units)}
            </h1>
            <p className="text-lg capitalize">{description}</p>
            <p className="text-sm opacity-80">
              Feels like {formatTemperature(data.main.feels_like, units)}
            </p>
          </div>
        </div>
        
        <Separator orientation="vertical" className="h-24 hidden md:block" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <ThermometerSun className="text-weather-yellow" size={20} />
            <div>
              <p className="text-xs opacity-80">High / Low</p>
              <p className="text-sm font-medium">
                {formatTemperature(data.main.temp_max, units)} / {formatTemperature(data.main.temp_min, units)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="text-weather-rain" size={20} />
            <div>
              <p className="text-xs opacity-80">Humidity</p>
              <p className="text-sm font-medium">{data.main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="text-weather-blue-medium" size={20} />
            <div>
              <p className="text-xs opacity-80">Wind</p>
              <p className="text-sm font-medium">
                {data.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Gauge className="text-weather-orange" size={20} />
            <div>
              <p className="text-xs opacity-80">Pressure</p>
              <p className="text-sm font-medium">{data.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
