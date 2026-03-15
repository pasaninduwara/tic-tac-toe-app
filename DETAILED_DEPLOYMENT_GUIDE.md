# 📚 Complete Step-by-Step Deployment Guide

This guide will walk you through every single step to deploy your Tic-Tac-Toe app, starting from creating a GitHub account to having a live Telegram Mini App.

---

## Part 2: GitHub & Vercel - Complete Step-by-Step

### Step 2.1: Create a GitHub Account

1. Open your web browser and go to: **https://github.com**
2. Click the **"Sign up"** button in the top right corner
3. Enter your email address
4. Create a password (make it strong!)
5. Choose a username (this will be your GitHub identity)
6. Complete the verification puzzle
7. Click **"Create account"**
8. GitHub will send you a verification email - open it and click the verification link
9. Answer the questions (you can skip most of them)
10. Choose the **"Free"** plan (you don't need to pay anything)

✅ **Checkpoint**: You now have a GitHub account!

---

### Step 2.2: Create a New Repository

1. After logging into GitHub, look for a **"+"** button in the top right corner
2. Click it and select **"New repository"**
3. Fill in the form:
   - **Repository name**: Type `tic-tac-toe-app`
   - **Description**: (optional) `Telegram Mini App Game`
   - **Visibility**: Select **"Public"** (required for free Vercel tier)
   - **DO NOT** check "Add a README file"
   - **DO NOT** add a .gitignore or license
4. Click the green **"Create repository"** button

✅ **Checkpoint**: You have created an empty repository!

---

### Step 2.3: Install Git on Your Computer

**For Windows:**
1. Go to: **https://git-scm.com/download/win**
2. The download should start automatically
3. Run the downloaded installer
4. Click "Next" through all the options (default settings are fine)
5. Click "Install"
6. Click "Finish"

**For Mac:**
1. Open Terminal (Cmd + Space, type "Terminal")
2. Type: `xcode-select --install`
3. Press Enter
4. A popup will appear - click "Install"

**For Linux:**
1. Open Terminal
2. Type: `sudo apt install git` (Ubuntu/Debian)
   or `sudo dnf install git` (Fedora)

**Verify Git Installation:**
1. Open Terminal (Windows: Git Bash or Command Prompt)
2. Type: `git --version`
3. You should see something like: `git version 2.43.0`

✅ **Checkpoint**: Git is installed!

---

### Step 2.4: Navigate to Your Project Folder

1. Open Terminal (Windows: Git Bash or Command Prompt)
2. Navigate to where you downloaded the project files
3. For example, if your files are in Downloads:
   ```bash
   cd Downloads/tic-tac-toe-app
   ```
   
   **Windows example:**
   ```bash
   cd C:\Users\YourName\Downloads\tic-tac-toe-app
   ```

4. Type `ls` (Mac/Linux) or `dir` (Windows) to see your files
5. You should see files like: `package.json`, `README.md`, `src/`, etc.

✅ **Checkpoint**: You're in the project directory!

---

### Step 2.5: Initialize Git and Push to GitHub

Now we'll connect your local files to GitHub. Type these commands one by one:

**Command 1: Initialize Git repository**
```bash
git init
```
You should see: `Initialized empty Git repository in ...`

**Command 2: Stage all files**
```bash
git add .
```
(Nothing will appear, that's normal)

**Command 3: Create your first commit**
```bash
git commit -m "Initial commit - Tic-Tac-Toe game"
```
You should see a list of files being created.

**Command 4: Connect to your GitHub repository**
```bash
git remote add origin https://github.com/YOUR_USERNAME/tic-tac-toe-app.git
```
**IMPORTANT**: Replace `YOUR_USERNAME` with your actual GitHub username!

**Command 5: Set the branch name**
```bash
git branch -M main
```

**Command 6: Push your code to GitHub**
```bash
git push -u origin main
```

**If you need to update files after pushing:**
If you made changes to the files and need to update GitHub:
```bash
git add .
git commit -m "Updated files"
git push
```

**First time?** A popup will appear asking you to login to GitHub:
1. Click "Sign in with your browser"
2. Authorize Git to access your GitHub
3. Once authorized, come back to Terminal

You should see something like:
```
Enumerating objects: XX, done.
...
To https://github.com/YOUR_USERNAME/tic-tac-toe-app.git
 * [new branch]      main -> main
```

✅ **Checkpoint**: Your code is now on GitHub! Go to your repository page to verify.

---

### Step 2.6: Create a Vercel Account

1. Open your browser and go to: **https://vercel.com**
2. Click the **"Sign Up"** button
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account:
   - Click "Authorize Vercel"
5. Fill in your details:
   - Name
   - Email (use the same as GitHub)
6. Click **"Create Account"**
7. You may be asked to verify your email

✅ **Checkpoint**: You have a Vercel account!

---

### Step 2.7: Import Your Project to Vercel

1. After logging in, you'll see the Vercel dashboard
2. Click the **"Add New..."** button in the top right
3. Select **"Project"**
4. You'll see a list of your GitHub repositories
5. Find `tic-tac-toe-app` and click **"Import"**

If you don't see your repository:
1. Click **"Adjust GitHub App Permissions"**
2. Select "All repositories" or select just `tic-tac-toe-app`
3. Click "Save"
4. Go back and refresh the page

✅ **Checkpoint**: Your project is being imported!

---

### Step 2.8: Configure Project Settings (IMPORTANT!)

Before clicking deploy, we need to configure some settings:

**On the "Configure Project" page:**

1. **Framework Preset**: Should auto-detect as **"Vite"** (if not, select it)

2. **Root Directory**: Leave as `./`

3. **Build and Output Settings**:
   - Build Command: `npm run build` (should be auto-filled)
   - Output Directory: `dist` (should be auto-filled)
   - Install Command: `npm install` (should be auto-filled)

4. **Environment Variables** (Click "Environment Variables" to expand):
   
   Click **"Add"** and add these one by one:
   
   | Name | Value |
   |------|-------|
   | `TELEGRAM_BOT_TOKEN` | Your bot token from BotFather |
   | `CHANNEL_USERNAME` | Your channel username (without @) or leave empty |
   | `APP_URL` | Leave empty for now (we'll update after first deploy) |

5. Click **"Deploy"**

✅ **Checkpoint**: Your project is deploying!

---

### Step 2.9: Wait for Deployment

1. You'll see a building animation with logs scrolling
2. This typically takes 1-3 minutes
3. Wait until you see:
   - A celebration animation with confetti 🎉
   - A message saying "Congratulations!"

If deployment fails:
1. Check the error logs (click on "Build Logs")
2. Common issues:
   - Missing files (make sure you uploaded all files)
   - Wrong Node version (add `"engines": {"node": "18.x"}` to package.json)

✅ **Checkpoint**: Deployment successful!

---

### Step 2.10: Get Your Vercel URL

1. After successful deployment, you'll see a preview image of your site
2. Look at the URL in your browser address bar
3. It should look like: `https://tic-tac-toe-app-xyz123.vercel.app`
4. Copy this URL - you'll need it!

**Or find it from dashboard:**
1. Go to your Vercel dashboard
2. Click on your project
3. You'll see the URL under "Domains"

✅ **Checkpoint**: You have your app URL!

---

### Step 2.11: Update APP_URL Environment Variable

1. In Vercel dashboard, click on your project
2. Click **"Settings"** tab at the top
3. Click **"Environment Variables"** in the left sidebar
4. Find `APP_URL` in the list
5. Click the **"Edit"** button (pencil icon)
6. Paste your Vercel URL (e.g., `https://tic-tac-toe-app-xyz123.vercel.app`)
7. Click **"Save"**
8. **IMPORTANT**: You need to redeploy for changes to take effect:
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"

✅ **Checkpoint**: APP_URL is configured!

---

## Part 3: Database Setup - Complete Step-by-Step

### Step 3.1: Create Vercel Postgres Database

1. In Vercel dashboard, click on your project
2. Click the **"Storage"** tab at the top
3. Click **"Create Database"**
4. Select **"Neon Postgres"** (it's free!)
5. Fill in:
   - **Database Name**: `tic-tac-toe-db`
   - **Region**: Choose the closest to you
6. Click **"Create"**
7. Wait for database creation (a few seconds)

✅ **Checkpoint**: Database created!

---

### Step 3.2: Connect Database to Your Project

1. After creating the database, you'll see it listed
2. Click on the database name
3. Click **"Connect to Project"** (or it may auto-connect)
4. Select your `tic-tac-toe-app` project
5. Click **"Connect"**

**What this does:**
- Automatically adds database environment variables to your project:
  - `POSTGRES_URL`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_USER`
  - `POSTGRES_HOST`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DATABASE`

✅ **Checkpoint**: Database connected!

---

### Step 3.3: Initialize Database Tables

**Option A: Automatic (Tables create on first API call)**

The tables will be created automatically when the first user accesses the app. No action needed!

**Option B: Manual (If you want to initialize now)**

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Click **"Download .env File"** (if available)
4. Or run locally:

```bash
# In your project directory
vercel login
vercel link
vercel env pull .env.local
npm run init-db
```

✅ **Checkpoint**: Database is ready!

---

## Part 4: Telegram Mini App Configuration - Complete Step-by-Step

### Step 4.1: Go to BotFather

1. Open Telegram app (on phone or desktop)
2. Search for: **@BotFather**
3. Click to open the chat
4. Click **"Start"** if you haven't before

✅ **Checkpoint**: BotFather chat is open!

---

### Step 4.2: Access Mini App Settings

1. Send the command: `/myapps`
2. BotFather will show you options
3. Click **"Create a New App"** (or the button to create)
4. If you see your bot listed, you can select it

**If you need to create a new app:**
1. Click **"Create New App"** or send `/newapp`
2. BotFather will ask for:
   - **App Title**: Type `Tic-Tac-Toe`
   - **App Description**: Type `A 6x6 multiplayer Tic-Tac-Toe game`
   - **App Photo**: You can skip or upload a 640x360 image
   - **Web App URL**: Paste your Vercel URL (e.g., `https://tic-tac-toe-app-xyz123.vercel.app`)

✅ **Checkpoint**: Mini App created!

---

### Step 4.3: Set the Menu Button

1. Send to BotFather: `/setmenubutton`
2. Select your bot from the list
3. Enter button text: `🎮 Play Game`
4. Enter URL: Your Vercel URL

✅ **Checkpoint**: Menu button configured!

---

### Step 4.4: Test Your Mini App!

1. Open Telegram
2. Search for your bot (the username you created earlier)
3. Click **"Start"** or the menu button
4. The Mini App should open!

✅ **Congratulations! Your app is live!**

---

## 🔄 Summary of All URLs and Credentials

After completing all steps, you should have:

| Item | Example Value |
|------|---------------|
| GitHub Repository | `https://github.com/YOUR_USERNAME/tic-tac-toe-app` |
| Vercel URL | `https://tic-tac-toe-app-xyz123.vercel.app` |
| Bot Username | `@YourGameBot` |
| Bot Token | `1234567890:ABCdef...` (keep secret!) |
| Channel Username | `@your_channel` (if created) |

---

## ❓ Troubleshooting Common Issues

### "I don't see my repository in Vercel"
- Go to GitHub.com → Settings → Applications → Vercel
- Click "Configure"
- Select "All repositories" or add your specific repository
- Save and retry

### "Build failed in Vercel"
- Check the build logs for specific errors
- Make sure all files are uploaded to GitHub
- Check package.json has correct dependencies

### "App shows blank page"
- Check browser console for errors
- Verify APP_URL environment variable is set correctly
- Make sure the database is connected

### "Bot doesn't respond"
- Verify TELEGRAM_BOT_TOKEN is correct
- Check you're messaging the right bot
- Try `/start` command

### "Database connection error"
- Verify Postgres database is created in Vercel
- Check database is connected to your project
- Look for POSTGRES_* environment variables in settings

---

## 📞 Need More Help?

If you're still stuck:
1. Check the Vercel deployment logs
2. Check the browser console for JavaScript errors
3. Verify all environment variables are set correctly
4. Make sure you've redeployed after changing environment variables

Good luck with your deployment! 🚀