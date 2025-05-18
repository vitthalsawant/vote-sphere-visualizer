# 🗳️ Vote Sphere Visualizer

A modern, interactive poll visualization app built with React, TypeScript, Vite, Supabase, and 3D pie chart visualizations using Three.js.

---

## ✨ Features

- 📝 **Create and manage polls** with multiple options
- 🗳️ **Vote** on polls (authentication required)
- 🔄 **Real-time updates** using Supabase subscriptions
- 🥧 **3D Pie Chart Visualization** for poll results, with vibrant, distinct colors
- 📱 **Responsive UI** with Tailwind CSS and shadcn-ui components
- 🔗 **Shareable poll links** for easy distribution

---

## 🗂️ Project Structure

```
vote-sphere-visualizer/
├── public/                # 📁 Static assets (favicon, robots.txt, etc.)
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/                   # 💻 Main source code
│   ├── components/        # 🧩 Reusable UI components (PieChartVisualization, etc.)
│   ├── context/           # 🌐 React context (e.g., AuthContext)
│   ├── hooks/             # 🪝 Custom React hooks
│   ├── integrations/      # 🔌 Supabase client setup
│   ├── lib/               # 🛠️ Utility libraries
│   ├── pages/             # 📄 Page components (Landing, Dashboard, ViewPoll, etc.)
│   ├── types/             # 🏷️ TypeScript type definitions
│   ├── App.tsx            # 🚀 Main app component
│   ├── App.css            # 🎨 App-level styles
│   ├── index.css          # 🎨 Global styles (Tailwind)
│   └── main.tsx           # 🏁 App entry point
├── supabase/              # 🗄️ Supabase configuration
│   └── config.toml
├── index.html             # 📝 Main HTML template
├── tsconfig.json          # ⚙️ TypeScript config
├── tsconfig.node.json     # ⚙️ Node-specific TypeScript config
└── README.md              # 📘 Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- 🟢 **Node.js** (v16+ recommended)
- 📦 **npm** (v8+ recommended)
- 🟣 **Supabase** project (for backend)

### ⚡ Installation

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd vote-sphere-visualizer
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Supabase:**
   - 🔑 Update your Supabase credentials in the integration files under `src/integrations/supabase/`.

4. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) (or as indicated in your terminal).

---

## 🧑‍💻 Usage

- ➕ **Create a poll:** Go to the dashboard and click "Create Poll".
- 🗳️ **Vote:** Select an option and submit your vote (sign in required).
- 🥧 **View results:** After voting, see a 3D pie chart with real-time updates.
- 🔗 **Share:** Use the "Share Poll" button to copy the poll link.

---

## 🛠️ Technologies Used

- ⚛️ **React** & **TypeScript**
- ⚡ **Vite** (for fast development)
- 🟣 **Supabase** (database, auth, real-time)
- 🧩 **Three.js** (`@react-three/fiber`, `@react-three/drei`) for 3D charts
- 🎨 **Tailwind CSS** & **shadcn-ui** for styling

---

## 🎨 Customization

- **Colors:** Pie chart colors can be customized in `src/components/PieChartVisualization.tsx` via the `COLORS` array.
- **Styling:** Modify `index.css` or `App.css` for global styles.

---

## 🚢 Deployment

You can deploy this app using any static hosting provider (Vercel, Netlify, etc.) or via [Lovable](https://lovable.dev/).

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🙏 Credits

- Built with [Lovable](https://lovable.dev/)
- 3D visualization powered by [Three.js](https://threejs.org/) and [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- UI by [shadcn-ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)

---

**Happy polling! 🥳**
