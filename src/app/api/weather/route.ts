import { NextResponse } from "next/server"

// Server-side weather API — supports OpenWeatherMap (with key) or Open-Meteo (free fallback)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY

  try {
    if (apiKey) {
      // OpenWeatherMap — more accurate, supports city names
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=uz`
      )
      const d = await res.json()
      if (d.cod !== 200) throw new Error("OWM error")

      return NextResponse.json({
        temp: Math.round(d.main.temp),
        feels_like: Math.round(d.main.feels_like),
        humidity: d.main.humidity,
        wind: Math.round(d.wind.speed * 3.6), // m/s → km/h
        description: d.weather[0].description,
        city: d.name,
        icon_code: d.weather[0].icon,
        source: "openweathermap",
      })
    } else {
      // Open-Meteo — free fallback (no key)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&wind_speed_unit=kmh`
      )
      const d = await res.json()
      const c = d.current
      const label = getWeatherLabel(c.weather_code)

      return NextResponse.json({
        temp: Math.round(c.temperature_2m),
        feels_like: Math.round(c.temperature_2m),
        humidity: Math.round(c.relative_humidity_2m),
        wind: Math.round(c.wind_speed_10m),
        description: label.label,
        emoji: label.emoji,
        city: null,
        source: "open-meteo",
      })
    }
  } catch (e) {
    console.error("Weather API error:", e)
    return NextResponse.json({ error: "Weather fetch failed" }, { status: 500 })
  }
}

function getWeatherLabel(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "Ochiq havo", emoji: "☀️" }
  if (code <= 3) return { label: "Qisman bulutli", emoji: "⛅" }
  if (code <= 48) return { label: "Tumanli", emoji: "🌫️" }
  if (code <= 67) return { label: "Yomg'irli", emoji: "🌧️" }
  if (code <= 77) return { label: "Qorli", emoji: "❄️" }
  if (code <= 82) return { label: "Yomg'irli", emoji: "🌦️" }
  return { label: "Momaqaldiroq", emoji: "⛈️" }
}
