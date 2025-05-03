
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ForecastData, formatTemperature, formatDateTime } from '@/services/weatherService';
import WeatherIcon from './WeatherIcon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HourlyForecastProps {
  data: ForecastData;
  units: string;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, units }) => {
  // Get forecast for next 24 hours (8 entries for 3-hour intervals)
  const hourlyData = data.list.slice(0, 8);
  const timezone = data.city.timezone;
  
  return (
    <Card className="glass weather-card">
      <div className="shimmer"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4 px-2">
            {hourlyData.map((hour, index) => {
              const isFirst = index === 0;
              return (
                <React.Fragment key={hour.dt}>
                  {!isFirst && <Separator orientation="vertical" className="h-24 mx-1" />}
                  <div className="flex flex-col items-center justify-center px-2">
                    <p className="text-xs opacity-80">
                      {formatDateTime(hour.dt, timezone, 'time')}
                    </p>
                    <WeatherIcon 
                      weatherId={hour.weather[0].id} 
                      isDay={hour.sys.pod === 'd'}
                      className="my-2"
                    />
                    <p className="font-medium">
                      {formatTemperature(hour.main.temp, units)}
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
