const baseurl = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

const getTasksFromLocal = () => {
    try {
        const data = localStorage.getItem("tasks");
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error("Failed to parse tasks from localStorage", err);
        return [];
    }
};

const saveTasksToLocal = (tasks) => {
    if (!Array.isArray(tasks)) {
        console.error("Trying to save invalid tasks to localStorage:", tasks);
        return;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
};


const createTask = async (title, description) => {
    let localTasks = getTasksFromLocal() || [];
    console.log("Before push, localTasks:", localTasks);

    try {
        const res = await fetch(`${baseurl}/tasks/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken() || ""}`
            },
            body: JSON.stringify({ title, description })
        });

        if (!res.ok) throw new Error("Failed to create task");

        const data = await res.json();
        console.log("Backend response:", data);

        if (!data.task) throw new Error("Backend did not return task");

        localTasks.push(data.task);
        saveTasksToLocal(localTasks);
        console.log("Local tasks after push backend task:", localTasks);
        return data;

    } catch (err) {
        console.warn("Offline mode: saving task locally", err);

        const offlineTask = {
            _id: `offline-${Date.now()}`,
            title,
            description,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            offline: true
        };

        localTasks.push(offlineTask);
        saveTasksToLocal(localTasks);
        console.log("Local tasks after push offline task:", localTasks);
        console.log("localStorage now:", localStorage.getItem("tasks"));

        return { task: offlineTask, offline: true };
    }
};





const getAllTasks = async () => {
    try {
        const res = await fetch(`${baseurl}/tasks/all-tasks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = await res.json();

        saveTasksToLocal(data.tasks);

        return data.tasks;
    } catch (err) {
        console.warn("Offline mode: fetching tasks from localStorage", err);
        return getTasksFromLocal();
    }
};

const markedAsCompleted = async (id) => {
    try {
        const res = await fetch(`${baseurl}/tasks/complete/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!res.ok) throw new Error("Failed to mark task as completed");

        const data = await res.json();

        const localTasks = getTasksFromLocal().map((task) =>
            task._id === id ? { ...task, completed: true } : task
        );
        saveTasksToLocal(localTasks);

        return data;
    } catch (err) {
        console.warn("Offline mode: marking local task completed", err);

        const localTasks = getTasksFromLocal().map((task) =>
            task._id === id ? { ...task, completed: true, offline: true } : task
        );
        saveTasksToLocal(localTasks);

        return { success: true, offline: true };
    }
};

const updateTask = async (id, title, description) => {
    try {
        const res = await fetch(`${baseurl}/tasks/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({ title, description })
        });

        if (!res.ok) throw new Error("Failed to update task");

        const data = await res.json();

        const localTasks = getTasksFromLocal().map((task) =>
            task._id === id ? { ...task, title, description } : task
        );
        saveTasksToLocal(localTasks);

        return data;
    } catch (err) {
        console.warn("Offline mode: updating local task", err);

        const localTasks = getTasksFromLocal().map((task) =>
            task._id === id ? { ...task, title, description, offline: true } : task
        );
        saveTasksToLocal(localTasks);

        return { success: true, offline: true };
    }
};

const deleteTask = async (id) => {
    try {
        const res = await fetch(`${baseurl}/tasks/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!res.ok) throw new Error("Failed to delete task");

        const localTasks = getTasksFromLocal().filter((task) => task._id !== id);
        saveTasksToLocal(localTasks);

        return null;
    } catch (err) {
        console.warn("Offline mode: deleting local task", err);

        const localTasks = getTasksFromLocal().filter((task) => task._id !== id);
        saveTasksToLocal(localTasks);

        return { success: true, offline: true };
    }
};

export { createTask, deleteTask, getAllTasks, getTasksFromLocal, markedAsCompleted, saveTasksToLocal, updateTask };

