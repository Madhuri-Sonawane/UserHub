import { Box, Typography } from "@mui/material";

const CONFIG = {
  "login":      { message: "Signed in",         color: "rgba(255,255,255,0.12)" },
  "add-todo":   { message: "Task added",         color: "rgba(34,197,94,0.12)"  },
  "done-todo":  { message: "Task completed",     color: "rgba(34,197,94,0.12)"  },
  "delete-todo":{ message: "Task removed",       color: "rgba(248,113,113,0.1)" },
};

export default function AnimatedEmoji({ event }) {
  const cfg = CONFIG[event] || CONFIG["add-todo"];

  return (
    <Box sx={{
      position:"fixed", bottom:24, right:24,
      zIndex:9999, pointerEvents:"none",
      animation:"toastIn 2.4s cubic-bezier(0.22,1,0.36,1) forwards",
      "@keyframes toastIn":{
        "0%":   { opacity:0, transform:"translateY(12px) scale(0.95)" },
        "12%":  { opacity:1, transform:"translateY(0)   scale(1)"     },
        "75%":  { opacity:1, transform:"translateY(0)   scale(1)"     },
        "100%": { opacity:0, transform:"translateY(-6px) scale(0.97)" },
      },
    }}>
      <Box sx={{
        background: "rgba(10,8,28,0.88)",
        backdropFilter:"blur(20px)",
        border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:1.5,
        px:2, py:1.2,
        display:"flex", alignItems:"center", gap:1.2,
        boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
        minWidth:160,
      }}>
        {/* Status dot */}
        <Box sx={{
          width:6, height:6, borderRadius:"50%", flexShrink:0,
          background: event==="delete-todo" ? "#f87171" : "#22c55e",
          boxShadow: event==="delete-todo" ? "0 0 6px #f87171" : "0 0 6px #22c55e",
        }}/>
        <Typography sx={{
          color:"rgba(255,255,255,0.75)", fontSize:"0.8rem",
          fontWeight:500, letterSpacing:"0.01em",
        }}>
          {cfg.message}
        </Typography>
      </Box>
    </Box>
  );
}