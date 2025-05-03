
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const WeatherSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      <Card className="weather-card">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-16 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div>
                  <Skeleton className="h-3 w-14 mb-1" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="weather-card">
        <CardHeader className="pb-0">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-8 w-8 rounded-full mb-2" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="weather-card">
        <CardHeader className="pb-0">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="weather-card h-[300px]">
        <CardHeader className="pb-0">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-[230px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherSkeleton;
