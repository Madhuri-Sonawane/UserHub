import { useState } from "react";
import {
  Box, Typography, TextField, IconButton, Checkbox,
  Chip, Select, MenuItem, FormControl, InputLabel, Tooltip,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

const PRIORITY_CONFIG = {
  high:   { color: "#ff6b6b", bg: "rgba(255,107,107,0.15)", label: "🔴 High" },
  medium: { color: "#ffd93d", bg: "rgba(255,217,61,0.15)",  label: "🟡 Medium" },
  low:    { color: "#6bcb77", bg: "rgba(107,203,119,0.15)", label: "🟢 Low" },
};

function TodoList({ onEmojiTrigger }) {
  const [todos, setTodos] = useState([
    { id: 1, text: "Build an awesome CRUD app 🚀", done: false, priority: "high" },
    { id: 2, text: "Add cool animations ✨", done: true, priority: "medium" },
    { id: 3, text: "Impress everyone 😎", done: false, priority: "low" },
  ]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [celebratingId, setCelebratingId] = useState(null);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: Date.now(), text: trimmed, done: false, priority },
      ...prev,
    ]);
    setInput("");
    onEmojiTrigger("add-todo");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (!t.done) {
            // marking done -> celebrate
            setCelebratingId(id);
            setTimeout(() => setCelebratingId(null), 1500);
            onEmojiTrigger("done-todo");
          }
          return { ...t, done: !t.done };
        }
        return t;
      })
    );
  };

  const deleteTodo = (id) => {
    setDeletingId(id);
    onEmojiTrigger("delete-todo");
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setDeletingId(null);
    }, 500);
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 800, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
        >
          📋 My To-Do List
        </Typography>
        <Chip
          label={`${doneCount}/${todos.length} done`}
          size="small"
          sx={{
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        />
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 2.5, borderRadius: 99, overflow: "hidden", background: "rgba(255,255,255,0.15)", height: 8 }}>
        <Box
          sx={{
            height: "100%",
            width: `${todos.length ? (doneCount / todos.length) * 100 : 0}%`,
            background: "linear-gradient(90deg, #43e97b, #38f9d7)",
            borderRadius: 99,
            transition: "width 0.5s ease",
            boxShadow: "0 0 8px #43e97b88",
          }}
        />
      </Box>

      {/* Add Todo Row */}
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="What needs to be done? ✏️"
          size="small"
          sx={{ flex: 1, minWidth: 180, ...glassInputSx }}
        />
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            sx={{
              color: "#fff",
              background: "rgba(255,255,255,0.1)",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
              "& .MuiSvgIcon-root": { color: "#fff" },
              borderRadius: 2,
            }}
          >
            {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
              <MenuItem key={key} value={key}>{val.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Add Todo">
          <IconButton
            onClick={addTodo}
            sx={{
              color: "#43e97b",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              "&:hover": { background: "rgba(67,233,123,0.2)", transform: "scale(1.15)" },
              transition: "all 0.2s",
            }}
          >
            <AddCircleIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filter */}
      <Box display="flex" gap={1} mb={2} alignItems="center">
        <FilterListIcon sx={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }} />
        {["all", "active", "done"].map((f) => (
          <Chip
            key={f}
            label={f === "all" ? "All" : f === "active" ? "Active" : "Done ✅"}
            size="small"
            onClick={() => setFilter(f)}
            sx={{
              cursor: "pointer",
              background: filter === f ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)",
              color: "#fff",
              fontWeight: filter === f ? 700 : 400,
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.2s",
              "&:hover": { background: "rgba(255,255,255,0.25)" },
            }}
          />
        ))}
      </Box>

      {/* Todo Items */}
      <Box sx={{ maxHeight: 360, overflowY: "auto", pr: 0.5,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": { borderRadius: 4, background: "rgba(255,255,255,0.2)" },
      }}>
        {filtered.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography sx={{ fontSize: "3rem" }}>🌸</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", mt: 1 }}>
              {filter === "done" ? "No completed tasks yet!" : "Nothing here... add something! 🎉"}
            </Typography>
          </Box>
        )}

        {filtered.map((todo) => {
          const pc = PRIORITY_CONFIG[todo.priority];
          const isDeleting = deletingId === todo.id;
          const isCelebrating = celebratingId === todo.id;

          return (
            <Box
              key={todo.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.2,
                p: 1.5,
                borderRadius: 3,
                background: todo.done
                  ? "rgba(67,233,123,0.12)"
                  : "rgba(255,255,255,0.1)",
                border: `1px solid ${todo.done ? "rgba(67,233,123,0.3)" : "rgba(255,255,255,0.15)"}`,
                backdropFilter: "blur(10px)",
                transition: "all 0.35s ease",
                animation: isDeleting
                  ? "fadeOutSlide 0.5s forwards"
                  : isCelebrating
                  ? "celebrateBounce 0.6s ease"
                  : "fadeInSlide 0.4s ease",
                "@keyframes fadeInSlide": {
                  "0%": { opacity: 0, transform: "translateX(-20px)" },
                  "100%": { opacity: 1, transform: "translateX(0)" },
                },
                "@keyframes fadeOutSlide": {
                  "0%": { opacity: 1, transform: "translateX(0) scale(1)" },
                  "100%": { opacity: 0, transform: "translateX(80px) scale(0.8)" },
                },
                "@keyframes celebrateBounce": {
                  "0%":   { transform: "scale(1)" },
                  "30%":  { transform: "scale(1.08) rotate(1deg)" },
                  "60%":  { transform: "scale(1.04) rotate(-1deg)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            >
              {/* Priority dot */}
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: pc.color,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${pc.color}88`,
                }}
              />

              <Checkbox
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  p: 0.5,
                  "&.Mui-checked": { color: "#43e97b" },
                }}
              />

              <Typography
                sx={{
                  flex: 1,
                  color: todo.done ? "rgba(255,255,255,0.4)" : "#fff",
                  textDecoration: todo.done ? "line-through" : "none",
                  fontSize: "0.9rem",
                  transition: "all 0.3s",
                  wordBreak: "break-word",
                }}
              >
                {todo.text}
                {todo.done && " ✅"}
              </Typography>

              <Chip
                label={pc.label.split(" ")[0]}
                size="small"
                sx={{
                  background: pc.bg,
                  color: pc.color,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
                  border: `1px solid ${pc.color}44`,
                }}
              />

              <Tooltip title="Delete (See you soon 👋)">
                <IconButton
                  size="small"
                  onClick={() => deleteTodo(todo.id)}
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    p: 0.5,
                    "&:hover": { color: "#ff6b6b", transform: "scale(1.2)" },
                    transition: "all 0.2s",
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {/* Footer stats */}
      {todos.length > 0 && (
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
          gap={2}
        >
          {Object.entries(PRIORITY_CONFIG).map(([key, val]) => {
            const count = todos.filter((t) => t.priority === key).length;
            return (
              <Typography key={key} sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
                {val.label.split(" ")[0]} {count}
              </Typography>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

const glassInputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    background: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.9)" },
  },
  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.5)", opacity: 1 },
};

export default TodoList;