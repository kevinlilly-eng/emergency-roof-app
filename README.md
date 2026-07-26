# Emergency Tarp & Roof Response Hub

24/7 On-Demand Emergency Roof Tarping, Leak Inspection, Storm Alert Center & Contractor Lead Marketplace.

## 🚀 Quick Start in VS Code

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system. Check in terminal with:
```bash
node -v
```

### 2. Install Dependencies
Open your terminal in VS Code (`Ctrl + ~` or `Cmd + ~`) and run:
```bash
npm install
```

### 3. Start Development Server
Run:
```bash
npm run dev
```

Look at the terminal output. It will display the address, typically:
👉 **`http://localhost:3000`**

---

## ❓ Localhost Not Working? Troubleshooting Checklist

1. **Did you run `npm install` first?**
   If packages aren't installed, Vite won't start. Run `npm install` in your VS Code terminal.

2. **Use `http://127.0.0.1:3000` instead of `localhost:3000`**
   On some Windows and Mac setups, `localhost` does not automatically route to IPv4 `127.0.0.1`. Type `http://127.0.0.1:3000` into your browser address bar.

3. **Check HTTP vs HTTPS**
   Make sure you are going to `http://` (NOT `https://`).

4. **Port 3000 already in use?**
   If port 3000 is occupied by another app, Vite will automatically switch to port 3001 or another available port. **Check the exact URL printed in your VS Code terminal.**

5. **Firewall / Antivirus Prompt**
   If Windows Defender or your OS prompts for network permissions, allow Node.js access on Private networks.

---

## 🛠️ Tech Stack & Features
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + **Lucide Icons** + **Motion**
- **Firebase Firestore Integration**

