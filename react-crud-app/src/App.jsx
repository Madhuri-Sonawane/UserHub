import { useState } from "react";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import LoginPage from "./components/LoginPage";
import AnimatedEmoji from "./components/AnimatedEmoji";
import Notespad from "./components/Notespad";
import WeatherQuote from "./components/WeatherQuote";
import Dashboard from "./components/Dashboard";
import { Box, Card, CardContent } from "@mui/material";
import "./App.css";

const BACKGROUNDS = [
  { name: "Ocean Breeze",   value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Sunset Vibes",   value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Arctic Blue",    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Forest Fresh",   value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Cherry Blossom", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Midnight",       value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { name: "Peach Dream",    value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Aurora",         value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
];

const VIEW_MAX_WIDTHS = {
  home:    600,
  todo:    640,
  notes:   640,
  weather: 520,
};

function App() {
  const [view, setView]             = useState("home");
  const [bgIndex, setBgIndex]       = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emojiEvent, setEmojiEvent] = useState(null);

  const triggerEmoji = (event) => {
    setEmojiEvent(event);
    setTimeout(() => setEmojiEvent(null), 3000);
  };

  const cycleBg = () => setBgIndex(prev => (prev + 1) % BACKGROUNDS.length);

  const handleLogin = () => {
    triggerEmoji("login");
    setTimeout(() => setIsLoggedIn(true), 1200);
  };

  /* ── Login screen ─────────────────────────────────────── */
  if (!isLoggedIn) {
    return (
      <Box sx={{ background: BACKGROUNDS[bgIndex].value, minHeight: "100vh", transition: "background 0.8s ease" }}>
        <LoginPage
          onLogin={handleLogin}
          onBgChange={cycleBg}
          currentBg={BACKGROUNDS[bgIndex]}
        />
        {emojiEvent === "login" && <AnimatedEmoji event="login" />}
      </Box>
    );
  }

  /* ── Main app ─────────────────────────────────────────── */
  return (
    <Box minHeight="100vh" sx={{ background: BACKGROUNDS[bgIndex].value, transition: "background 0.8s ease" }}>
      <Navbar
        view={view}
        onViewChange={setView}
        onBgChange={cycleBg}
        currentBg={BACKGROUNDS[bgIndex]}
        onLogout={() => { setIsLoggedIn(false); setView("home"); }}
      />

      <Box
        display="flex" justifyContent="center" alignItems="flex-start"
        minHeight="calc(100vh - 56px)" p={3} pt={4}
      >
        <Card sx={{
          width: "100%",
          maxWidth: VIEW_MAX_WIDTHS[view] || 540,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow: "0 25px 45px rgba(0,0,0,0.2)",
          transition: "max-width 0.4s ease",
        }}>
          <CardContent sx={{ p: 3 }}>
            {view === "home"    && <Dashboard onNavigate={setView} />}
            {view === "todo"    && <TodoList onEmojiTrigger={triggerEmoji} />}
            {view === "notes"   && <Notespad />}
            {view === "weather" && <WeatherQuote />}
          </CardContent>
        </Card>
      </Box>

      {emojiEvent && <AnimatedEmoji event={emojiEvent} />}
    </Box>
  );
}

export default App;