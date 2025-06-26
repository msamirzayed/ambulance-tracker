# 🚑 Ambulance Tracker

A simple, animated ambulance tracker showing movement from a hospital to an accident site using Angular and Leaflet.js. Includes a visual stepper and progress bar.

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── core/                     # Services, constants, core utilities
│   │   └── services/
│   │       └── simulation.service.ts
│   ├── shared/                   # Shared UI components
│   │   └── components/
│   │       ├── stepper/
│   │       └── progress-bar/
│   └── features/
│       └── map/
│           └── map.component.ts


---


## 📦 Prerequisites
| Tool | Version (tested) | Install |
|------|-----------------|---------|
| **Node.js** | ≥ 18 LTS   | <https://nodejs.org/> |

---

## 🚀 Quick-Start


# 1 Clone
git clone https://github.com/msamirzayed/ambulance-tracker
cd ambulance-tracker

# 2 Install deps
npm install

# 3 Run dev server
ng serve    # → http://localhost:4200


## 📚 Generate API Docs
npx typedoc      # uses typedoc.json
# output: docs/index.html

---

## 💡 Features
🚨 Animated Leaflet Map (static route)

✅ Material Stepper with progress feedback

🎯 Fully standalone – no backend

🔄 Restart animation logic

💯 Designed using Angular Standalone Components