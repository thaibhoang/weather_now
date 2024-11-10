// services/weatherService.ts

// Location related interfaces
interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

// Separate interfaces for hourly and daily data
interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
}

interface DailyWeatherData {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

// Response interfaces
interface WeatherResponse {
  location: WeatherLocation;
  hourly?: HourlyWeatherData;
  daily?: DailyWeatherData;
}

interface GeocodingResponse {
  results: GeocodingResult[];
}

interface HourlyApiResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  timezone: string;
}

interface DailyApiResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
  timezone: string;
}

export class WeatherService {
  private static readonly GEOCODING_URL =
    "https://geocoding-api.open-meteo.com/v1";
  private static readonly WEATHER_URL = "https://api.open-meteo.com/v1";

  // Convert weather codes to descriptions
  private static getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      95: "Thunderstorm",
    };
    return weatherCodes[code] || "Unknown";
  }

  // Search location
  static async searchLocation(query: string): Promise<WeatherLocation[]> {
    try {
      const response = await fetch(
        `${this.GEOCODING_URL}/search?name=${encodeURIComponent(
          query
        )}&count=5&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = (await response.json()) as GeocodingResponse;
      return data.results.map((result: GeocodingResult) => ({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        timezone: result.timezone,
      }));
    } catch (error) {
      console.error("Error searching location:", error);
      throw error;
    }
  }

  // Get hourly weather
  static async getHourlyWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherResponse> {
    try {
      const response = await fetch(
        `${this.WEATHER_URL}/forecast?latitude=${latitude}&longitude=${longitude}` +
          "&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m" +
          "&timezone=auto"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hourly weather data");
      }

      const data = (await response.json()) as HourlyApiResponse;

      // Format the response
      return {
        location: {
          name: "", // You'll need to pass this from the searchLocation result
          latitude,
          longitude,
          country: "",
          timezone: data.timezone,
        },
        hourly: {
          time: data.hourly.time.slice(0, 24), // Get only next 24 hours
          temperature_2m: data.hourly.temperature_2m.slice(0, 24),
          relative_humidity_2m: data.hourly.relative_humidity_2m.slice(0, 24),
          precipitation_probability:
            data.hourly.precipitation_probability.slice(0, 24),
          weather_code: data.hourly.weather_code.slice(0, 24),
          wind_speed_10m: data.hourly.wind_speed_10m.slice(0, 24),
        },
      };
    } catch (error) {
      console.error("Error getting hourly weather:", error);
      throw error;
    }
  }

  // Get weekly weather
  static async getWeeklyWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherResponse> {
    try {
      const response = await fetch(
        `${this.WEATHER_URL}/forecast?latitude=${latitude}&longitude=${longitude}` +
          "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
          "&timezone=auto"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weekly weather data");
      }

      const data = (await response.json()) as DailyApiResponse;

      return {
        location: {
          name: "", // You'll need to pass this from the searchLocation result
          latitude,
          longitude,
          country: "",
          timezone: data.timezone,
        },
        daily: {
          time: data.daily.time,
          temperature_2m: data.daily.temperature_2m_max,
          weather_code: data.daily.weather_code,
          precipitation_probability: data.daily.precipitation_probability_max,
        },
      };
    } catch (error) {
      console.error("Error getting weekly weather:", error);
      throw error;
    }
  }

  // Get complete weather by location name
  static async getWeatherByLocation(locationName: string): Promise<{
    hourly: WeatherResponse;
    daily: WeatherResponse;
    location: WeatherLocation;
  }> {
    try {
      const locations = await this.searchLocation(locationName);

      if (locations.length === 0) {
        throw new Error("Location not found");
      }

      const location = locations[0];
      const [hourlyData, dailyData] = await Promise.all([
        this.getHourlyWeather(location.latitude, location.longitude),
        this.getWeeklyWeather(location.latitude, location.longitude),
      ]);

      // Merge location data
      hourlyData.location = location;
      dailyData.location = location;

      return {
        hourly: hourlyData,
        daily: dailyData,
        location,
      };
    } catch (error) {
      console.error("Error getting weather by location:", error);
      throw error;
    }
  }
}
