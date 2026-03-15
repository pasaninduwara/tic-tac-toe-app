# 🚀 Quick Setup Guide

Follow these steps to get your Tic-Tac-Toe Mini App running in under 30 minutes!

## Part 1: Telegram Bot Setup (5 minutes)

### 1.1 Create Your Bot
1. Open Telegram and search for **@BotFather**
2. Send: `/newbot`
3. Name it: `Tic-Tac-Toe Game`
4. Username: `YourNameTicTacBot` (must end in 'bot')
5. **Copy the API token** - looks like: `123456789:ABCdefGHI...`

### 1.2 Create Your Channel (Optional)
1. Create a new Telegram channel
2. Name it something like "Game Updates"
3. Add your bot as an **Administrator**
4. Note the channel username (e.g., `mygamechannel`)

## Part 2: GitHub & Vercel (10 minutes)

### 2.1 Push to GitHub
```bash
# Initialize git repository
cd tic-tac-toe-app
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tic-tac-toe.git
git push -u origin main
```

### 2.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**
3. Import your `tic-tac-toe` repository
4. **Don't deploy yet!** We need to set environment variables first.

### 2.3 Set Environment Variables
In Vercel project settings → Environment Variables, add:

| Name | Value |
|------|-------|
| `TELEGRAM_BOT_TOKEN` | Your bot token from step 1.1 |
| `CHANNEL_USERNAME` | Your channel username (without @) |
| `APP_URL` | Will be your Vercel URL |

Now click **Deploy**!

### 2.4 Note Your URL
After deployment, copy your URL (e.g., `https://tic-tac-toe.vercel.app`)

Update `APP_URL` environment variable with this URL.

## Part 3: Database Setup (5 minutes)

### 3.1 Create Vercel Postgres
1. In Vercel dashboard, go to **Storage**
2. Click **Create Database**
3. Select **Neon Postgres** (free)
4. Name it: `tic-tac-toe-db`
5. Select region closest to you
6. Click **Create**

The database will auto-connect to your project!

### 3.2 Initialize Tables
Tables are created automatically on first API call, or run locally:

```bash
vercel env pull .env.local
npm run init-db
```

## Part 4: Connect to Telegram (5 minutes)

### 4.1 Configure Mini App
1. Go to **@BotFather** in Telegram
2. Send: `/myapps`
3. Click **"Create New App"**
4. Fill in:
   - Title: `Tic-Tac-Toe`
   - Description: `6x6 multiplayer game`
   - Photo: Upload an image (optional)
   - Web App URL: `https://your-app.vercel.app`

### 4.2 Set Bot Menu Button
1. Send to @BotFather: `/setmenubutton`
2. Select your bot
3. Set button text: `Play Game`
4. Set URL: `https://your-app.vercel.app`

### 4.3 Test Your Bot!
1. Open your bot in Telegram
2. Click the **Menu button** (or send `/start`)
3. The Mini App should launch!

## 🎉 You're Done!

Your Tic-Tac-Toe game is now live!

### Next Steps:
- Test creating a lobby
- Test the game mechanics
- Share with friends!

### Need Help?
- Check the full README.md for detailed documentation
- Check Vercel logs for any errors
- Ensure all environment variables are set correctly

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Bot doesn't respond | Check `TELEGRAM_BOT_TOKEN` is correct |
| Database errors | Ensure Postgres is created and connected |
| App doesn't load | Check `APP_URL` matches your Vercel URL |
| Subscription always fails | Add bot as admin to your channel |
| Can't join games | Both players need to open the app |

Good luck and have fun! 🎮