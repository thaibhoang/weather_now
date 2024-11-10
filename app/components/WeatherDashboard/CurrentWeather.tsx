import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, MapPin, Cloud, Thermometer, Wind } from "lucide-react";

interface CurrentWeatherProps {
  currentData: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation_probability: number;
    wind_speed_10m: number;
  };
  location: {
    name: string;
    country: string;
  };
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  currentData,
  location,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          {location.name}, {location.country}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer size={20} />
            <div>
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-2xl">{currentData.temperature_2m}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={20} />
            <div>
              <p className="text-sm font-medium">Humidity</p>
              <p className="text-2xl">{currentData.relative_humidity_2m}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cloud size={20} />
            <div>
              <p className="text-sm font-medium">Rain Chance</p>
              <p className="text-2xl">
                {currentData.precipitation_probability}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={20} />
            <div>
              <p className="text-sm font-medium">Wind Speed</p>
              <p className="text-2xl">{currentData.wind_speed_10m} km/h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
