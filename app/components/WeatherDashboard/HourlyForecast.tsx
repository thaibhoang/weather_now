import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Droplets, Thermometer, Wind } from "lucide-react";

interface HourlyForecastProps {
  hourlyData: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourlyData,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>24-Hour Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {hourlyData.time.map((time, index) => {
              const date = new Date(time);
              const hour = date.getHours();
              const temp = hourlyData.temperature_2m[index];
              const humidity = hourlyData.relative_humidity_2m[index];
              const rainChance = hourlyData.precipitation_probability[index];
              const windSpeed = hourlyData.wind_speed_10m[index];

              return (
                <div
                  key={time}
                  className="flex flex-col items-center space-y-2 min-w-[100px]"
                >
                  <span className="text-sm font-medium">
                    {hour === new Date().getHours() ? "Now" : `${hour}:00`}
                  </span>
                  <div className="flex items-center gap-1">
                    <Thermometer size={16} />
                    <span>{temp}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets size={16} />
                    <span>{rainChance}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind size={16} />
                    <span>{windSpeed} km/h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
