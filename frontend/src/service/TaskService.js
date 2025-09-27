const baseurl = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem("token");


const createTask = async (title, description) => {
    const results = await fetch(`${baseurl}/tasks/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
    });
    console.log(token);

    if (!results.status == 201) {
        throw new Error("Failed to create task");

    }

    const data = await results.json();
    return data;
}


const getAllTasks = async () => {
    const results = await fetch(`${baseurl}/tasks/all-tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!results.ok) {
        throw new Error('Failed to fetch tasks');
    }
    const data = await results.json();
    return data.tasks;
}



const markedAsCompleted = async (id) => {
    const res = await fetch(`${baseurl}/tasks/complete/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error('Failed to marked as completed')
    }

    const data = await res.json();
    return data;

}



const updateTask = async (id, title, description) => {
    const res = await fetch(`${baseurl}/tasks/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
    });
    if (!res.ok) {
        throw new Error('Failed to update task');
    }
    const data = await res.json();
    return data;
}

const deleteTask = async (id) => {
    const res = await fetch(`${baseurl}/tasks/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error('Failed to delete task');
    }
    return null;
}

export { createTask, deleteTask, getAllTasks, markedAsCompleted, updateTask };

