import { useState } from "react";
import {
  Box, Typography, TextField, IconButton, Chip, Tooltip, InputAdornment,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";

const NOTE_COLORS = [
  { bg: "rgba(255,200,80,0.18)",  border: "rgba(255,200,80,0.4)",  dot: "#ffc850" },
  { bg: "rgba(100,220,180,0.18)", border: "rgba(100,220,180,0.4)", dot: "#64dcb4" },
  { bg: "rgba(180,120,255,0.18)", border: "rgba(180,120,255,0.4)", dot: "#b478ff" },
  { bg: "rgba(100,180,255,0.18)", border: "rgba(100,180,255,0.4)", dot: "#64b4ff" },
  { bg: "rgba(255,140,100,0.18)", border: "rgba(255,140,100,0.4)", dot: "#ff8c64" },
];

const PLACEHOLDER_TIPS = [
  "Jot something down... 📝",
  "Brain dump it here 🧠",
  "What's on your mind? 💭",
  "Note to self... ✏️",
  "Quick thought? Capture it! ⚡",
];

function Notespad() {
  const [notes, setNotes] = useState([
    { id: 1, text: "Remember to review user list 👥", colorIdx: 0, createdAt: new Date().toLocaleDateString() },
    { id: 2, text: "Todo list is looking great! Keep it up ✨", colorIdx: 1, createdAt: new Date().toLocaleDateString() },
    { id: 3, text: "Try changing the background theme 🎨", colorIdx: 2, createdAt: new Date().toLocaleDateString() },
  ]);
  const [input, setInput] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [placeholderIdx] = useState(() => Math.floor(Math.random() * PLACEHOLDER_TIPS.length));

  const addNote = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setNotes(prev => [
      { id: Date.now(), text: trimmed, colorIdx, createdAt: new Date().toLocaleDateString() },
      ...prev,
    ]);
    setInput("");
    setColorIdx(c => (c + 1) % NOTE_COLORS.length);
  };

  const deleteNote = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setNotes(prev => prev.filter(n => n.id !== id));
      setDeletingId(null);
    }, 450);
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text: editText.trim() } : n));
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <StickyNote2Icon sx={{ color: "#ffc850", fontSize: 26 }} />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            Quick Notes
          </Typography>
        </Box>
        <Chip
          label={`${notes.length} note${notes.length !== 1 ? "s" : ""}`}
          size="small"
          sx={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, border: "1px solid rgba(255,255,255,0.25)" }}
        />
      </Box>

      {/* Color picker row */}
      <Box display="flex" gap={0.8} mb={1.5} alignItems="center">
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mr: 0.5 }}>Color:</Typography>
        {NOTE_COLORS.map((c, i) => (
          <Box key={i} onClick={() => setColorIdx(i)} sx={{
            width: 20, height: 20, borderRadius: "50%",
            background: c.dot, cursor: "pointer",
            border: colorIdx === i ? "3px solid #fff" : "2px solid transparent",
            boxShadow: colorIdx === i ? `0 0 8px ${c.dot}` : "none",
            transition: "all 0.2s", transform: colorIdx === i ? "scale(1.25)" : "scale(1)",
          }} />
        ))}
      </Box>

      {/* Add note row */}
      <Box display="flex" gap={1} mb={2.5}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && addNote()}
          placeholder={PLACEHOLDER_TIPS[placeholderIdx]}
          multiline maxRows={3} size="small"
          sx={{ flex: 1, ...glassInputSx }}
        />
        <Tooltip title="Add Note">
          <IconButton onClick={addNote} sx={{
            color: "#ffc850", background: "rgba(255,200,80,0.15)",
            border: "1px solid rgba(255,200,80,0.3)", alignSelf: "flex-start", mt: 0.5,
            "&:hover": { background: "rgba(255,200,80,0.3)", transform: "scale(1.15)" },
            transition: "all 0.2s",
          }}>
            <AddCircleIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Notes grid */}
      <Box sx={{
        maxHeight: 360, overflowY: "auto", pr: 0.5,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": { borderRadius: 4, background: "rgba(255,255,255,0.2)" },
      }}>
        {notes.length === 0 && (
          <Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 5 }}>
            <Typography sx={{ fontSize: "2.5rem" }}>📝</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", mt: 1, fontSize: "0.9rem" }}>
              No notes yet. Add your first one!
            </Typography>
          </Box>
        )}

        {notes.map((note) => {
          const c = NOTE_COLORS[note.colorIdx ?? 0];
          const isDeleting = deletingId === note.id;
          const isEditing = editingId === note.id;

          return (
            <Box key={note.id} sx={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 3, p: 1.5, position: "relative",
              backdropFilter: "blur(10px)",
              animation: isDeleting
                ? "noteDelete 0.45s forwards"
                : "noteIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
              "@keyframes noteIn": {
                "0%": { opacity: 0, transform: "scale(0.7) rotate(-4deg)" },
                "100%": { opacity: 1, transform: "scale(1) rotate(0deg)" },
              },
              "@keyframes noteDelete": {
                "0%": { opacity: 1, transform: "scale(1) rotate(0deg)" },
                "100%": { opacity: 0, transform: "scale(0.5) rotate(8deg)" },
              },
              "&:hover .note-actions": { opacity: 1 },
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: `0 8px 24px ${c.dot}44` },
            }}>
              {/* Color dot */}
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, mb: 1, boxShadow: `0 0 6px ${c.dot}88` }} />

              {isEditing ? (
                <Box>
                  <TextField
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) saveEdit(note.id); if (e.key === "Escape") cancelEdit(); }}
                    multiline size="small" autoFocus fullWidth
                    sx={{ mb: 1, ...glassInputSx, "& .MuiInputBase-input": { fontSize: "0.82rem" } }}
                  />
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small" onClick={() => saveEdit(note.id)}
                      sx={{ color: "#43e97b", p: 0.4, "&:hover": { background: "rgba(67,233,123,0.15)" } }}>
                      <CheckIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={cancelEdit}
                      sx={{ color: "#ff6b6b", p: 0.4, "&:hover": { background: "rgba(255,107,107,0.15)" } }}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography sx={{
                    color: "#fff", fontSize: "0.85rem", lineHeight: 1.5,
                    wordBreak: "break-word", minHeight: 36,
                  }}>{note.text}</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.38)", fontSize: "0.68rem", mt: 1 }}>
                    {note.createdAt}
                  </Typography>

                  {/* Hover actions */}
                  <Box className="note-actions" sx={{
                    position: "absolute", top: 8, right: 8,
                    display: "flex", gap: 0.3, opacity: 0, transition: "opacity 0.2s",
                  }}>
                    <IconButton size="small" onClick={() => startEdit(note)}
                      sx={{ color: "rgba(255,255,255,0.6)", p: 0.3, background: "rgba(0,0,0,0.2)",
                        "&:hover": { color: "#fff", background: "rgba(0,0,0,0.4)" } }}>
                      <EditIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteNote(note.id)}
                      sx={{ color: "rgba(255,100,100,0.7)", p: 0.3, background: "rgba(0,0,0,0.2)",
                        "&:hover": { color: "#ff6b6b", background: "rgba(0,0,0,0.4)" } }}>
                      <DeleteIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

const glassInputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff", background: "rgba(255,255,255,0.1)", borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.85)" },
  },
  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.45)", opacity: 1 },
};

export default Notespad;