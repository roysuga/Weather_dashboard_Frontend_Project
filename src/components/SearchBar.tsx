
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { geocodeCity, GeocodingData } from '@/services/weatherService';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSelect: (location: GeocodingData) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodingData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const locations = await geocodeCity(query);
      
      if (locations.length === 0) {
        toast({
          title: "Location not found",
          description: "Please try a different city name",
          variant: "destructive",
        });
        return;
      }
      
      setSuggestions(locations);
      setShowSuggestions(true);
    } catch (error) {
      toast({
        title: "Error searching location",
        description: "Failed to search for this location",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: GeocodingData) => {
    setQuery(`${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-full bg-white/80 shadow-md border-none focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full bg-primary text-white hover:bg-primary/80"
          disabled={isLoading}
        >
          <Search size={18} />
        </Button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 glass max-h-60 overflow-auto">
          <ul className="py-1">
            {suggestions.map((location, index) => (
              <li 
                key={`${location.lat}-${location.lon}-${index}`}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => handleLocationSelect(location)}
              >
                {location.name}
                {location.state && `, ${location.state}`}, {location.country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
