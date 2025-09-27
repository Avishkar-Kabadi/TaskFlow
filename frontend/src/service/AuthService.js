
const token = localStorage.getItem("token");

const baseurl = import.meta.env.VITE_BASE_URL;

const loginUser = async (email, password) => {
    const results = await fetch(`${baseurl}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!results.ok) {
        throw new Error('Login failed');
    }

    const data = await results.json();
    return data;
}

const registerUser = async (name, email, password) => {
    const results = await fetch(`${baseurl}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });
    if (!results.status == 201) {
        throw new Error('Registration failed');
    }
    const data = await results.json();
    return data;
}


const logoutUser = async () => {
    const results = await fetch(`${baseurl}/users/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!results.ok) {
        throw new Error('Logout failed');
    }
}


export { loginUser, logoutUser, registerUser };


