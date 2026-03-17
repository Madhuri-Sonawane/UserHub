import { useState } from "react";
import { Box, Typography, TextField, IconButton, Checkbox, Select, MenuItem, Tooltip, LinearProgress } from "@mui/material";
import AddIcon    from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon   from "@mui/icons-material/Edit";
import CheckIcon  from "@mui/icons-material/Check";
import CloseIcon  from "@mui/icons-material/Close";
import FlagIcon   from "@mui/icons-material/Flag";

const P = {
  high:   { color: "#ef4444", label: "High",   rank: 0 },
  medium: { color: "#f59e0b", label: "Medium",  rank: 1 },
  low:    { color: "#22c55e", label: "Low",     rank: 2 },
};

const FILTERS = ["All", "Active", "Done"];
const SORTS   = ["Default", "Priority", "A → Z"];

function TodoList({ onEmojiTrigger }) {
  const [todos, setTodos] = useState([
    { id: 1, text: "Review project requirements",    done: false, priority: "high"   },
    { id: 2, text: "Set up development environment", done: true,  priority: "high"   },
    { id: 3, text: "Write unit tests",               done: false, priority: "medium" },
    { id: 4, text: "Update documentation",           done: false, priority: "low"    },
  ]);

  const [input,      setInput]      = useState("");
  const [priority,   setPriority]   = useState("medium");
  const [filter,     setFilter]     = useState("All");
  const [sort,       setSort]       = useState("Default");
  const [editId,     setEditId]     = useState(null);
  const [editText,   setEditText]   = useState("");
  const [deletingId, setDeletingId] = useState(null);

  /* ── actions ── */
  const add = () => {
    const t = input.trim();
    if (!t) return;
    setTodos(p => [{ id: Date.now(), text: t, done: false, priority }, ...p]);
    setInput("");
    onEmojiTrigger?.("add-todo");
  };

  const toggle = (id) => {
    setTodos(p => p.map(t => {
      if (t.id !== id) return t;
      if (!t.done) onEmojiTrigger?.("done-todo");
      return { ...t, done: !t.done };
    }));
  };

  const remove = (id) => {
    setDeletingId(id);
    onEmojiTrigger?.("delete-todo");
    setTimeout(() => { setTodos(p => p.filter(t => t.id !== id)); setDeletingId(null); }, 320);
  };

  const startEdit = (todo) => { setEditId(todo.id); setEditText(todo.text); };
  const saveEdit  = ()     => {
    if (!editText.trim()) return;
    setTodos(p => p.map(t => t.id === editId ? { ...t, text: editText.trim() } : t));
    setEditId(null);
  };
  const cancelEdit = () => setEditId(null);

  /* ── derived ── */
  const done  = todos.filter(t => t.done).length;
  const pct   = todos.length ? Math.round((done / todos.length) * 100) : 0;

  const visible = (() => {
    let arr = todos.filter(t =>
      filter === "Active" ? !t.done : filter === "Done" ? t.done : true
    );
    if (sort === "Priority") arr = [...arr].sort((a,b) => P[a.priority].rank - P[b.priority].rank);
    if (sort === "A → Z")    arr = [...arr].sort((a,b) => a.text.localeCompare(b.text));
    return arr;
  })();

  /* ── stat breakdown ── */
  const stats = Object.entries(P).map(([k,v]) => ({
    label: v.label, color: v.color,
    total: todos.filter(t => t.priority === k).length,
    done:  todos.filter(t => t.priority === k && t.done).length,
  }));

  return (
    <Box sx={{ animation: "tIn 0.3s ease", "@keyframes tIn": { "0%": { opacity:0, transform:"translateY(10px)" }, "100%": { opacity:1, transform:"translateY(0)" } } }}>

      {/* ══ HEADER ══ */}
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2.5}>
        <Box>
          <Typography sx={{ color:"#fff", fontWeight:700, fontSize:"1.05rem", letterSpacing:"-0.2px" }}>
            Task Board
          </Typography>
          <Typography sx={{ color:"rgba(255,255,255,0.35)", fontSize:"0.73rem", mt:0.3 }}>
            {done} of {todos.length} tasks complete · {pct}%
          </Typography>
        </Box>

        {/* Sort */}
        <Select value={sort} onChange={e => setSort(e.target.value)}
          variant="standard" disableUnderline size="small"
          sx={{
            color:"rgba(255,255,255,0.45)", fontSize:"0.72rem",
            "& .MuiSelect-icon":{ color:"rgba(255,255,255,0.3)", fontSize:15 },
            "& .MuiSelect-select":{ py:0 },
          }}
          MenuProps={{ PaperProps:{ sx:{ background:"#0d0b20", color:"#fff", fontSize:"0.8rem" } } }}
        >
          {SORTS.map(s => <MenuItem key={s} value={s} sx={{ fontSize:"0.78rem" }}>{s}</MenuItem>)}
        </Select>
      </Box>

      {/* ══ PROGRESS ══ */}
      <Box mb={2.5}>
        <Box sx={{ height:2, borderRadius:99, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
          <Box sx={{
            height:"100%", width:`${pct}%`, borderRadius:99,
            background: pct === 100 ? "#22c55e" : "rgba(255,255,255,0.55)",
            transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}/>
        </Box>
        {/* Priority breakdown bars */}
        <Box display="flex" gap={1.5} mt={1.5}>
          {stats.map(s => s.total > 0 && (
            <Box key={s.label} flex={1}>
              <Box display="flex" justifyContent="space-between" mb={0.4}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ width:5, height:5, borderRadius:"50%", background:s.color }}/>
                  <Typography sx={{ color:"rgba(255,255,255,0.35)", fontSize:"0.62rem", letterSpacing:"0.04em" }}>
                    {s.label.toUpperCase()}
                  </Typography>
                </Box>
                <Typography sx={{ color:"rgba(255,255,255,0.3)", fontSize:"0.62rem" }}>
                  {s.done}/{s.total}
                </Typography>
              </Box>
              <Box sx={{ height:2, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                <Box sx={{
                  height:"100%", borderRadius:99,
                  width: s.total ? `${(s.done/s.total)*100}%` : "0%",
                  background: s.color, opacity:0.7,
                  transition:"width 0.4s ease",
                }}/>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ══ ADD ROW ══ */}
      <Box sx={{
        display:"flex", alignItems:"center", gap:0.8, mb:2.5,
        background:"rgba(255,255,255,0.04)",
        border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:1.5, px:1.5, py:0.9,
        "&:focus-within":{ borderColor:"rgba(255,255,255,0.22)" },
        transition:"border-color 0.18s",
      }}>
        <TextField value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Add a task..."
          variant="standard" fullWidth size="small"
          InputProps={{ disableUnderline:true }}
          sx={{
            "& .MuiInputBase-root":{ color:"#fff", fontSize:"0.85rem" },
            "& input::placeholder":{ color:"rgba(255,255,255,0.25)", opacity:1 },
          }}
        />

        {/* Priority dot selector */}
        <Box display="flex" gap={0.5} flexShrink={0}>
          {Object.entries(P).map(([k,v]) => (
            <Tooltip key={k} title={v.label}>
              <Box onClick={() => setPriority(k)} sx={{
                width:8, height:8, borderRadius:"50%", cursor:"pointer",
                background: priority === k ? v.color : "rgba(255,255,255,0.15)",
                border: priority === k ? `1.5px solid ${v.color}` : "1.5px solid transparent",
                boxShadow: priority === k ? `0 0 6px ${v.color}88` : "none",
                transition:"all 0.15s",
              }}/>
            </Tooltip>
          ))}
        </Box>

        <Tooltip title="Add task  (Enter)">
          <IconButton onClick={add} size="small" sx={{
            color:"rgba(255,255,255,0.5)", p:0.4, flexShrink:0,
            "&:hover":{ color:"#fff", background:"rgba(255,255,255,0.08)" },
            transition:"all 0.15s",
          }}>
            <AddIcon sx={{ fontSize:17 }}/>
          </IconButton>
        </Tooltip>
      </Box>

      {/* ══ FILTER TABS ══ */}
      <Box display="flex" gap={0} mb={2}
        sx={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        {FILTERS.map(f => (
          <Box key={f} onClick={() => setFilter(f)} sx={{
            pb:1, px:0.5, mr:2.5, cursor:"pointer",
            fontSize:"0.75rem", fontWeight: filter===f ? 600 : 400,
            color: filter===f ? "#fff" : "rgba(255,255,255,0.35)",
            borderBottom: filter===f ? "1.5px solid rgba(255,255,255,0.7)" : "1.5px solid transparent",
            transition:"all 0.16s",
            "&:hover":{ color:"rgba(255,255,255,0.7)" },
          }}>
            {f}
            <Box component="span" sx={{
              ml:0.8, fontSize:"0.6rem",
              color:"rgba(255,255,255,0.28)",
              background:"rgba(255,255,255,0.07)",
              px:0.6, py:0.1, borderRadius:1,
            }}>
              {f==="All" ? todos.length : f==="Active" ? todos.filter(t=>!t.done).length : todos.filter(t=>t.done).length}
            </Box>
          </Box>
        ))}
      </Box>

      {/* ══ TASK LIST ══ */}
      <Box sx={{
        maxHeight:320, overflowY:"auto", pr:0.5,
        "&::-webkit-scrollbar":{ width:2 },
        "&::-webkit-scrollbar-thumb":{ borderRadius:99, background:"rgba(255,255,255,0.1)" },
      }}>
        {visible.length === 0 && (
          <Box textAlign="center" py={5}>
            <Typography sx={{ color:"rgba(255,255,255,0.18)", fontSize:"0.8rem" }}>
              {filter === "Done" ? "No completed tasks" : "No tasks yet — add one above"}
            </Typography>
          </Box>
        )}

        {visible.map((todo, idx) => {
          const p  = P[todo.priority];
          const isDeleting = deletingId === todo.id;
          const isEditing  = editId     === todo.id;

          return (
            <Box key={todo.id} sx={{
              display:"flex", alignItems:"center", gap:1.2,
              px:1.5, py:1,
              mb:0.5, borderRadius:1.5,
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.07)",
              animation: isDeleting ? "tOut 0.32s ease forwards" : "tRow 0.25s ease",
              "@keyframes tRow":{ "0%":{ opacity:0, transform:"translateY(-4px)" }, "100%":{ opacity:1, transform:"translateY(0)" } },
              "@keyframes tOut":{ "0%":{ opacity:1, transform:"scale(1)" }, "100%":{ opacity:0, transform:"scale(0.97)" } },
              "&:hover":{ background:"rgba(255,255,255,0.07)", "& .task-actions":{ opacity:1 } },
              transition:"background 0.15s",
            }}>

              {/* Priority bar */}
              <Box sx={{
                width:2.5, height:28, borderRadius:99, flexShrink:0,
                background: todo.done ? "rgba(255,255,255,0.1)" : p.color,
                opacity: todo.done ? 0.4 : 0.85,
                transition:"background 0.25s",
              }}/>

              {/* Checkbox */}
              <Checkbox checked={todo.done} onChange={() => toggle(todo.id)} size="small"
                sx={{
                  p:0, color:"rgba(255,255,255,0.15)",
                  "&.Mui-checked":{ color:"rgba(255,255,255,0.45)" },
                  "& .MuiSvgIcon-root":{ fontSize:16 },
                }}
              />

              {/* Text / Edit */}
              {isEditing ? (
                <TextField value={editText} onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter") saveEdit(); if(e.key==="Escape") cancelEdit(); }}
                  autoFocus variant="standard" fullWidth size="small"
                  InputProps={{ disableUnderline:true }}
                  sx={{
                    flex:1,
                    "& .MuiInputBase-root":{ color:"#fff", fontSize:"0.85rem" },
                    "& input":{ borderBottom:"1px solid rgba(255,255,255,0.25)", pb:0.2 },
                  }}
                />
              ) : (
                <Typography sx={{
                  flex:1, fontSize:"0.85rem", lineHeight:1.4,
                  color: todo.done ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)",
                  textDecoration: todo.done ? "line-through" : "none",
                  fontWeight: todo.done ? 400 : 500,
                  transition:"all 0.2s",
                  wordBreak:"break-word",
                }}>
                  {todo.text}
                </Typography>
              )}

              {/* Priority label — small */}
              {!todo.done && !isEditing && (
                <Box sx={{
                  fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.06em",
                  color: p.color, opacity:0.7, flexShrink:0,
                  textTransform:"uppercase",
                }}>
                  {p.label[0]}
                </Box>
              )}

              {/* Actions */}
              <Box className="task-actions" sx={{
                display:"flex", gap:0.3, opacity:0, transition:"opacity 0.15s", flexShrink:0,
              }}>
                {isEditing ? (
                  <>
                    <IconButton size="small" onClick={saveEdit}
                      sx={{ p:0.3, color:"rgba(255,255,255,0.5)", "&:hover":{ color:"#22c55e" } }}>
                      <CheckIcon sx={{ fontSize:13 }}/>
                    </IconButton>
                    <IconButton size="small" onClick={cancelEdit}
                      sx={{ p:0.3, color:"rgba(255,255,255,0.5)", "&:hover":{ color:"#f87171" } }}>
                      <CloseIcon sx={{ fontSize:13 }}/>
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton size="small" onClick={() => startEdit(todo)}
                      sx={{ p:0.3, color:"rgba(255,255,255,0.2)", "&:hover":{ color:"rgba(255,255,255,0.7)" } }}>
                      <EditIcon sx={{ fontSize:13 }}/>
                    </IconButton>
                    <IconButton size="small" onClick={() => remove(todo.id)}
                      sx={{ p:0.3, color:"rgba(255,255,255,0.2)", "&:hover":{ color:"#f87171" } }}>
                      <DeleteIcon sx={{ fontSize:13 }}/>
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ══ FOOTER ══ */}
      {todos.length > 0 && (
        <Box display="flex" justifyContent="space-between" alignItems="center"
          mt={2} pt={1.5}
          sx={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <Typography sx={{ color:"rgba(255,255,255,0.22)", fontSize:"0.68rem" }}>
            {todos.length - done} remaining
          </Typography>
          {pct === 100 && (
            <Typography sx={{ color:"#22c55e", fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.05em" }}>
              ALL DONE
            </Typography>
          )}
          <Typography sx={{ color:"rgba(255,255,255,0.22)", fontSize:"0.68rem" }}>
            {todos.length} total
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default TodoList;