import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, Thermometer } from "lucide-react";

interface DailyForecastProps {
  dailyData: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData }) => {
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dailyData.time.map((time, index) => (
            <div key={time} className="flex items-center justify-between">
              <span className="w-20 font-medium">{getDayName(time)}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Thermometer size={16} />
                  <span>{dailyData.temperature_2m[index]}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Cloud size={16} />
                  <span>{dailyData.precipitation_probability[index]}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
