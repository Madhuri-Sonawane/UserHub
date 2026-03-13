import { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Tooltip, Box } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import LogoutIcon  from "@mui/icons-material/Logout";

const NAV_ITEMS = [
  { label: "Home",  icon: "🏠", view: "home" },
  { label: "To-Do", icon: "📋", view: "todo" },
  { label: "Notes", icon: "📝", view: "notes" },
  { label: "Vibes", icon: "🌤️", view: "weather" },
];

/* ── Circular Background Palette Picker ───────────────────────── */
function BgPalette({ backgrounds, bgIndex, onBgSelect }) {
  const [open,    setOpen]    = useState(false);
  const [hovered, setHovered] = useState(null);
  const wrapRef               = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const preview   = hovered !== null ? backgrounds[hovered] : backgrounds[bgIndex];
  const N         = backgrounds.length;
  const R         = 78;   // orbit radius px (inside 200×200 stage)
  const C         = 100;  // centre of stage

  /* Midpoint color of each gradient for the dot */
  const dotColor = (bg) => {
    const m = bg.value.match(/#[0-9a-fA-F]{6}/g);
    return m ? m[Math.floor(m.length / 2)] : "#fff";
  };

  return (
    <Box ref={wrapRef} sx={{ position: "relative" }}>
      {/* Trigger button */}
      <Tooltip title="Change background theme">
        <IconButton
          onClick={() => setOpen(o => !o)}
          size="small"
          sx={{
            color: "#fff", ml: 0.5,
            background: open ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.13)",
            border: "1px solid rgba(255,255,255,0.22)",
            transition: "all 0.3s",
            "&:hover": { background: "rgba(255,255,255,0.26)", transform: "rotate(30deg)" },
          }}
        >
          <PaletteIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      {/* Dropdown picker */}
      {open && (
        <Box sx={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          zIndex: 9999,
          background: "rgba(14,10,36,0.96)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 4,
          p: "16px 16px 14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
          width: 230,
          animation: "bgPickerIn 0.25s cubic-bezier(0.175,0.885,0.32,1.275)",
          "@keyframes bgPickerIn": {
            "0%":   { opacity: 0, transform: "scale(0.82) translateY(-8px)" },
            "100%": { opacity: 1, transform: "scale(1)   translateY(0)" },
          },
        }}>

          {/* Live gradient preview strip */}
          <Box sx={{
            width: "100%", height: 44, borderRadius: 2.5, mb: 1.5,
            background: preview.value,
            border: "1px solid rgba(255,255,255,0.12)",
            transition: "background 0.3s ease",
          }} />

          {/* Hovered / selected name */}
          <Typography sx={{
            color: "#fff", fontWeight: 700, fontSize: "0.8rem",
            textAlign: "center", mb: 1.5, letterSpacing: "0.04em",
            minHeight: 16, transition: "color 0.2s",
          }}>
            {preview.name}
          </Typography>

          {/* Circle stage */}
          <Box sx={{ position: "relative", width: 200, height: 200, mx: "auto" }}>

            {/* Centre preview disc */}
            <Box sx={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 52, height: 52, borderRadius: "50%",
              background: preview.value,
              border: "2px solid rgba(255,255,255,0.22)",
              boxShadow: "0 0 20px rgba(0,0,0,0.4)",
              transition: "background 0.28s ease",
            }} />

            {/* Orbit dots */}
            {backgrounds.map((bg, i) => {
              const angle     = (i / N) * 2 * Math.PI - Math.PI / 2;
              const x         = C + R * Math.cos(angle);
              const y         = C + R * Math.sin(angle);
              const isActive  = i === bgIndex;
              const isHov     = hovered === i;

              return (
                <Box
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { onBgSelect(i); setOpen(false); }}
                  sx={{
                    position: "absolute",
                    left: x, top: y,
                    transform: "translate(-50%, -50%)",
                    width:  isHov || isActive ? 28 : 22,
                    height: isHov || isActive ? 28 : 22,
                    borderRadius: "50%",
                    background: bg.value,
                    cursor: "pointer",
                    border: isActive
                      ? "3px solid #fff"
                      : isHov
                      ? "2px solid rgba(255,255,255,0.7)"
                      : "2px solid rgba(255,255,255,0.18)",
                    boxShadow: isActive
                      ? "0 0 14px rgba(255,255,255,0.5)"
                      : isHov
                      ? "0 0 10px rgba(255,255,255,0.3)"
                      : "none",
                    transition: "all 0.18s ease",
                  }}
                />
              );
            })}
          </Box>

          {/* Hint */}
          <Typography sx={{
            color: "rgba(255,255,255,0.35)", fontSize: "0.68rem",
            textAlign: "center", mt: 1,
          }}>
            Click a circle to apply
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/* ── Navbar ───────────────────────────────────────────────────── */
function Navbar({ view, onViewChange, backgrounds, bgIndex, onBgSelect, onLogout }) {
  return (
    <AppBar position="static" elevation={0} sx={{
      background: "rgba(255,255,255,0.14)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}>
      <Toolbar sx={{ gap: 0.5, minHeight: "56px !important" }}>
        <Typography variant="h6" sx={{
          flexGrow: 1, fontWeight: 800, color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,0.2)", letterSpacing: "-0.5px",
          fontSize: "1.1rem",
        }}>
          ✨ User Hub
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
          {NAV_ITEMS.map(({ label, icon, view: v }) => (
            <Button key={v} onClick={() => onViewChange(v)} sx={{
              textTransform: "none", color: "#fff",
              fontWeight: view === v ? 800 : 500,
              borderRadius: 2.5, px: 1.4, py: 0.7,
              fontSize: "0.82rem", gap: 0.5, minWidth: 0,
              background: view === v ? "rgba(255,255,255,0.22)" : "transparent",
              border: view === v ? "1px solid rgba(255,255,255,0.32)" : "1px solid transparent",
              "&:hover": { background: "rgba(255,255,255,0.18)", transform: "translateY(-1px)" },
              transition: "all 0.2s ease",
            }}>
              <span style={{ fontSize: "0.95rem" }}>{icon}</span>
              {label}
            </Button>
          ))}

          {/* Circular palette picker */}
          <BgPalette
            backgrounds={backgrounds}
            bgIndex={bgIndex}
            onBgSelect={onBgSelect}
          />

          <Tooltip title="Logout">
            <IconButton onClick={onLogout} size="small" sx={{
              color: "#fff", ml: 0.3,
              background: "rgba(255,100,100,0.18)", border: "1px solid rgba(255,130,130,0.22)",
              "&:hover": { background: "rgba(255,100,100,0.36)", transform: "scale(1.1)" },
              transition: "all 0.2s",
            }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;