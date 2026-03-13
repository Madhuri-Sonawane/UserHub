import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Chip, Divider, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You are capable of more than you know.", author: "Glinda the Good Witch" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Every day is a chance to be better than yesterday.", author: "Unknown" },
  { text: "You didn't come this far to only come this far.", author: "Unknown" },
  { text: "The harder you work, the luckier you get.", author: "Gary Player" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Small steps every day lead to big changes.", author: "Unknown" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
];

const WEATHER_ICONS = {
  Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
  Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️",
  Haze: "🌫️", default: "🌡️",
};

const WEATHER_TIPS = {
  Clear: "Perfect day to stay productive! ☀️",
  Clouds: "Cloudy skies, clear mind. Focus up! 💪",
  Rain: "Rain = perfect coding weather 🌧️",
  Drizzle: "Light rain vibes. Cozy and productive! 🍵",
  Thunderstorm: "Stay inside and build something great ⛈️",
  Snow: "Snow day magic! Hot drink + deep work ❄️",
  Mist: "A mysterious day — perfect for big ideas 🌫️",
  default: "Whatever the weather, you've got this! 🌟",
};

// Pimpri, Maharashtra coordinates
const LAT = 18.6279;
const LON = 73.8009;
const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // free OpenWeatherMap key

function WeatherQuote() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quote, setQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [quoteAnim, setQuoteAnim] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      setWeather(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  const refreshQuote = () => {
    setQuoteAnim(true);
    setTimeout(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      setQuoteAnim(false);
    }, 300);
  };

  const condition = weather?.weather?.[0]?.main || "default";
  const weatherIcon = WEATHER_ICONS[condition] || WEATHER_ICONS.default;
  const weatherTip = WEATHER_TIPS[condition] || WEATHER_TIPS.default;
  const temp = weather ? Math.round(weather.main?.temp) : null;
  const feelsLike = weather ? Math.round(weather.main?.feels_like) : null;
  const humidity = weather?.main?.humidity;
  const cityName = weather?.name || "Pimpri";
  const windSpeed = weather ? Math.round(weather.wind?.speed * 3.6) : null; // m/s to km/h
  const description = weather?.weather?.[0]?.description;

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const greetEmoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <WbSunnyIcon sx={{ color: "#ffd93d", fontSize: 26 }} />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            Weather & Vibes
          </Typography>
        </Box>
        <Tooltip title="Refresh weather">
          <IconButton onClick={fetchWeather} size="small" sx={{
            color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            "&:hover": { color: "#fff", background: "rgba(255,255,255,0.25)", transform: "rotate(180deg)" },
            transition: "all 0.4s",
          }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Greeting + time */}
      <Box sx={{
        background: "rgba(255,255,255,0.08)", borderRadius: 3,
        p: 2, mb: 2, border: "1px solid rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>
            {greetEmoji} {greeting}!
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>
            {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </Typography>
        </Box>
        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.4rem", opacity: 0.9 }}>
          {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </Typography>
      </Box>

      {/* Weather Card */}
      <Box sx={{
        background: "rgba(255,255,255,0.08)", borderRadius: 3,
        p: 2.5, mb: 2, border: "1px solid rgba(255,255,255,0.15)",
      }}>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={3} gap={2}>
            <CircularProgress size={28} sx={{ color: "rgba(255,255,255,0.6)" }} />
            <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>Fetching weather...</Typography>
          </Box>
        ) : error ? (
          <Box textAlign="center" py={2}>
            <Typography sx={{ fontSize: "2.5rem" }}>🌍</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", mt: 1, fontSize: "0.88rem" }}>
              Weather unavailable — but you're doing great anyway! 🌟
            </Typography>
          </Box>
        ) : (
          <>
            <Box display="flex" alignItems="flex-start" justifyContent="space-between">
              <Box>
                <Typography sx={{ fontSize: "3.2rem", lineHeight: 1 }}>{weatherIcon}</Typography>
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "2rem", mt: 0.5, lineHeight: 1 }}>
                  {temp}°C
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", textTransform: "capitalize", mt: 0.3 }}>
                  {description}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>{cityName}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>Maharashtra, IN</Typography>
              </Box>
            </Box>

            {/* Stats row */}
            <Box display="flex" gap={1} mt={2} flexWrap="wrap">
              {[
                { label: "Feels like", value: `${feelsLike}°C` },
                { label: "Humidity", value: `${humidity}%` },
                { label: "Wind", value: `${windSpeed} km/h` },
              ].map(({ label, value }) => (
                <Chip key={label} label={`${label}: ${value}`} size="small" sx={{
                  background: "rgba(255,255,255,0.14)", color: "#fff", fontSize: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.2)", fontWeight: 500,
                }} />
              ))}
            </Box>

            {/* Tip */}
            <Typography sx={{
              mt: 1.5, color: "rgba(255,255,255,0.7)", fontSize: "0.82rem",
              fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.1)", pt: 1.5,
            }}>
              {weatherTip}
            </Typography>
          </>
        )}
      </Box>

      {/* Quote of the Day */}
      <Box sx={{
        background: "rgba(255,255,255,0.08)", borderRadius: 3,
        p: 2.5, border: "1px solid rgba(255,255,255,0.15)",
        position: "relative", overflow: "hidden",
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <FormatQuoteIcon sx={{ color: "#ffd93d", fontSize: 20 }} />
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>
              Quote of the Moment
            </Typography>
          </Box>
          <Tooltip title="New quote">
            <IconButton onClick={refreshQuote} size="small" sx={{
              color: "rgba(255,255,255,0.6)", p: 0.5,
              "&:hover": { color: "#ffd93d", transform: "rotate(180deg)" },
              transition: "all 0.3s",
            }}>
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{
          opacity: quoteAnim ? 0 : 1,
          transform: quoteAnim ? "translateY(8px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}>
          <Typography sx={{
            color: "#fff", fontStyle: "italic", fontSize: "0.95rem",
            lineHeight: 1.6, fontFamily: "'Georgia', serif", mb: 1,
          }}>
            "{quote.text}"
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", textAlign: "right" }}>
            — {quote.author}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default WeatherQuote;