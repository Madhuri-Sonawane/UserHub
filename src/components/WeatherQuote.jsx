import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Tooltip, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const QUOTES = [
  { text: "The secret of getting ahead is getting started.",        author: "Mark Twain"        },
  { text: "Focus is the art of knowing what to ignore.",            author: "Unknown"            },
  { text: "Simplicity is the ultimate sophistication.",             author: "Leonardo da Vinci"  },
  { text: "Do the hard thing first.",                               author: "Unknown"            },
  { text: "Consistency beats intensity every time.",                author: "Unknown"            },
  { text: "Progress over perfection.",                              author: "Unknown"            },
  { text: "Small actions compounded daily create massive results.", author: "Unknown"            },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Unknown" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Done is better than perfect.",                           author: "Sheryl Sandberg"    },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Work hard in silence. Let results do the talking.",      author: "Unknown"            },
];

const WEATHER_LABELS = {
  Clear:"Clear",Clouds:"Cloudy",Rain:"Rain",Drizzle:"Light Rain",
  Thunderstorm:"Storm",Snow:"Snow",Mist:"Mist",Fog:"Fog",Haze:"Haze",
};

const W_ICONS = {
  Clear:"○", Clouds:"◎", Rain:"◇", Drizzle:"◈",
  Thunderstorm:"▲", Snow:"❋", Mist:"≈", default:"–",
};

const LAT     = 18.6279;
const LON     = 73.8009;
const API_KEY = "bd5e378503939ddaee76f12ad7a97608";

/* Small stat cell */
function Stat({ label, value }) {
  return (
    <Box sx={{
      flex:1, background:"rgba(255,255,255,0.04)",
      border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:1.5, px:1.2, py:1,
    }}>
      <Typography sx={{ color:"rgba(255,255,255,0.3)", fontSize:"0.62rem", letterSpacing:"0.08em", textTransform:"uppercase", mb:0.3 }}>
        {label}
      </Typography>
      <Typography sx={{ color:"rgba(255,255,255,0.85)", fontWeight:600, fontSize:"0.88rem" }}>
        {value}
      </Typography>
    </Box>
  );
}

/* Section header */
function SectionHead({ label, action }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.2}>
      <Typography sx={{
        color:"rgba(255,255,255,0.28)", fontSize:"0.62rem",
        fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
      }}>
        {label}
      </Typography>
      {action}
    </Box>
  );
}

export default function WeatherQuote() {
  const [weather,    setWeather]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [quote,      setQuote]      = useState(() => QUOTES[Math.floor(Math.random()*QUOTES.length)]);
  const [quoteAnim,  setQuoteAnim]  = useState(false);
  const [time,       setTime]       = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const fetchWeather = async () => {
    setLoading(true); setError(false);
    try {
      const res  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`);
      if (!res.ok) throw new Error();
      setWeather(await res.json());
    } catch { setError(true); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchWeather(); }, []);

  const nextQuote = () => {
    setQuoteAnim(true);
    setTimeout(() => { setQuote(QUOTES[Math.floor(Math.random()*QUOTES.length)]); setQuoteAnim(false); }, 250);
  };

  const h       = time.getHours();
  const greeting= h<5?"Late night":h<12?"Morning":h<17?"Afternoon":h<21?"Evening":"Late night";

  const cond    = weather?.weather?.[0]?.main || "default";
  const temp    = weather ? Math.round(weather.main?.temp)       : null;
  const feels   = weather ? Math.round(weather.main?.feels_like) : null;
  const hum     = weather?.main?.humidity;
  const wind    = weather ? Math.round((weather.wind?.speed||0)*3.6) : null;
  const desc    = weather?.weather?.[0]?.description || "";
  const city    = weather?.name || "Pimpri";
  const wIcon   = W_ICONS[cond] || W_ICONS.default;
  const wLabel  = WEATHER_LABELS[cond] || cond;

  return (
    <Box sx={{ animation:"wIn 0.3s ease", "@keyframes wIn":{ "0%":{ opacity:0, transform:"translateY(10px)" }, "100%":{ opacity:1, transform:"translateY(0)" } } }}>

      {/* ══ HEADER ══ */}
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2.5}>
        <Box>
          <Typography sx={{ color:"#fff", fontWeight:700, fontSize:"1.05rem", letterSpacing:"-0.2px" }}>
            {greeting}
          </Typography>
          <Typography sx={{ color:"rgba(255,255,255,0.35)", fontSize:"0.73rem", mt:0.3 }}>
            {time.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </Typography>
        </Box>
        {/* Live clock */}
        <Box sx={{
          textAlign:"right",
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:1.5, px:1.8, py:1,
        }}>
          <Typography sx={{
            color:"#fff", fontWeight:700, fontSize:"1.45rem",
            letterSpacing:"-0.5px", lineHeight:1, fontVariantNumeric:"tabular-nums",
          }}>
            {time.toLocaleTimeString("en-IN",{ hour:"2-digit", minute:"2-digit" })}
          </Typography>
          <Typography sx={{ color:"rgba(255,255,255,0.25)", fontSize:"0.62rem", mt:0.3, fontVariantNumeric:"tabular-nums" }}>
            {String(time.getSeconds()).padStart(2,"0")}s
          </Typography>
        </Box>
      </Box>

      {/* ══ WEATHER ══ */}
      <Box mb={2.5}>
        <SectionHead label="Current conditions"
          action={
            <Tooltip title="Refresh">
              <IconButton onClick={fetchWeather} size="small" sx={{
                color:"rgba(255,255,255,0.3)", p:0.3,
                "&:hover":{ color:"rgba(255,255,255,0.7)" },
                transition:"all 0.2s",
              }}>
                <RefreshIcon sx={{ fontSize:13 }}/>
              </IconButton>
            </Tooltip>
          }
        />

        {loading ? (
          <Box display="flex" alignItems="center" gap={1.5} py={2}>
            <CircularProgress size={16} sx={{ color:"rgba(255,255,255,0.3)" }}/>
            <Typography sx={{ color:"rgba(255,255,255,0.3)", fontSize:"0.8rem" }}>Loading…</Typography>
          </Box>
        ) : error ? (
          <Box sx={{
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:1.5, px:2, py:1.5,
          }}>
            <Typography sx={{ color:"rgba(255,255,255,0.3)", fontSize:"0.8rem" }}>
              Weather data unavailable
            </Typography>
          </Box>
        ) : (
          <>
           
            <Box sx={{
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:1.5, px:2, py:1.8, mb:1,
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <Box display="flex" alignItems="center" gap={2} >
                <Typography sx={{ color:"rgba(255,255,255,0.4)", fontSize:"1.4rem", mr:1.5, lineHeight:1 }}>
                  {wIcon}
                </Typography>
                <Box>
                  <Typography sx={{ color:"#fff", fontWeight:700, fontSize:"1.8rem", lineHeight:1, letterSpacing:"-1px" }}>
                    {temp}°
                  </Typography>
                  <Typography sx={{ color:"rgba(255,255,255,0.4)", fontSize:"0.72rem", mt:0.3, textTransform:"capitalize" }}>
                    {desc || wLabel}
                  </Typography>
                </Box>
              </Box>
              <Box textAlign="right">
                <Typography sx={{ color:"rgba(255,255,255,0.7)", fontWeight:600, fontSize:"0.85rem" }}>
                  {city}
                </Typography>
                <Typography sx={{ color:"rgba(255,255,255,0.3)", fontSize:"0.72rem" }}>
                  Maharashtra, IN
                </Typography>
              </Box>
            </Box>

            {/* Stats row */}
            <Box display="flex" gap={1}>
              <Stat label="Feels"    value={`${feels}°C`}    />
              <Stat label="Humidity" value={`${hum}%`}       />
              <Stat label="Wind"     value={`${wind} km/h`}  />
            </Box>
          </>
        )}
      </Box>

      {/* ══ QUOTE ══ */}
      <Box>
        <SectionHead label="Quote"
          action={
            <Tooltip title="Next quote">
              <IconButton onClick={nextQuote} size="small" sx={{
                color:"rgba(255,255,255,0.3)", p:0.3,
                "&:hover":{ color:"rgba(255,255,255,0.7)" },
                transition:"all 0.2s",
              }}>
                <RefreshIcon sx={{ fontSize:13 }}/>
              </IconButton>
            </Tooltip>
          }
        />
        <Box sx={{
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.07)",
          borderLeft:"2px solid rgba(255,255,255,0.18)",
          borderRadius:1.5, px:2, py:1.8,
          opacity: quoteAnim ? 0 : 1,
          transform: quoteAnim ? "translateY(6px)" : "translateY(0)",
          transition:"opacity 0.25s, transform 0.25s",
        }}>
          <Typography sx={{
            color:"rgba(255,255,255,0.75)", fontSize:"0.88rem",
            lineHeight:1.65, fontStyle:"italic", mb:1,
          }}>
            "{quote.text}"
          </Typography>
          <Typography sx={{ color:"rgba(255,255,255,0.28)", fontSize:"0.72rem", fontWeight:600 }}>
            — {quote.author}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}