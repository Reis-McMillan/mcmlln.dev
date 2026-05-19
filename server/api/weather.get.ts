const ENDPOINT =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=40.4259&longitude=-86.9081" +
  "&current=temperature_2m,weather_code" +
  "&temperature_unit=fahrenheit" +
  "&timezone=America%2FIndiana%2FIndianapolis";

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
}

const WMO_LABELS: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ hail",
  99: "Thunderstorm w/ hail",
};

export default cachedEventHandler(
  async () => {
    const data = await $fetch<OpenMeteoResponse>(ENDPOINT);
    const tempF = data.current?.temperature_2m ?? null;
    const code = data.current?.weather_code ?? null;
    if (tempF == null || code == null) {
      throw createError({
        statusCode: 502,
        statusMessage: "Weather data unavailable",
      });
    }
    return {
      tempF: Math.round(tempF),
      code,
      label: WMO_LABELS[code] ?? "Unknown",
    };
  },
  { maxAge: 600, name: "west-lafayette-weather" }
);
