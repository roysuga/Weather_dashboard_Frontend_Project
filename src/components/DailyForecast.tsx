
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastData, formatTemperature, formatDateTime, groupForecastByDay } from '@/services/weatherService';
import WeatherIcon from './WeatherIcon';

interface DailyForecastProps {
  data: ForecastData;
  units: string;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ data, units }) => {
  const dailyData = groupForecastByDay(data).slice(0, 5);
  const timezone = data.city.timezone;
  
  return (
    <Card className="glass weather-card">
      <div className="shimmer"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {dailyData.map((day) => {
            const date = new Date(day.timestamp * 1000);
            const dayName = formatDateTime(day.timestamp, timezone, 'day');
            const isToday = new Date().toDateString() === date.toDateString();
            
            return (
              <div 
                key={day.date}
                className={`flex items-center justify-between p-2 rounded-lg ${isToday ? 'bg-white/20' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <WeatherIcon weatherId={day.weather.id} isDay={true} />
                  <span className="font-medium w-20">
                    {isToday ? 'Today' : dayName}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <p className="text-sm mr-2">
                    <span className="opacity-80">
                      {formatTemperature(day.temp_min, units)}
                    </span>
                  </p>
                  <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <p className="text-sm ml-2 font-medium">
                    {formatTemperature(day.temp_max, units)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyForecast;
