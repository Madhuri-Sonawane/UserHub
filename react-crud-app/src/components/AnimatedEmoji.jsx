import { Box } from "@mui/material";

const EVENT_CONFIG = {
  "login": {
    emojis: ["😍", "🎉", "✨", "💖", "🌟", "🔥", "💃", "🥂"],
    message: "Welcome back, gorgeous! 💋",
    color: "#ff6b9d",
  },
  "add-todo": {
    emojis: ["😊", "✅", "🌟", "👏", "💪", "🙌", "🎯", "✨"],
    message: "New task added! Let's crush it! 💪",
    color: "#4facfe",
  },
  "done-todo": {
    emojis: ["🎉", "🏆", "🥳", "🎊", "⭐", "🌈", "💯", "🔥"],
    message: "YESSS! Task conquered! 🏆",
    color: "#43e97b",
  },
  "delete-todo": {
    emojis: ["😭", "💔", "😢", "👋", "🌧️", "😪", "🥺", "😿"],
    message: "See you soon... or not 😢",
    color: "#667eea",
  },
};

function AnimatedEmoji({ event }) {
  const config = EVENT_CONFIG[event] || EVENT_CONFIG["add-todo"];

  // Generate random positions for explosion
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360;
    const distance = 80 + Math.random() * 120;
    const emoji = config.emojis[i % config.emojis.length];
    const delay = Math.random() * 0.4;
    const size = 1.5 + Math.random() * 1.5;
    return { angle, distance, emoji, delay, size };
  });

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {/* Center explosion */}
      <Box sx={{ position: "relative", width: 0, height: 0 }}>
        {particles.map((p, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              fontSize: `${p.size}rem`,
              left: 0,
              top: 0,
              animation: `explode-${i} 2.5s ease-out forwards`,
              animationDelay: `${p.delay}s`,
              opacity: 0,
              [`@keyframes explode-${i}`]: {
                "0%": {
                  opacity: 1,
                  transform: "translate(-50%, -50%) scale(0) rotate(0deg)",
                },
                "30%": {
                  opacity: 1,
                  transform: `translate(calc(-50% + ${Math.cos((p.angle * Math.PI) / 180) * p.distance}px), calc(-50% + ${Math.sin((p.angle * Math.PI) / 180) * p.distance}px)) scale(1.2) rotate(${p.angle}deg)`,
                },
                "70%": {
                  opacity: 0.8,
                  transform: `translate(calc(-50% + ${Math.cos((p.angle * Math.PI) / 180) * p.distance * 1.5}px), calc(-50% + ${Math.sin((p.angle * Math.PI) / 180) * p.distance * 1.5 + 30}px)) scale(0.9) rotate(${p.angle * 2}deg)`,
                },
                "100%": {
                  opacity: 0,
                  transform: `translate(calc(-50% + ${Math.cos((p.angle * Math.PI) / 180) * p.distance * 2}px), calc(-50% + ${Math.sin((p.angle * Math.PI) / 180) * p.distance * 2 + 80}px)) scale(0.3) rotate(${p.angle * 3}deg)`,
                },
              },
            }}
          >
            {p.emoji}
          </Box>
        ))}

        {/* Center message bubble */}
        <Box
          sx={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
            backdropFilter: "blur(16px)",
            border: "2px solid rgba(255,255,255,0.5)",
            borderRadius: 4,
            px: 3,
            py: 1.5,
            whiteSpace: "nowrap",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: `0 12px 40px ${config.color}66`,
            animation: "centerPop 2.5s ease forwards",
            "@keyframes centerPop": {
              "0%": { opacity: 0, transform: "translate(-50%, -50%) scale(0) rotate(-10deg)" },
              "15%": { opacity: 1, transform: "translate(-50%, -50%) scale(1.1) rotate(2deg)" },
              "25%": { transform: "translate(-50%, -50%) scale(1) rotate(0deg)" },
              "70%": { opacity: 1 },
              "100%": { opacity: 0, transform: "translate(-50%, -60%) scale(0.8)" },
            },
          }}
        >
          {config.message}
        </Box>
      </Box>
    </Box>
  );
}

export default AnimatedEmoji;