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
    const data = await results.json();

    if (!results.status == 201) {
        throw new Error(data.message || "Failed to create task");

    }

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
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Failed to marked as completed')
    }

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
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Failed to update task');
    }
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
    const errorData = await res.json()
    if (!res.ok) {
        throw new Error(errorData.message || 'Failed to delete task');
    }
    return null;
}

export { createTask, deleteTask, getAllTasks, markedAsCompleted, updateTask };

