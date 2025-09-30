self.addEventListener("install", () => {
  console.log("Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated.");
});

// Handle messages from React app
self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    const { title, body, icon } = event.data.payload;
    self.registration.showNotification(title, {
      body,
      icon,
      vibrate: [200, 100, 200], // optional: vibration on mobile
    });
  }
});
