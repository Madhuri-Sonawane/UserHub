import { useState, useRef } from "react";
import {
  Box, Typography, IconButton, Chip, Tooltip, Button, Select, MenuItem,
} from "@mui/material";
import StickyNote2Icon  from "@mui/icons-material/StickyNote2";
import AddIcon          from "@mui/icons-material/Add";
import DeleteIcon       from "@mui/icons-material/Delete";
import EditIcon         from "@mui/icons-material/Edit";
import CloseIcon        from "@mui/icons-material/Close";
import SaveIcon         from "@mui/icons-material/Save";
import ImageIcon        from "@mui/icons-material/Image";
import FormatBoldIcon         from "@mui/icons-material/FormatBold";
import FormatItalicIcon       from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon   from "@mui/icons-material/FormatUnderlined";
import FormatColorTextIcon    from "@mui/icons-material/FormatColorText";

/* ── Constants ───────────────────────────────────────── */
const NOTE_COLORS = [
  { bg: "rgba(255,200,80,0.18)",  border: "rgba(255,200,80,0.45)",  dot: "#ffc850" },
  { bg: "rgba(100,220,180,0.18)", border: "rgba(100,220,180,0.45)", dot: "#64dcb4" },
  { bg: "rgba(180,120,255,0.18)", border: "rgba(180,120,255,0.45)", dot: "#b478ff" },
  { bg: "rgba(100,180,255,0.18)", border: "rgba(100,180,255,0.45)", dot: "#64b4ff" },
  { bg: "rgba(255,140,100,0.18)", border: "rgba(255,140,100,0.45)", dot: "#ff8c64" },
];

const FONT_FAMILIES = ["Default","Georgia","Arial","Courier New","Verdana","Times New Roman"];
const FONT_SIZES    = ["12","14","16","18","20","24","28","32","40"];
const TEXT_COLORS   = [
  "#ffffff","#ffd93d","#43e97b","#4facfe",
  "#fa709a","#ff8c64","#b478ff","#64dcb4",
  "#ff6b6b","#a8edea","#f9ca24","#6ab04c",
];

const BLANK_DRAFT = { id: null, heading: "", html: "", image: null, colorIdx: 0 };

/* ── Small toolbar icon-button ───────────────────────── */
function TBtn({ title, onClick, children }) {
  return (
    <Tooltip title={title}>
      <IconButton
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        size="small"
        sx={{
          color: "rgba(255,255,255,0.78)", borderRadius: 1.5, p: 0.55,
          "&:hover": { color: "#fff", background: "rgba(255,255,255,0.15)" },
          transition: "all 0.14s",
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

/* ── Main ────────────────────────────────────────────── */
function Notespad() {
  const [notes, setNotes] = useState([
    {
      id: 1, colorIdx: 0,
      heading: "Welcome Note ✨",
      html: "<p>This is your first <b>rich note</b>! Click the <u>edit</u> icon to open the editor.</p>",
      image: null,
      createdAt: new Date().toLocaleDateString(),
    },
    {
      id: 2, colorIdx: 2,
      heading: "App Tips 🎨",
      html: "<p>Try changing the <b>background theme</b> using the palette 🎨 button in the navbar!</p>",
      image: null,
      createdAt: new Date().toLocaleDateString(),
    },
  ]);

  const [mode,       setMode]       = useState("list");   // "list" | "editor"
  const [draft,      setDraft]      = useState({ ...BLANK_DRAFT });
  const [deletingId, setDeletingId] = useState(null);
  const [fontFamily, setFontFamily] = useState("Default");
  const [fontSize,   setFontSize]   = useState("14");
  const [colorPicker,setColorPicker]= useState(false);

  const editorRef = useRef(null);
  const fileRef   = useRef(null);

  /* ── execCommand ─────────────────────────────────────── */
  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const applyFont = (f) => {
    setFontFamily(f);
    if (f !== "Default") exec("fontName", f);
  };

  const applySize = (s) => {
    setFontSize(s);
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    try {
      const range = sel.getRangeAt(0);
      const span  = document.createElement("span");
      span.style.fontSize = `${s}px`;
      range.surroundContents(span);
    } catch (_) {}
  };

  const applyColor = (col) => { exec("foreColor", col); setColorPicker(false); };

  /* ── Image upload ──────────────────────────────────── */
  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDraft(d => ({ ...d, image: ev.target.result }));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── Open / Close ──────────────────────────────────── */
  const openNew = () => {
    setDraft({ ...BLANK_DRAFT });
    setMode("editor");
    setFontFamily("Default"); setFontSize("14");
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = ""; }, 0);
  };

  const openEdit = (note) => {
    setDraft({ ...note });
    setMode("editor");
    setFontFamily("Default"); setFontSize("14");
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = note.html || ""; }, 0);
  };

  const cancel = () => { setMode("list"); setDraft({ ...BLANK_DRAFT }); };

  /* ── Save ─────────────────────────────────────────── */
  const saveNote = () => {
    const html = editorRef.current?.innerHTML?.trim() || "";
    if (!draft.heading.trim() && !html) return;
    const saved = {
      ...draft,
      html,
      id:        draft.id || Date.now(),
      createdAt: draft.id ? draft.createdAt : new Date().toLocaleDateString(),
    };
    setNotes(prev => draft.id ? prev.map(n => n.id === draft.id ? saved : n) : [saved, ...prev]);
    setMode("list");
  };

  /* ── Delete ───────────────────────────────────────── */
  const deleteNote = (id) => {
    setDeletingId(id);
    setTimeout(() => { setNotes(p => p.filter(n => n.id !== id)); setDeletingId(null); }, 420);
  };

  /* ══════════ EDITOR VIEW ══════════ */
  if (mode === "editor") {
    const c = NOTE_COLORS[draft.colorIdx];

    return (
      <Box sx={{
        animation: "eIn 0.32s ease",
        "@keyframes eIn": { "0%": { opacity: 0, transform: "translateY(14px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      }}>

        {/* Top bar */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <StickyNote2Icon sx={{ color: "#ffc850", fontSize: 21 }} />
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.98rem" }}>
              {draft.id ? "Edit Note" : "New Note"} ✏️
            </Typography>
          </Box>
          <IconButton size="small" onClick={cancel}
            sx={{ color: "rgba(255,255,255,0.45)", "&:hover": { color: "#ff6b6b" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Color picker row */}
        <Box display="flex" gap={0.7} mb={1.8} alignItems="center">
          <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", mr: 0.3 }}>Color:</Typography>
          {NOTE_COLORS.map((nc, i) => (
            <Box key={i} onClick={() => setDraft(d => ({ ...d, colorIdx: i }))} sx={{
              width: 17, height: 17, borderRadius: "50%", background: nc.dot, cursor: "pointer",
              border: draft.colorIdx === i ? "3px solid #fff" : "2px solid transparent",
              boxShadow: draft.colorIdx === i ? `0 0 8px ${nc.dot}` : "none",
              transform: draft.colorIdx === i ? "scale(1.3)" : "scale(1)",
              transition: "all 0.16s",
            }} />
          ))}
        </Box>

        {/* ── Heading input ── */}
        <Box
          component="input"
          value={draft.heading}
          onChange={e => setDraft(d => ({ ...d, heading: e.target.value }))}
          placeholder="Note heading..."
          sx={{
            width: "100%", boxSizing: "border-box",
            border: "none", outline: "none", background: "transparent",
            color: "#fff", fontWeight: 800, fontSize: "1.3rem",
            fontFamily: "Georgia, serif",
            borderBottom: "1px solid rgba(255,255,255,0.18)",
            pb: 0.8, mb: 2,
            "&::placeholder": { color: "rgba(255,255,255,0.28)" },
          }}
        />

        {/* ── Formatting toolbar ── */}
        <Box sx={{
          display: "flex", flexWrap: "wrap", gap: 0.2, alignItems: "center",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 2, p: 0.7, mb: 1.2,
        }}>
          <TBtn title="Bold (Ctrl+B)"      onClick={() => exec("bold")}><FormatBoldIcon sx={{ fontSize: 16 }} /></TBtn>
          <TBtn title="Italic (Ctrl+I)"    onClick={() => exec("italic")}><FormatItalicIcon sx={{ fontSize: 16 }} /></TBtn>
          <TBtn title="Underline (Ctrl+U)" onClick={() => exec("underline")}><FormatUnderlinedIcon sx={{ fontSize: 16 }} /></TBtn>

          <Divider />

          {/* Font family */}
          <Select value={fontFamily} onChange={e => applyFont(e.target.value)}
            size="small" variant="standard" disableUnderline
            sx={selectSx(96)}
            MenuProps={{ PaperProps: { sx: menuSx } }}
          >
            {FONT_FAMILIES.map(f => <MenuItem key={f} value={f} sx={{ fontSize: "0.78rem" }}>{f}</MenuItem>)}
          </Select>

          <Divider />

          {/* Font size */}
          <Select value={fontSize} onChange={e => applySize(e.target.value)}
            size="small" variant="standard" disableUnderline
            sx={selectSx(58)}
            MenuProps={{ PaperProps: { sx: menuSx } }}
          >
            {FONT_SIZES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: "0.78rem" }}>{s}px</MenuItem>)}
          </Select>

          <Divider />

          {/* Text color */}
          <Box sx={{ position: "relative" }}>
            <TBtn title="Text color" onClick={() => setColorPicker(p => !p)}>
              <FormatColorTextIcon sx={{ fontSize: 16 }} />
            </TBtn>
            {colorPicker && (
              <Box sx={{
                position: "absolute", top: "110%", left: 0, zIndex: 999,
                background: "rgba(24,16,52,0.97)", backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.18)", borderRadius: 2,
                p: 1.2, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0.7,
                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
              }}>
                {TEXT_COLORS.map(col => (
                  <Box key={col} onClick={() => applyColor(col)} sx={{
                    width: 20, height: 20, borderRadius: "50%", background: col, cursor: "pointer",
                    border: "2px solid rgba(255,255,255,0.25)",
                    "&:hover": { transform: "scale(1.3)", border: "2px solid #fff" },
                    transition: "all 0.13s",
                  }} />
                ))}
              </Box>
            )}
          </Box>

          <Divider />

          {/* Image button */}
          <TBtn title="Insert image" onClick={() => fileRef.current?.click()}>
            <ImageIcon sx={{ fontSize: 16 }} />
          </TBtn>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onImage} />
        </Box>

        {/* ── Rich text editor area ── */}
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-ph="Start writing your note here..."
          sx={{
            minHeight: 150, maxHeight: 240, overflowY: "auto",
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: 2.5, p: 2,
            color: "#fff", fontSize: `${fontSize}px`, lineHeight: 1.75,
            fontFamily: fontFamily === "Default" ? "inherit" : fontFamily,
            outline: "none", wordBreak: "break-word",
            "&:empty::before": {
              content: "attr(data-ph)",
              color: "rgba(255,255,255,0.28)",
              pointerEvents: "none",
            },
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": { borderRadius: 4, background: "rgba(255,255,255,0.18)" },
          }}
        />

        {/* Image preview */}
        {draft.image && (
          <Box sx={{ mt: 1.5, position: "relative", display: "inline-block" }}>
            <Box component="img" src={draft.image} alt="attached"
              sx={{ maxWidth: "100%", maxHeight: 170, borderRadius: 2, border: "1px solid rgba(255,255,255,0.18)" }}
            />
            <IconButton size="small" onClick={() => setDraft(d => ({ ...d, image: null }))}
              sx={{
                position: "absolute", top: 5, right: 5,
                background: "rgba(0,0,0,0.55)", color: "#fff", p: 0.3,
                "&:hover": { background: "rgba(220,50,50,0.8)" },
              }}>
              <CloseIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Box>
        )}

        {/* Save button */}
        <Button fullWidth onClick={saveNote} startIcon={<SaveIcon />} sx={{
          mt: 2, py: 1.3, borderRadius: 3, fontWeight: 700,
          textTransform: "none", fontSize: "0.95rem",
          background: "linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.65))",
          color: "#5a3d8a",
          "&:hover": { background: "#fff", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" },
          transition: "all 0.25s",
        }}>
          {draft.id ? "Update Note ✅" : "Save Note 💾"}
        </Button>
      </Box>
    );
  }

  /* ══════════ LIST VIEW ══════════ */
  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <StickyNote2Icon sx={{ color: "#ffc850", fontSize: 24 }} />
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            My Notes
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip label={`${notes.length} note${notes.length !== 1 ? "s" : ""}`} size="small"
            sx={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, border: "1px solid rgba(255,255,255,0.25)" }}
          />
          <Tooltip title="Add new note">
            <IconButton onClick={openNew} sx={{
              color: "#ffc850", background: "rgba(255,200,80,0.15)",
              border: "1px solid rgba(255,200,80,0.3)",
              "&:hover": { background: "rgba(255,200,80,0.28)", transform: "scale(1.1) rotate(90deg)" },
              transition: "all 0.25s",
            }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Empty state */}
      {notes.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography sx={{ fontSize: "3rem" }}>📝</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}>No notes yet.</Typography>
          <Button onClick={openNew} sx={{
            mt: 2, color: "#ffc850", border: "1px solid rgba(255,200,80,0.35)",
            borderRadius: 3, textTransform: "none", fontWeight: 700,
            "&:hover": { background: "rgba(255,200,80,0.1)" },
          }}>
            + Create your first note
          </Button>
        </Box>
      )}

      {/* Notes grid */}
      <Box sx={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5,
        maxHeight: 440, overflowY: "auto", pr: 0.5,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": { borderRadius: 4, background: "rgba(255,255,255,0.18)" },
      }}>
        {notes.map(note => {
          const c   = NOTE_COLORS[note.colorIdx ?? 0];
          const isD = deletingId === note.id;

          return (
            <Box key={note.id} sx={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 3, p: 1.8, position: "relative",
              backdropFilter: "blur(10px)",
              animation: isD
                ? "nOut 0.42s forwards"
                : "nIn 0.38s cubic-bezier(0.175,0.885,0.32,1.275)",
              "@keyframes nIn":  { "0%": { opacity: 0, transform: "scale(0.72) rotate(-4deg)" }, "100%": { opacity: 1, transform: "scale(1)" } },
              "@keyframes nOut": { "0%": { opacity: 1, transform: "scale(1)" }, "100%": { opacity: 0, transform: "scale(0.5) rotate(8deg)" } },
              "&:hover": { boxShadow: `0 8px 24px ${c.dot}44`, transform: "translateY(-2px)" },
              "&:hover .na": { opacity: 1 },
              transition: "box-shadow 0.2s, transform 0.2s",
            }}>
              {/* Color dot */}
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, mb: 1, boxShadow: `0 0 6px ${c.dot}88` }} />

              {/* Heading */}
              {note.heading && (
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.87rem", mb: 0.5, lineHeight: 1.3, wordBreak: "break-word" }}>
                  {note.heading}
                </Typography>
              )}

              {/* Body preview — strip HTML tags */}
              <Typography sx={{
                color: "rgba(255,255,255,0.68)", fontSize: "0.76rem", lineHeight: 1.5,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
              }}>
                {note.html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}
              </Typography>

              {/* Image thumbnail */}
              {note.image && (
                <Box component="img" src={note.image} alt=""
                  sx={{ width: "100%", height: 56, objectFit: "cover", borderRadius: 1.5, mt: 1, opacity: 0.88 }}
                />
              )}

              <Typography sx={{ color: "rgba(255,255,255,0.28)", fontSize: "0.63rem", mt: 0.8 }}>
                {note.createdAt}
              </Typography>

              {/* Hover actions */}
              <Box className="na" sx={{
                position: "absolute", top: 7, right: 7,
                display: "flex", gap: 0.3, opacity: 0, transition: "opacity 0.18s",
              }}>
                <IconButton size="small"
                  onClick={e => { e.stopPropagation(); openEdit(note); }}
                  sx={{ p: 0.32, background: "rgba(0,0,0,0.28)", color: "rgba(255,255,255,0.72)",
                    "&:hover": { color: "#fff", background: "rgba(0,0,0,0.48)" } }}>
                  <EditIcon sx={{ fontSize: 12 }} />
                </IconButton>
                <IconButton size="small"
                  onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                  sx={{ p: 0.32, background: "rgba(0,0,0,0.28)", color: "rgba(255,100,100,0.7)",
                    "&:hover": { color: "#ff6b6b", background: "rgba(0,0,0,0.48)" } }}>
                  <DeleteIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/* ── Shared styles ────────────────────────────────────── */
function Divider() {
  return <Box sx={{ width: "1px", height: 20, background: "rgba(255,255,255,0.13)", mx: 0.4 }} />;
}

const selectSx = (minW) => ({
  color: "rgba(255,255,255,0.8)", fontSize: "0.72rem", minWidth: minW,
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.45)", fontSize: 15 },
  "& .MuiSelect-select": { py: 0.25, px: 0.5 },
});

const menuSx = { background: "#1e1440", color: "#fff" };

export default Notespad;