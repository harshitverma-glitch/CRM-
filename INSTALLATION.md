# Installation Instructions for CRM Auto Refresh App

## For Production/Admin Installation

### Prerequisites
- Frappe Bench installed
- Access to the bench directory

### Installation Steps

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

### Verification

1. Open your CRM in browser
2. Navigate to Leads page (`/crm/leads`)
3. Open Developer Tools (F12) → Console tab
4. You should see: `[CRM Auto Refresh] Starting auto-refresh for Leads page`
5. Every 30 seconds, you should see: `[CRM Auto Refresh] Auto-refreshing leads list...`

### Troubleshooting

- If the app doesn't appear, check `sites/apps.txt` and ensure `crm_auto_refresh` is listed
- If JavaScript doesn't load, check browser console for errors
- Make sure assets are built: `bench build --app crm_auto_refresh`

