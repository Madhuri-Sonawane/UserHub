import { useState, useEffect } from "react";
import { Box, Typography, Grid, Chip } from "@mui/material";

const MOTIVATIONAL = [
  "You're doing amazing — keep that energy! ⚡",
  "Every great day starts with a single login 🚀",
  "The best time to start was yesterday. Second best? Right now! 💪",
  "You showed up. That already makes you ahead of most! 🏆",
  "Another day, another chance to be legendary ✨",
  "The app is better just because you're here 🌟",
];

const TIPS = [
  { icon: "📋", title: "To-Do",  view: "todo",    desc: "Add tasks, set priorities, track progress" },
  { icon: "📝", title: "Notes",  view: "notes",   desc: "Capture quick thoughts in colorful sticky notes" },
  { icon: "🌤️", title: "Vibes",  view: "weather", desc: "Live weather + motivational quotes for you" },
];

function Dashboard({ onNavigate }) {
  const [time, setTime] = useState(new Date());
  const [motIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL.length));

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const greetEmoji = hour < 5 ? "🌙" : hour < 12 ? "🌅" : hour < 17 ? "☀️" : hour < 20 ? "🌆" : "🌙";

  const stats = [
    { label: "To-Do Tasks",  value: "∞",       icon: "📋", color: "#4facfe", bg: "rgba(79,172,254,0.15)" },
    { label: "Notes Ready",  value: "📝",      icon: "✏️", color: "#43e97b", bg: "rgba(67,233,123,0.15)" },
    { label: "App Theme",    value: "🎨",      icon: "🖌️", color: "#fa709a", bg: "rgba(250,112,154,0.15)" },
    { label: "Your Mood",    value: "🔥 On Fire", icon: "💫", color: "#ffd93d", bg: "rgba(255,217,61,0.15)" },
  ];

  return (
    <Box sx={{
      animation: "dashIn 0.5s ease",
      "@keyframes dashIn": {
        "0%": { opacity: 0, transform: "translateY(16px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
    }}>
      {/* Hero greeting */}
      <Box sx={{
        background: "rgba(255,255,255,0.08)", borderRadius: 4,
        p: 3, mb: 2.5, border: "1px solid rgba(255,255,255,0.15)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <Box sx={{
          position: "absolute", right: -30, top: -30,
          width: 130, height: 130, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)", pointerEvents: "none",
        }} />
        <Box sx={{
          position: "absolute", right: 30, bottom: -40,
          width: 90, height: 90, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)", pointerEvents: "none",
        }} />

        <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Box>
            <Typography sx={{
              fontSize: "2rem", mb: 0.3,
              animation: "wave 2s ease-in-out infinite",
              display: "inline-block",
              "@keyframes wave": {
                "0%,100%": { transform: "rotate(0deg)" },
                "25%": { transform: "rotate(20deg)" },
                "75%": { transform: "rotate(-10deg)" },
              },
            }}>{greetEmoji}</Typography>
            <Typography variant="h5" sx={{
              color: "#fff", fontWeight: 800, lineHeight: 1.2,
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
              fontFamily: "'Georgia', serif",
            }}>
              {greeting}! 👋
            </Typography>
            <Typography sx={{
              color: "rgba(255,255,255,0.72)", mt: 0.5,
              fontSize: "0.92rem", fontStyle: "italic",
            }}>
              {MOTIVATIONAL[motIdx]}
            </Typography>
          </Box>

          {/* Live clock */}
          <Box sx={{
            textAlign: "right",
            background: "rgba(255,255,255,0.1)", borderRadius: 3,
            px: 2.5, py: 1.5, border: "1px solid rgba(255,255,255,0.18)",
          }}>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mt: 0.3 }}>
              {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats row */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} mb={2.5}>
        {stats.map((s, i) => (
          <Box key={i} sx={{
            background: s.bg, borderRadius: 3,
            p: 2, border: `1px solid ${s.color}33`,
            animation: `statIn 0.4s ease ${i * 0.08}s both`,
            "@keyframes statIn": {
              "0%": { opacity: 0, transform: "scale(0.88)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
            "&:hover": { transform: "translateY(-3px)", boxShadow: `0 8px 24px ${s.color}33` },
            transition: "all 0.25s ease", cursor: "default",
          }}>
            <Typography sx={{ fontSize: "1.6rem", lineHeight: 1, mb: 0.5 }}>{s.icon}</Typography>
            <Typography sx={{ color: s.color, fontWeight: 800, fontSize: "1.15rem", lineHeight: 1 }}>
              {s.value}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mt: 0.3 }}>
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Quick nav cards */}
      <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", fontWeight: 600, mb: 1.2, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Quick Access
      </Typography>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.2}>
        {TIPS.map((t, i) => (
          <Box key={i} onClick={() => onNavigate(t.view)}
            sx={{
              background: "rgba(255,255,255,0.08)", borderRadius: 3,
              p: 2, border: "1px solid rgba(255,255,255,0.14)",
              cursor: "pointer",
              animation: `cardIn 0.4s ease ${0.2 + i * 0.08}s both`,
              "@keyframes cardIn": {
                "0%": { opacity: 0, transform: "translateY(12px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
              "&:hover": {
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.3)",
                transform: "translateY(-3px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              },
              transition: "all 0.22s ease",
            }}>
            <Typography sx={{ fontSize: "1.5rem", mb: 0.8 }}>{t.icon}</Typography>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.88rem" }}>{t.title}</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", mt: 0.3, lineHeight: 1.4 }}>
              {t.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Dashboard;