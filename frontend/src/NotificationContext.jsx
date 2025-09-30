import { useEffect } from "react";
import logo from "./assets/taskflow-logo.jpg";

export const NotificationsProvider = ({ children }) => {
  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission();

    const interval = setInterval(() => {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const today = new Date().toISOString().split("T")[0];

      const pendingTasks = tasks.filter((t) => {
        const taskDate = t.createdAt?.split("T")[0];
        return !t.completed && taskDate === today;
      });

      if (pendingTasks.length > 0 && Notification.permission === "granted") {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SHOW_NOTIFICATION",
            payload: {
              title: "TaskFlow Reminder",
              body: `You have ${pendingTasks.length} pending tasks for today!`,
              icon: logo,
            },
          });
        }
      }
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  return children;
};
