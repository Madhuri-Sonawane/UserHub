# ✨ User Hub

A beautifully designed productivity web app built with **React** and **Material UI**, featuring a glassmorphism UI, animated interactions, live weather, a rich notes editor, a to-do manager, and a customizable background theme system.

---

## 📸 Features at a Glance

| Feature | Description |
|---|---|
| 🔐 Login Page | Animated, gender-neutral flirty headlines with floating emoji background |
| 🏠 Dashboard | Live clock, greeting, motivational quote, and quick navigation cards |
| 📋 To-Do List | Add, complete, and delete tasks with priority levels and progress bar |
| 📝 Rich Notes | Full note editor with heading, bold/italic/underline, font, size, color, and image upload |
| 🌤️ Weather & Vibes | Live weather for Pimpri + rotating motivational quotes |
| 🎨 Background Themes | 8 gradient themes selectable via a circular color palette picker |
| 🎉 Animated Emojis | Emoji burst animations triggered on login, add task, complete task, and delete |

---

## 🗂️ Project Structure

```
react-crud-app/
├── public/
├── src/
│   ├── api/
│   │   └── userApi.js              # Axios API calls (get, create, update, delete)
│   ├── components/
│   │   ├── AnimatedEmoji.jsx       # Emoji burst animations for events
│   │   ├── Dashboard.jsx           # Home screen with stats, clock, quick nav
│   │   ├── LoginPage.jsx           # Login screen with flirty headlines
│   │   ├── Navbar.jsx              # Navigation bar + circular BG palette picker
│   │   ├── Notespad.jsx            # Rich text notes with editor
│   │   ├── TodoList.jsx            # To-do list with priorities and filters
│   │   ├── UserForm.jsx            # Add / edit user form (glass styled)
│   │   ├── UserList.jsx            # User list with edit and delete
│   │   └── WeatherQuote.jsx        # Live weather widget + motivational quotes
│   ├── config/
│   │   ├── countryConfig.js        # Country codes list
│   │   └── userFormConfig.js       # Dynamic form field config
│   ├── server/
│   │   └── db.json                 # JSON Server database
│   ├── App.jsx                     # Root component, routing, theme state
│   ├── App.css                     # Global styles (shake animation, scrollbar)
│   └── main.jsx                    # React entry point
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or higher
- npm v8 or higher

### 1. Clone the repository

```bash
git clone https://github.com/your-username/react-crud-app.git
cd react-crud-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the JSON Server (backend)

The app uses [json-server](https://github.com/typicode/json-server) as a mock REST backend.

```bash
cd src/server
npx json-server --watch db.json --port 3001
```

Or if you are using the hosted backend:

```
https://react-crud-json-server-ljgs.onrender.com/users
```

> The API base URL is set in `src/api/userApi.js`. Update it if needed.

### 4. Start the React app

In a new terminal from the project root:

```bash
npm run dev
```

The app will open at `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Material UI v5](https://mui.com/) | Component library and styling |
| [Axios](https://axios-http.com/) | HTTP requests to the backend |
| [JSON Server](https://github.com/typicode/json-server) | Mock REST API |
| [OpenWeatherMap API](https://openweathermap.org/) | Live weather data |
| CSS `execCommand` | Rich text formatting in the notes editor |

---

## 🔐 Login

The login page accepts **any email and password** — it is a demo login with no real authentication. On submit it triggers a celebration emoji animation and transitions to the main app.

Each time you visit, the login headline is randomly chosen from 10 **warm, gender-neutral** messages across three vibes:

- **Warm & appreciative** — *"You are absolutely incredible ✨ Ready to do something amazing today?"*
- **Confident & hyping** — *"Welcome, superstar 🌟 The world runs better when you're in it!"*
- **Playful & fun** — *"Look who showed up! 🎉 You just made this whole app 10x more exciting!"*

You can also change the background theme from the login screen using the 🎨 palette button in the top-right corner.

---

## 🏠 Dashboard

The home screen after login shows:

- A **live clock** with seconds ticking in real time
- A **contextual greeting** — Good Morning / Good Afternoon / Good Evening based on your local time
- A random **motivational message** that changes on each login
- **4 quick-access cards** — click any to jump directly to that section (To-Do, Notes, Vibes)

---

## 📋 To-Do List

- Add tasks with a text field and press **Enter** or click **+**
- Set **priority** — 🔴 High, 🟡 Medium, 🟢 Low
- **Check off** a task to mark it done — triggers a celebration 🎉 emoji burst
- **Delete** a task — triggers a goodbye 😢 emoji burst
- Filter tasks by **All / Active / Done**
- A **progress bar** at the top shows how many tasks are completed
- Tasks animate in on add and slide out on delete

---

## 📝 Notes (Rich Editor)

Click **+** to open the note editor:

| Control | What it does |
|---|---|
| **Heading field** | Large text input at the top — saves as bold heading on the card |
| **Color picker** | Circular palette with 12 cool tones — hover to preview, click to apply |
| **Bold / Italic / Underline** | Toolbar buttons for formatting selected text |
| **Font family** | Dropdown — Default, Georgia, Arial, Courier New, Verdana, Times New Roman |
| **Font size** | Dropdown — 12px to 40px, applied to selected text |
| **Text color** | Grid of 12 soft colors, pops open inline |
| **Image upload** | Attach a picture to your note, shown as a preview with a remove button |
| **Save / Update** | Full-width button at the bottom of the editor |

Notes display as a **2-column grid** of cards. Each card shows:
- A colored dot matching the chosen note color
- **Heading** in bold
- **Body preview** (plain text, 3 lines max)
- **Image thumbnail** if attached
- Created date
- Hover to reveal **Edit** and **Delete** buttons

---

## 🌤️ Weather & Vibes

- Fetches **live weather** for Pimpri, Maharashtra using the OpenWeatherMap API
- Displays temperature, feels like, humidity, and wind speed
- Shows a **contextual tip** based on the weather condition
  - e.g. *"Rain = perfect coding weather 🌧️"*
- A **live clock** and date greeting adapt to the time of day
- **Quote of the Moment** — 12 rotating motivational quotes with a refresh button

> To change the weather location, update `LAT` and `LON` constants in `WeatherQuote.jsx`.

---

## 🎨 Background Themes

Click the 🎨 palette icon in the navbar to open the **circular theme picker**:

- **8 gradient themes** arranged as dots in a circle
- **Hover** any dot — the center disc and preview strip update live
- **Theme name** appears below the circle
- **Click** to apply instantly — the full app background transitions smoothly

### Available Themes

| Theme | Description |
|---|---|
| Ocean Breeze | Soft indigo to purple |
| Slate Dusk | Cool slate blue to dark gray |
| Deep Ocean | Deep navy to steel blue |
| Sage & Stone | Dark forest green to olive |
| Cherry Blossom | Warm pink to golden yellow |
| Midnight | Deep dark purple, almost black |
| Warm Charcoal | Dark charcoal to warm brown |
| Aurora | Soft lavender to blush pink |

---

## 🎉 Animated Emojis

Emoji bursts appear as full-screen overlay animations triggered by key actions:

| Event | Emojis | Message |
|---|---|---|
| Login | 😍 🎉 ✨ 💖 🌟 | *"Welcome back, gorgeous! 💋"* |
| Add To-Do | 😊 ✅ 💪 🙌 🎯 | *"New task added! Let's crush it! 💪"* |
| Complete To-Do | 🎉 🏆 🥳 🎊 ⭐ | *"YESSS! Task conquered! 🏆"* |
| Delete To-Do | 😭 💔 😢 👋 🌧️ | *"See you soon... or not 😢"* |

---

## ⚙️ Configuration

### Change Weather Location

In `src/components/WeatherQuote.jsx`:

```js
const LAT = 18.6279;  // Your latitude
const LON = 73.8009;  // Your longitude
```

### Change API Backend URL

In `src/api/userApi.js`:

```js
const API_URL = "https://your-backend-url/users";
```

### Add More Background Themes

In `src/App.jsx`, add to the `BACKGROUNDS` array:

```js
{ name: "My Theme", value: "linear-gradient(135deg, #color1 0%, #color2 100%)" },
```

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

---

## 🙌 Acknowledgements

- [Material UI](https://mui.com/) for the component system
- [OpenWeatherMap](https://openweathermap.org/) for free weather data
- [JSON Server](https://github.com/typicode/json-server) for the mock backend
- [Render](https://render.com/) for hosting the backend

---

> Built with 💜 using React + MUI — designed to be beautiful, fun, and actually useful.
