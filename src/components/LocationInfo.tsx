import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

interface LocationInfoProps {
  city: string;
  country: string;
  date: Date;
}

const aliasCityName = (city: string): string => {
  const aliases: Record<string, string> = {
    "Kangini Bhavan": "Bengaluru",
  };
  return aliases[city] || city;
};

const LocationInfo: React.FC<LocationInfoProps> = ({ city, country, date }) => {
  // Format date as "Wednesday, April 8, 2023"
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm opacity-80">
      <div className="flex items-center gap-1">
        <MapPin size={14} className="text-weather-blue-light" />
        <span>{aliasCityName(city)}, {country}</span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar size={14} className="text-weather-orange" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default LocationInfo;
