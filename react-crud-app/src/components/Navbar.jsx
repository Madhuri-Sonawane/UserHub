import { AppBar, Toolbar, Typography, Button, IconButton, Tooltip, Box } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import LogoutIcon from "@mui/icons-material/Logout";

const NAV_ITEMS = [
  { label: "Home",  icon: "🏠", view: "home" },
  { label: "To-Do", icon: "📋", view: "todo" },
  { label: "Notes", icon: "📝", view: "notes" },
  { label: "Vibes", icon: "🌤️", view: "weather" },
];

function Navbar({ view, onViewChange, onBgChange, currentBg, onLogout }) {
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

          <Tooltip title={`Change theme: ${currentBg?.name || ""}`}>
            <IconButton onClick={onBgChange} size="small" sx={{
              color: "#fff", ml: 0.5,
              background: "rgba(255,255,255,0.13)", border: "1px solid rgba(255,255,255,0.22)",
              "&:hover": { background: "rgba(255,255,255,0.26)", transform: "rotate(45deg)" },
              transition: "all 0.3s",
            }}>
              <PaletteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

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