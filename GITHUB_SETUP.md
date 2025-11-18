# How to Push to GitHub

## Option 1: Push Only the Custom App (Recommended)

This pushes only your custom app, not the entire frappe-bench.

### Steps:

1. **Navigate to the app directory:**
   ```bash
   cd ~/frappe-bench/apps/crm_auto_refresh
   ```

2. **Initialize git repository (if not already):**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: CRM Auto Refresh app"
   ```

5. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `crm_auto_refresh` (or any name you prefer)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

6. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/crm_auto_refresh.git
   git branch -M main
   git push -u origin main
   ```

## Option 2: Push as Part of Frappe Bench

If you want to include this app in your main frappe-bench repository:

1. **Navigate to frappe-bench root:**
   ```bash
   cd ~/frappe-bench
   ```

2. **Check git status:**
   ```bash
   git status
   ```

3. **Add only the custom app:**
   ```bash
   git add apps/crm_auto_refresh/
   git add sites/apps.txt
   ```

4. **Commit:**
   ```bash
   git commit -m "Add CRM Auto Refresh custom app"
   ```

5. **Push to your repository:**
   ```bash
   git push origin main
   ```

## Important Notes:

- **Don't commit** the entire `frappe-bench` if it's not your repository
- The `sites/apps.txt` file contains your site configuration - you may want to exclude it or use a different approach
- Consider using `.gitignore` to exclude sensitive files

## Recommended: Separate Repository

It's better to keep your custom app in a separate repository so:
- It's easier to share
- It's independent of your bench setup
- Others can install it easily with `bench get-app`


