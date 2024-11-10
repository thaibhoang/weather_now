"use client";
import { useEffect, useState } from "react";
import { WeatherService } from "@/app/services/weatherService";
import { HourlyForecast } from "@/app/components/WeatherDashboard/HourlyForecast";
import { DailyForecast } from "@/app/components/WeatherDashboard/DailyForecast";
import { CurrentWeather } from "@/app/components/WeatherDashboard/CurrentWeather";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await WeatherService.getWeatherByLocation("Hanoi"); // Default city
        setWeatherData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const currentHourData = {
    temperature_2m: weatherData.hourly.hourly.temperature_2m[0],
    relative_humidity_2m: weatherData.hourly.hourly.relative_humidity_2m[0],
    precipitation_probability:
      weatherData.hourly.hourly.precipitation_probability[0],
    wind_speed_10m: weatherData.hourly.hourly.wind_speed_10m[0],
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <CurrentWeather
        currentData={currentHourData}
        location={weatherData.location}
      />

      <HourlyForecast hourlyData={weatherData.hourly.hourly} />

      <DailyForecast dailyData={weatherData.daily.daily} />
    </div>
  );
}
