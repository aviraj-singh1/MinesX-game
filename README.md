# **MinesX**

🎯 Overview

MinesX is an interactive, casino-style Mines game built as a web project using HTML, CSS, and JavaScript.
The game challenges players to uncover safe tiles while avoiding hidden mines, increasing their multiplier and cashing out at the right time.

This project focuses on game logic, UI/UX design, state management, and wallet simulation, inspired by modern online betting games.

---

- 🌐 Live Game: [MinesX]([https://minesx-game.vercel.app](https://minesx.vercel.app/))
- 💻 GitHub Repo: [MinesX-game](https://github.com/aviraj-singh1/MinesX-game)

---

✨ Key Features
🎮 Core Gameplay
- 5×5 Mines Grid with dynamically generated tiles
- Adjustable number of mines for difficulty control
- Real-time multiplier progression
- Strategic Cash Out option at any point
- Instant game-over on hitting a mine

💰 Wallet & Betting System
- Wallet starts at ₹0
- Dedicated Top-Up Wallet flow
- Multiple predefined top-up amounts
- Simulated UPI-style payment demo
- Wallet balance updates instantly after transactions

🔁 Bet / Cash Out Toggle
- Single action button:
  - BET (Green) → starts the game
  - CASH OUT (Skin) → secures winnings
- Button state updates dynamically based on gameplay

🔊 Sound Effects
- Tile click sound
- Star (safe tile) sound
- Mine explosion sound
- Lose sound
- Cash-out confirmation sound
(WAV & MP3 formats used)

📘 Game Assistance
- How to Play modal with clear instructions
- Visual examples of stars and mines
- Beginner-friendly explanations

🎨 User Interface
- Clean, modern casino-inspired UI
- Smooth animations and transitions
- Fully responsive layout
- Consistent color scheme and visual hierarchy

---

🛠️ Technology Stack
Frontend
- HTML5 – Structure
- CSS3 – Styling, gradients, animations
- Vanilla JavaScript – Game logic & state handling

Other Tools
- LocalStorage – Wallet persistence
- Vercel – Deployment & hosting

---

🚀 Getting Started
Prerequisites
- Modern web browser
- Git (optional, for cloning)
- Basic knowledge of HTML/CSS/JS

Installation
1. Clone the repository
```bash
git clone https://github.com/aviraj-singh1/MinesX-game.git
cd MinesX-game
```
2. Open locally
  - Open index.html using Live Server or directly in your browser
3. Optional – Deploy
  - Push to GitHub
  - Deploy using Vercel

---

📱 Usage
1. Start with ₹0 wallet balance
2. Click Top Up Wallet
3. Select an amount and complete the demo payment
4. Return to the game screen
5. Choose:
  - Bet amount
  - Number of mines
6. Click BET
7. Reveal tiles:
  - ⭐ Star → multiplier & payout increase
  - 💣 Mine → game over
8. Click CASH OUT anytime to secure winnings

---

🧠 Game Logic Highlights
- Randomized mine placement per round
- Live Next Multiplier calculation
- Live Payout calculation
- Centralized game state control
- UI synced with game logic at every step

---

📁 Project Structure
```bash
MinesX/
│
├── index.html        # Main game UI
├── style.css         # Styling & animations
├── script.js         # Game logic
│
├── sounds/
│   ├── click.wav
│   ├── coin.wav
│   ├── bomb.wav
│   ├── lose.wav
│   └── cashout.mp3
│
├── topup.html        # Wallet top-up page
└── README.md
```

---

🔒 Disclaimer
This project is strictly for educational and demonstration purposes.
No real money, real betting, or real payments are involved.

---

👤 Author
Aviraj Singh
First-year CS & AI Student
Scaler School of Technology
Passionate about Web Development & Game Logic

---

⭐ Future Improvements
- Difficulty levels
- Animated win/loss effects
- Leaderboard system
- Backend integration
- Mobile-first UI enhancements

---

📧 Support
For suggestions or improvements:
- Open an issue on GitHub
- Contact the developer directly

---

Built with ❤️ as a learning project

---
