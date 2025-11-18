# CRM Auto Refresh

Custom Frappe app that adds auto-refresh functionality to the CRM Leads page.

## Features

- Automatically refreshes the Leads list every 30 seconds
- Works independently of CRM app updates
- No modifications to core CRM files required
- Easy installation via GitHub

## Installation

### From GitHub (Recommended for Production)

1. **Get the app from GitHub:**
   ```bash
   cd ~/frappe-bench
   bench get-app https://github.com/YOUR_USERNAME/crm_auto_refresh.git
   ```

2. **Install the app to your site:**
   ```bash
   bench --site YOUR_SITE_NAME install-app crm_auto_refresh
   ```

3. **Build assets:**
   ```bash
   bench build --app crm_auto_refresh
   ```

4. **Restart bench:**
   ```bash
   bench restart
   ```

### Local Installation (Development)

If you have the app locally:

1. Install the app:
   ```bash
   bench --site YOUR_SITE_NAME install-app crm_auto_refresh
   ```

2. Build assets:
   ```bash
   bench build --app crm_auto_refresh
   ```

3. Restart bench:
   ```bash
   bench restart
   ```

## How It Works

This app injects a JavaScript file (`leads_auto_refresh.js`) that:
- Detects when you're on the Leads page
- Automatically refreshes the leads list every 30 seconds
- Cleans up when you navigate away

## Verification

1. Open your CRM in browser
2. Navigate to Leads page (`/crm/leads`)
3. Open Developer Tools (F12) → Console tab
4. You should see: `[CRM Auto Refresh] Starting auto-refresh for Leads page`
5. Every 30 seconds, you should see: `[CRM Auto Refresh] Auto-refreshing leads list...`

## Customization

To change the refresh interval, edit `crm_auto_refresh/public/js/leads_auto_refresh.js` and modify the `REFRESH_INTERVAL` constant (currently 30000ms = 30 seconds).

## Requirements

- Frappe Framework
- CRM app installed
- Python 3.10+

## License

MIT


