
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UnitToggleProps {
  units: string;
  onToggle: (unit: string) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ units, onToggle }) => {
  return (
    <div className="flex rounded-lg overflow-hidden glass shadow-sm">
      <Button
        onClick={() => onToggle('metric')}
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-none",
          units === 'metric' 
            ? "bg-white/30 text-white" 
            : "hover:bg-white/10"
        )}
      >
        °C
      </Button>
      <Button
        onClick={() => onToggle('imperial')}
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-none",
          units === 'imperial' 
            ? "bg-white/30 text-white" 
            : "hover:bg-white/10"
        )}
      >
        °F
      </Button>
    </div>
  );
};

export default UnitToggle;
