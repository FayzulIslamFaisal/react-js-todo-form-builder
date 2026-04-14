# React Assessment – Todo List & Dynamic Form Builder

A React application built with **Vite + React 19**, **React Router v7**, and **Modular CSS**.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd react-js-project

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar/
│       ├── Navbar.jsx          # Sticky navigation with active links
│       └── Navbar.module.css
├── pages/
│   ├── Home/
│   │   ├── Home.jsx            # Landing page with feature cards
│   │   └── Home.module.css
│   ├── TodoList/
│   │   ├── TodoList.jsx        # Feature 1 – Todo list page
│   │   └── TodoList.module.css
│   ├── FormBuilder/
│   │   ├── FormBuilder.jsx     # Feature 2 – Form builder page
│   │   └── FormBuilder.module.css
│   └── FormPreview/
│       ├── FormPreview.jsx     # Feature 2 – Form preview & submit
│       └── FormPreview.module.css
├── store/
│   ├── useTodoStore.js         # Custom hook – Todo state + persistence
│   └── useFormStore.js         # Custom hook – Form schema + persistence
├── App.jsx                     # Root component with React Router
├── main.jsx                    # Entry point
└── index.css                   # Global design system (CSS variables)
```

---

## 🧠 Approach & Key Decisions

### Routing
Used **React Router v7** with the following routes:
| Path | Page |
|------|------|
| `/` | Home landing page |
| `/todos` | Todo List |
| `/form-builder` | Dynamic Form Builder |
| `/form-preview` | Form Preview & Submit |

---

### Feature 1 – Todo List

- **Data Fetching**: Parallel fetch of todos and users from `https://jsonplaceholder.typicode.com` using native `fetch` inside a `useEffect`. Requests are cleaned up (cancelled flag) on component unmount.
- **User Mapping**: Users are stored in state and a `getUserName(userId)` helper maps each todo's `userId` to the user's full name.
- **Filtering**: Three simultaneous filters – **User**, **Status** (Completed/Pending), and a **Search** box (title substring match). Filters are applied on the `filteredTodos` computed array.
- **Persistence** ⭐: Filter state (`selectedUser`, `selectedStatus`, `searchQuery`, `currentPage`) is stored in `localStorage` via the `useTodoStore` custom hook. It loads on mount and auto-saves on every change, so navigating away and back preserves the exact state.
- **Pagination**: Smart pagination component with ellipsis (`…`) for long page ranges. Page size is 12 todos per page.

---

### Feature 2 – Dynamic Form Builder

- **Schema Design**: Each field is an object `{ id, label, type, placeholder, required, options }`. The full schema array is serialized to `localStorage` under `form_builder_schema`.
- **Input Types Supported**: `text`, `email`, `number`, `password`, `textarea`, `select`, `radio`, `checkbox`, `date`, `file`.
- **Options**: For `select`, `radio`, and `checkbox` types the user enters comma-separated values that are parsed into individual options.
- **Field Operations**: Add, remove, and reorder (move up/down) fields. All changes are auto-saved immediately.
- **Form Preview** (`/form-preview`): Reads the schema from `localStorage` via the same `useFormStore` hook and renders each field dynamically using a `renderField(field, value, onChange)` switch-case function.
- **Submit**: On form submission, data is collected `{ [field.label]: value }` and printed to the browser **console** via `console.log`. A success banner also appears in-page showing all submitted values.

---

### State Management
Used **custom React hooks** (`useTodoStore`, `useFormStore`) as a lightweight state management approach — no external libraries needed. Each hook encapsulates:
- Local component state via `useState`
- Side effects via `useEffect`
- `localStorage` read/write for persistence

### Styling
- **Modular CSS** (`.module.css`) per component/page to avoid class name collisions.
- Global design tokens defined as **CSS custom properties** in `index.css`.
- Dark theme with a modern design system (Inter font, gradients, glassmorphism navbar, smooth transitions).
