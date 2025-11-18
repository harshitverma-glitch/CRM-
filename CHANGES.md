# Changes Made - CRM Auto Refresh App

## Summary
Created a custom Frappe app `crm_auto_refresh` that adds auto-refresh functionality to the CRM Leads page. This app is independent of the CRM app, so it won't be overwritten during CRM updates.

## Files Created

### 1. App Structure
```
apps/crm_auto_refresh/
├── crm_auto_refresh/
│   ├── __init__.py              # App version info
│   ├── hooks.py                 # Frappe hooks - injects JavaScript
│   ├── install.py               # Installation script
│   ├── uninstall.py             # Uninstallation script
│   ├── modules.txt              # App modules list
│   └── public/
│       └── js/
│           └── leads_auto_refresh.js  # Auto-refresh JavaScript
├── pyproject.toml               # Python package config
└── README.md                    # Documentation
```

### 2. Key Files Explained

#### `crm_auto_refresh/hooks.py`
- **Purpose**: Injects JavaScript file into CRM pages
- **Key Change**: Added `app_include_js = "/assets/crm_auto_refresh/js/leads_auto_refresh.js"`
- This makes the JavaScript load on every CRM page

#### `crm_auto_refresh/public/js/leads_auto_refresh.js`
- **Purpose**: Main auto-refresh logic
- **Features**:
  - Detects when user is on Leads page
  - Automatically clicks refresh button every 30 seconds
  - Multiple fallback methods to find refresh button
  - Cleans up when navigating away
  - Console logging for debugging

#### `pyproject.toml`
- **Purpose**: Python package configuration
- Defines app metadata, dependencies, and build system

#### `sites/apps.txt`
- **Modified**: Added `crm_auto_refresh` to the list of installed apps

## How It Works

1. **JavaScript Injection**: The `hooks.py` file tells Frappe to include `leads_auto_refresh.js` on all pages
2. **Page Detection**: The JavaScript checks if the current route is the Leads page
3. **Auto-Refresh**: Every 30 seconds, it finds and clicks the refresh button in ViewControls
4. **Cleanup**: When navigating away from Leads page, the auto-refresh stops

## Installation Steps Performed

1. Created app structure in `apps/crm_auto_refresh/`
2. Installed app in Python environment: `../../env/bin/pip install -e .`
3. Added app to `sites/apps.txt`
4. Installed app to site: `bench --site mysite.local install-app crm_auto_refresh`
5. Built assets: `bench build --app crm_auto_refresh`

## Customization

To change the refresh interval (currently 30 seconds):
- Edit `apps/crm_auto_refresh/crm_auto_refresh/public/js/leads_auto_refresh.js`
- Change `const REFRESH_INTERVAL = 30000;` to your desired milliseconds


