# 🎮 Tic-Tac-Toe Telegram Mini App

A 6x6 multiplayer Tic-Tac-Toe game built as a Telegram Mini App with a premium dark theme, lobby system, leaderboards, and channel subscription verification.

![Telegram Mini App](https://img.shields.io/badge/Telegram-Mini%20App-blue)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## ✨ Features

- **6x6 Game Board**: Strategic gameplay where players earn 5 points for each line of 3
- **Real-time Multiplayer**: Create lobbies and invite friends via shareable links
- **Leaderboard System**: View rankings by Today, Week, Month, Year, or All-Time
- **User Profiles**: Track your stats, wins, losses, and total score
- **Channel Subscription**: Require users to join your Telegram channel before playing
- **Premium Dark Theme**: Luxury color palette with gold accents
- **Mobile-First Design**: Optimized for Telegram's mobile experience

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Telegram Mini App                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React Frontend (Vite)                   │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │  Menu   │ │  Lobby  │ │  Game   │ │ Leader  │   │    │
│  │  │  Page   │ │  Page   │ │  Page   │ │  Board  │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │    │
│  │                                                      │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │         Telegram WebApp SDK                  │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Serverless                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              API Endpoints (Node.js)                 │    │
│  │  /api/auth     - Authentication                     │    │
│  │  /api/user     - User management                    │    │
│  │  /api/lobby    - Lobby CRUD                         │    │
│  │  /api/game     - Game logic & moves                 │    │
│  │  /api/leaderboard - Rankings                        │    │
│  │  /api/subscription - Channel check                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                               │
│  ┌───────────────────────────┴───────────────────────┐      │
│  │               Vercel Postgres                      │      │
│  │    users | games | lobbies | leaderboard          │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Telegram Account**: For creating the bot
2. **GitHub Account**: For code hosting
3. **Vercel Account**: Free tier works perfectly
4. **Node.js 18+**: For local development

## 🚀 Deployment Guide

### Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send the command `/newbot`
3. Follow the prompts:
   - Bot name: `Tic-Tac-Toe Game` (or your preferred name)
   - Bot username: `YourGameBot` (must end with 'bot')
4. **Save the Bot Token** - you'll need this later!

```
Example token format: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

### Step 2: Create a Telegram Channel (Optional but Recommended)

1. Create a new channel in Telegram
2. Add your bot as an administrator
3. Note the channel username (e.g., `@mygamechannel`)

### Step 3: Set Up Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

### Step 4: Deploy to Vercel

1. Push this code to a GitHub repository

2. Import the project in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Click "Import"

3. Configure environment variables in Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Your bot token from BotFather | `1234567890:ABC...` |
| `CHANNEL_USERNAME` | Your channel (without @) | `mygamechannel` |
| `APP_URL` | Your Vercel app URL | `https://your-app.vercel.app` |

4. Click "Deploy" and wait for deployment to complete

5. Note your deployment URL (e.g., `https://tic-tac-toe-app.vercel.app`)

### Step 5: Set Up Vercel Postgres Database

1. In your Vercel project dashboard, go to **Storage**
2. Click **Create Database**
3. Select **Postgres**
4. Choose a database name (e.g., `tic-tac-toe-db`)
5. Select the same region as your project
6. Click **Create**

Vercel will automatically inject these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Step 6: Initialize the Database

After deployment, the database tables will be created automatically on first API call. Alternatively, you can run:

```bash
# In your local environment with Vercel CLI
vercel env pull .env.local
node scripts/init-db.js
```

### Step 7: Configure Telegram Mini App

1. Go back to **@BotFather** in Telegram
2. Send `/myapps`
3. Click on your app or create a new one
4. Set the Web App URL to your Vercel deployment URL:
   ```
   https://your-app.vercel.app
   ```

### Step 8: Set Bot Commands (Optional)

Send this to @BotFather:

```
/setcommands

start - Start the game
play - Open the game
help - Show help
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
CHANNEL_USERNAME=your_channel_name

# App URL
APP_URL=http://localhost:3000

# Database (auto-injected by Vercel)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

### Disabling Channel Subscription Check

To disable the subscription requirement, simply don't set the `CHANNEL_USERNAME` environment variable.

## 🏃 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
tic-tac-toe-app/
├── api/                    # Serverless API endpoints
│   ├── auth/              # Authentication
│   ├── user/              # User management
│   ├── lobby/             # Lobby CRUD operations
│   ├── game/              # Game logic
│   ├── leaderboard/       # Rankings
│   └── subscription/      # Channel verification
├── lib/                   # Shared libraries
│   ├── db.js             # Database helpers
│   ├── gameLogic.js      # Game rules & scoring
│   └── telegram.js       # Telegram API helpers
├── src/                   # React frontend
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── styles/           # CSS styles
│   └── App.jsx           # Main app
├── public/               # Static assets
├── package.json
├── vercel.json           # Vercel configuration
└── vite.config.js        # Vite configuration
```

## 🎯 Game Rules

1. **Board**: 6x6 grid
2. **Players**: X and O take turns
3. **Scoring**: 5 points for each line of 3 (horizontal, vertical, diagonal)
4. **Winning**: Highest total score when the board is full
5. **Lines**: Can overlap - each unique line scores points

## 🧪 Testing

### Local Testing

1. Run `npm run dev`
2. Open `http://localhost:3000` in your browser
3. The app will use a mock user in development mode

### Testing in Telegram

1. Open your bot in Telegram
2. Send `/start`
3. The Mini App should launch

### Testing Invite Links

1. Create a lobby in the app
2. Share the generated link
3. Open the link in another Telegram account

## 🐛 Troubleshooting

### "Database connection error"
- Ensure Vercel Postgres is set up
- Check environment variables are correctly set

### "Subscription check always fails"
- Verify your bot is an admin in the channel
- Check `CHANNEL_USERNAME` matches exactly (without @)

### "Mini App doesn't load"
- Verify your Vercel URL is correct in BotFather
- Check browser console for errors

### "Game state not updating"
- The app polls every 3 seconds
- Check the network tab for API errors

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  photo_url TEXT,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  games_lost INTEGER DEFAULT 0,
  games_draw INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Games Table
```sql
CREATE TABLE games (
  id VARCHAR(255) PRIMARY KEY,
  player_x_id BIGINT REFERENCES users,
  player_o_id BIGINT REFERENCES users,
  board JSONB,
  current_turn VARCHAR(1),
  status VARCHAR(50),
  score_x INTEGER,
  score_o INTEGER,
  moves_count INTEGER,
  winner_id BIGINT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Lobbies Table
```sql
CREATE TABLE lobbies (
  id VARCHAR(255) PRIMARY KEY,
  creator_id BIGINT REFERENCES users,
  creator_name VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP
);
```

## 🔒 Security Notes

1. **Init Data Validation**: Always validate Telegram WebApp init data in production
2. **Rate Limiting**: Consider adding rate limiting for game moves
3. **Input Sanitization**: All user inputs are sanitized through parameterized queries

## 📝 License

MIT License - Feel free to use this for your own projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Telegram Mini Apps