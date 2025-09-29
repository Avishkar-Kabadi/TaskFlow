// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import Home from "./pages/home/Home";
// import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";

// import { useAuth } from "./AuthContext";

// export default function App() {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
//         />
//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
//         />
//         <Route
//           path="/register"
//           element={isAuthenticated ? <Navigate to="/home" /> : <Register />}
//         />
//         <Route
//           path="/home"
//           element={!isAuthenticated ? <Navigate to="/login" /> : <Home />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { getTasksFromLocal, saveTasksToLocal } from "./service/TaskService";

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const baseurl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission();

    const interval = setInterval(() => {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const pendingTasks = tasks.filter((t) => !t.completed);

      if (pendingTasks.length > 0 && Notification.permission === "granted") {
        new Notification("TaskFlow Reminder", {
          body: `You have ${pendingTasks.length} pending tasks!`,
          icon: "/logo.png",
        });
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const syncOfflineTasks = async () => {
      const tasks = getTasksFromLocal();
      const offlineTasks = tasks.filter((t) => t.offline);

      for (const t of offlineTasks) {
        try {
          const res = await fetch(`${baseurl}/tasks/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: t.title,
              description: t.description,
            }),
          });

          if (res.ok) {
            const data = await res.json();

            const updatedTasks = tasks.map((task) =>
              task._id === t._id ? data.task : task
            );
            saveTasksToLocal(updatedTasks);
          }
        } catch (err) {
          console.error("Failed to sync task", t, err);
        }
      }
    };

    window.addEventListener("online", syncOfflineTasks);

    return () => window.removeEventListener("online", syncOfflineTasks);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/home" /> : <Register />}
        />
        <Route
          path="/home"
          element={!isAuthenticated ? <Navigate to="/login" /> : <Home />}
        />
      </Routes>
    </BrowserRouter>
  );
}
