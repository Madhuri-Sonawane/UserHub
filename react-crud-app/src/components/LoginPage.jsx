import { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";

const HEADLINES = [
  { text: "Hey beautiful soul ✨ The app just got better the moment you arrived!", emoji: "🌟" },
  { text: "Legend detected 👑 The dashboard has been waiting for someone like you!", emoji: "🏆" },
  { text: "Look who showed up! 🎉 You just made this whole app 10x more exciting!", emoji: "🎊" },
  { text: "You are absolutely incredible ✨ Ready to do something amazing today?", emoji: "💫" },
  { text: "Oh wow, it's YOU 🎯 The most interesting person to walk through this login!", emoji: "🌈" },
  { text: "Welcome, superstar 🌟 The world runs better when you're in it!", emoji: "🚀" },
  { text: "Hey there, you wonderful human 🙌 So glad you're here today!", emoji: "💎" },
  { text: "Look who decided to show up and slay 🔥 Proud of you already!", emoji: "👑" },
  { text: "Ahh there you are! ✨ We were wondering when the best one would arrive!", emoji: "🌸" },
  { text: "The vibe just shifted the second you logged in 💫 Let's gooo!", emoji: "⚡" },
];

function LoginPage({ onLogin, onBgChange, currentBg }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [headlineIdx] = useState(() => Math.floor(Math.random() * HEADLINES.length));
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState(false);

  const headline = HEADLINES[headlineIdx];

  const handleLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Don't leave this empty, we'd miss you 💌";
    if (!password) newErrors.password = "Your secret key, please 🔑";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    onLogin();
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center"
      sx={{ p: 2, position: "relative" }}>

      <IconButton onClick={onBgChange} title={`Theme: ${currentBg.name}`}
        sx={{
          position: "absolute", top: 20, right: 20,
          background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
          color: "#fff", border: "1px solid rgba(255,255,255,0.35)",
          "&:hover": { background: "rgba(255,255,255,0.35)", transform: "rotate(40deg)" },
          transition: "all 0.3s",
        }}>
        <PaletteIcon />
      </IconButton>

      {/* Floating ambient emojis */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {["✨", "🌟", "💫", "🎯", "🏆", "🌈", "⚡", "🎊"].map((e, i) => (
          <Box key={i} sx={{
            position: "absolute", fontSize: "1.8rem",
            left: `${8 + i * 11.5}%`, top: `${12 + (i % 3) * 28}%`,
            animation: `floatBg${i} ${3 + i * 0.6}s ease-in-out infinite alternate`, opacity: 0.28,
            [`@keyframes floatBg${i}`]: {
              "0%": { transform: "translateY(0) rotate(0deg)" },
              "100%": { transform: "translateY(-28px) rotate(12deg)" },
            },
          }}>{e}</Box>
        ))}
      </Box>

      <Box className={shaking ? "shake" : ""} sx={{
        background: "rgba(255,255,255,0.16)", backdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.3)", borderRadius: 5,
        p: { xs: 3, md: 5 }, width: "100%", maxWidth: 440,
        boxShadow: "0 30px 60px rgba(0,0,0,0.22)",
        animation: "slideUp 0.6s cubic-bezier(0.175,0.885,0.32,1.275)",
        "@keyframes slideUp": {
          "0%": { opacity: 0, transform: "translateY(40px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      }}>
        <Typography textAlign="center" sx={{
          fontSize: "3.8rem", mb: 1,
          animation: "bounceEmoji 2s ease-in-out infinite",
          "@keyframes bounceEmoji": {
            "0%,100%": { transform: "scale(1) rotate(-3deg)" },
            "50%": { transform: "scale(1.18) rotate(3deg)" },
          },
        }}>{headline.emoji}</Typography>

        <Typography variant="h5" textAlign="center" sx={{
          color: "#fff", fontWeight: 800, mb: 0.5,
          textShadow: "0 2px 12px rgba(0,0,0,0.25)",
          fontFamily: "'Georgia', serif", letterSpacing: "-0.5px",
        }}>Welcome Back! 🙌</Typography>

        <Typography textAlign="center" sx={{
          color: "rgba(255,255,255,0.88)", mb: 3,
          fontSize: "0.93rem", fontStyle: "italic", lineHeight: 1.5, px: 1,
        }}>{headline.text}</Typography>

        <TextField fullWidth label="Email Address" value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
          error={!!errors.email} helperText={errors.email} margin="normal" sx={glassInputSx}
        />
        <TextField fullWidth label="Password" type="password" value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
          error={!!errors.password} helperText={errors.password} margin="normal" sx={glassInputSx}
        />

        <Button fullWidth variant="contained" onClick={handleLogin} sx={{
          mt: 3, py: 1.5, borderRadius: 3, fontWeight: 700, fontSize: "1rem",
          textTransform: "none", letterSpacing: "0.4px",
          background: "linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))",
          color: "#5a3d8a", boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          "&:hover": { background: "#fff", transform: "translateY(-2px)", boxShadow: "0 12px 32px rgba(0,0,0,0.28)" },
          transition: "all 0.3s ease",
        }}>Let's Do This! 🚀</Button>

        <Typography textAlign="center" sx={{ mt: 2, color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>
          Any email & password works to enter 🔓
        </Typography>
      </Box>
    </Box>
  );
}

const glassInputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff", borderRadius: 2.5, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.28)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.55)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.88)" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.68)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
  "& .MuiFormHelperText-root": { color: "#ffe082" },
};

export default LoginPage;