import { useState } from "react";
import Navbar       from "./components/Navbar";
import TodoList     from "./components/TodoList";
import LoginPage    from "./components/LoginPage";
import AnimatedEmoji from "./components/AnimatedEmoji";
import Notespad     from "./components/Notespad";
import WeatherQuote from "./components/WeatherQuote";
import Dashboard    from "./components/Dashboard";
import { Box, Card, CardContent } from "@mui/material";
import "./App.css";

const BACKGROUNDS = [
  { name: "Ocean Breeze",  value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Slate Dusk",    value: "linear-gradient(135deg, #2c3e6b 0%, #4a5568 100%)" },
  { name: "Deep Ocean",    value: "linear-gradient(135deg, #1a365d 0%, #2d6a8f 100%)" },
  { name: "Sage & Stone",  value: "linear-gradient(135deg, #2d4a3e 0%, #4a6741 100%)" },
  { name: "Cherry Blossom",value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Midnight",      value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { name: "Warm Charcoal", value: "linear-gradient(135deg, #2d2d2d 0%, #4a3f35 100%)" },
  { name: "Aurora",        value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
];

const MAX_W = { home:520, todo:560, notes:640, weather:480 };

export default function App() {
  const [view,       setView]       = useState("home");
  const [bgIndex,    setBgIndex]    = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast,      setToast]      = useState(null);

  const triggerToast = (event) => {
    setToast(event);
    setTimeout(() => setToast(null), 2600);
  };

  const handleLogin = () => {
    triggerToast("login");
    setTimeout(() => setIsLoggedIn(true), 400);
  };

  if (!isLoggedIn) {
    return (
      <Box sx={{ background: BACKGROUNDS[bgIndex].value, minHeight:"100vh", transition:"background 0.8s ease" }}>
        <LoginPage
          onLogin={handleLogin}
          onBgChange={() => setBgIndex(p => (p+1) % BACKGROUNDS.length)}
          currentBg={BACKGROUNDS[bgIndex]}
        />
        {toast === "login" && <AnimatedEmoji event="login" />}
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" sx={{ background: BACKGROUNDS[bgIndex].value, transition:"background 0.8s ease" }}>
      <Navbar
        view={view}
        onViewChange={setView}
        backgrounds={BACKGROUNDS}
        bgIndex={bgIndex}
        onBgSelect={setBgIndex}
        onLogout={() => { setIsLoggedIn(false); setView("home"); }}
      />

      <Box display="flex" justifyContent="center" alignItems="flex-start"
        minHeight="calc(100vh - 52px)" p={3} pt={4}
      >
        <Card sx={{
          width:"100%",
          maxWidth: MAX_W[view] || 520,
          borderRadius:2.5,
          background:"rgba(8,6,24,0.72)",
          backdropFilter:"blur(32px)",
          border:"1px solid rgba(255,255,255,0.08)",
          boxShadow:"0 32px 80px rgba(0,0,0,0.45)",
          transition:"max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <CardContent sx={{ p:"28px 28px" }}>
            {view === "home"    && <Dashboard    onNavigate={setView}            />}
            {view === "todo"    && <TodoList     onEmojiTrigger={triggerToast}   />}
            {view === "notes"   && <Notespad                                     />}
            {view === "weather" && <WeatherQuote                                 />}
          </CardContent>
        </Card>
      </Box>

      {toast && toast !== "login" && <AnimatedEmoji event={toast} />}
    </Box>
  );
}