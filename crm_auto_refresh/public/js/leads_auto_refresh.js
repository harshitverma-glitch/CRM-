/**
 * CRM Auto Refresh - Custom JavaScript
 * This script adds auto-refresh functionality to the CRM Leads page
 * It works by intercepting the Vue component and adding auto-refresh logic
 */

(function() {
  'use strict';

  const REFRESH_INTERVAL = 30000; // 30 seconds
  let autoRefreshInterval = null;
  let isOnLeadsPage = false;

  // Function to check if we're on the Leads page
  function checkIfLeadsPage() {
    const path = window.location.pathname;
    return path.includes('/crm/leads') || path.includes('/leads');
  }

  // Function to find and trigger refresh
  function triggerRefresh() {
    try {
      // Check if we're on the Leads page
      if (!checkIfLeadsPage()) {
        return;
      }

      // Method 1: Find the refresh button by looking for buttons with Refresh tooltip/aria-label
      // ViewControls component has a refresh button with tooltip="Refresh"
      // Frappe UI uses data-tooltip or aria-label for tooltips
      const allButtons = document.querySelectorAll('button');
      for (let btn of allButtons) {
        // Check various attributes where tooltip might be stored
        const tooltip = btn.getAttribute('data-tooltip') || 
                       btn.getAttribute('aria-label') || 
                       btn.getAttribute('title') || 
                       btn.getAttribute('data-original-title') ||
                       '';
        if (tooltip.toLowerCase().includes('refresh') && !btn.disabled) {
          // Check if button is visible and not loading
          const rect = btn.getBoundingClientRect();
          const isLoading = btn.getAttribute('aria-busy') === 'true' || 
                           btn.classList.contains('loading') ||
                           btn.querySelector('[class*="spinner"], [class*="loading"]');
          if (rect.width > 0 && rect.height > 0 && !isLoading) {
            console.log('[CRM Auto Refresh] Auto-refreshing leads list...', new Date().toLocaleTimeString());
            btn.click();
            return;
          }
        }
      }

      // Method 2: Try to find refresh button by SVG icon (RefreshIcon)
      // Look for button containing an SVG with refresh-like paths
      const buttonsWithSvg = document.querySelectorAll('button svg');
      for (let svg of buttonsWithSvg) {
        const path = svg.querySelector('path');
        if (path) {
          const d = path.getAttribute('d') || '';
          // Refresh icon typically has specific path patterns
          // Look for circular/refresh-like paths
          if (d.includes('M') && d.includes('L') && d.length > 50) {
            const button = svg.closest('button');
            if (button && !button.disabled) {
              const rect = button.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                // Check if it's in the ViewControls area (usually in header)
                const header = button.closest('header, [class*="header"], [class*="Header"]');
                if (header) {
                  console.log('[CRM Auto Refresh] Auto-refreshing leads list (via icon)...', new Date().toLocaleTimeString());
                  button.click();
                  return;
                }
              }
            }
          }
        }
      }

      // Method 3: Try to access Vue component instance directly
      // This is more complex but more reliable
      try {
        const appElement = document.querySelector('#app');
        if (appElement && appElement.__vue_app__) {
          const vueApp = appElement.__vue_app__;
          const router = vueApp.config?.globalProperties?.$router;
          
          if (router) {
            const currentRoute = router.currentRoute?.value;
            if (currentRoute && (currentRoute.name === 'Leads' || currentRoute.path.includes('/leads'))) {
              // Try to find the Leads component instance
              // This is tricky but we can try accessing via the mounted component tree
              const instance = findVueComponent(appElement, 'Leads');
              if (instance && instance.setupState) {
                const leads = instance.setupState.leads;
                if (leads && leads.value && typeof leads.value.reload === 'function') {
                  if (!leads.value.loading) {
                    console.log('[CRM Auto Refresh] Auto-refreshing leads list (via component)...', new Date().toLocaleTimeString());
                    leads.value.reload();
                    return;
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        // Silently fail
        console.debug('[CRM Auto Refresh] Could not access Vue component:', e);
      }

    } catch (e) {
      console.debug('[CRM Auto Refresh] Error during refresh:', e);
    }
  }

  // Helper to find Vue component by name in the component tree
  function findVueComponent(element, componentName) {
    if (!element) return null;
    
    // Check if element has Vue instance
    if (element.__vueParentComponent || element.__vue_app__) {
      let instance = element.__vueParentComponent || element.__vue_app__._instance;
      while (instance) {
        if (instance.type && (instance.type.name === componentName || instance.type.__name === componentName)) {
          return instance;
        }
        instance = instance.parent;
      }
    }
    
    // Recursively check children
    for (let child of element.children || []) {
      const found = findVueComponent(child, componentName);
      if (found) return found;
    }
    
    return null;
  }

  // Start auto-refresh
  function startAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }

    if (!checkIfLeadsPage()) {
      return;
    }

    console.log('[CRM Auto Refresh] Starting auto-refresh for Leads page');
    isOnLeadsPage = true;

    // Start interval
    autoRefreshInterval = setInterval(() => {
      if (checkIfLeadsPage()) {
        triggerRefresh();
      } else {
        stopAutoRefresh();
      }
    }, REFRESH_INTERVAL);
  }

  // Stop auto-refresh
  function stopAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      autoRefreshInterval = null;
      isOnLeadsPage = false;
      console.log('[CRM Auto Refresh] Stopped auto-refresh');
    }
  }

  // Initialize when page loads
  function init() {
    // Wait for Vue app to be ready
    const checkVueApp = setInterval(() => {
      const appElement = document.querySelector('#app');
      if (!appElement) return;

      const vueApp = appElement.__vue_app__;
      if (!vueApp) return;

      clearInterval(checkVueApp);

      // Get router
      const router = vueApp.config?.globalProperties?.$router;
      if (!router) return;

      // Watch for route changes
      router.afterEach((to) => {
        if (to.name === 'Leads' || to.path.includes('/leads')) {
          setTimeout(() => {
            startAutoRefresh();
          }, 1500); // Wait for component to mount
        } else {
          stopAutoRefresh();
        }
      });

      // Check if already on Leads page
      const currentRoute = router.currentRoute?.value;
      if (currentRoute && (currentRoute.name === 'Leads' || currentRoute.path.includes('/leads'))) {
        setTimeout(() => {
          startAutoRefresh();
        }, 1500);
      }
    }, 100);

    // Also check on popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        if (checkIfLeadsPage()) {
          startAutoRefresh();
        } else {
          stopAutoRefresh();
        }
      }, 500);
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', stopAutoRefresh);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also try after a delay to ensure Vue app is fully loaded
  setTimeout(init, 2000);
})();

