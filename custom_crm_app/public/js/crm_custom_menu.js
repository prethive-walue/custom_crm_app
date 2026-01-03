// Custom CRM Menu Items
// This script adds custom menu items to Frappe CRM sidebar
// It reads menu items from window.custom_sidebar_items (injected via boot)

(function () {
  "use strict";

  // Only run on CRM pages
  if (!window.location.pathname.startsWith("/crm")) {
    return;
  }

  // Get custom menu items from boot data
  const customItems = window.custom_sidebar_items || [
    // Fallback default items if boot override doesn't work
    {
      label: "Custom Reports",
      icon: "bar-chart-3",
      route: "/app/query-report/CRM Custom Report",
      is_external: true,
    },
  ];

  if (!customItems.length) return;

  let injected = false;

  function injectMenuItems() {
    if (injected) return;

    // Find the sidebar nav element
    const navElements = document.querySelectorAll("nav.flex.flex-col");
    if (!navElements.length) return;

    const nav = navElements[0];
    const buttons = nav.querySelectorAll("button");
    if (buttons.length < 2) return;

    // Find a reference button to clone styling
    const referenceBtn = buttons[buttons.length - 1];
    if (!referenceBtn) return;

    // Add each custom menu item
    customItems.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = referenceBtn.className;
      btn.innerHTML = `
        <div class="flex w-full items-center justify-between duration-300 ease-in-out px-2 py-1">
          <div class="flex items-center truncate">
            <span class="grid flex-shrink-0 place-items-center">
              ${getIconSvg(item.icon)}
            </span>
            <span class="flex-1 flex-shrink-0 truncate text-sm duration-300 ease-in-out ml-2 w-auto opacity-100">
              ${item.label}
            </span>
          </div>
        </div>
      `;

      btn.addEventListener("click", () => {
        if (item.is_external) {
          window.location.href = item.route;
        } else {
          // For internal CRM routes, use history API
          window.history.pushState({}, "", item.route);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      });

      nav.appendChild(btn);
    });

    injected = true;
    console.log("Custom CRM menu items injected successfully");
  }

  function getIconSvg(iconName) {
    const icons = {
      "bar-chart-3": `<svg class="size-4 text-ink-gray-7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
      "file-text": `<svg class="size-4 text-ink-gray-7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      settings: `<svg class="size-4 text-ink-gray-7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    };
    return icons[iconName] || icons["bar-chart-3"];
  }

  // Try to inject immediately and then periodically
  function startInjection() {
    // Try immediately
    injectMenuItems();

    // Keep trying every 500ms until successful
    const interval = setInterval(() => {
      if (injected) {
        clearInterval(interval);
        return;
      }
      injectMenuItems();
    }, 500);

    // Stop after 30 seconds
    setTimeout(() => clearInterval(interval), 30000);
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startInjection);
  } else {
    startInjection();
  }

  // Re-inject on SPA navigation
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      if (lastPath.startsWith("/crm")) {
        injected = false;
        startInjection();
      }
    }
  }, 1000);
})();
