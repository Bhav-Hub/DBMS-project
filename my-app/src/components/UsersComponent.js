// my-app/src/components/UsersComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersComponent() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', { name, email });
            setName('');
            setEmail('');
            fetchUsers();  // Refresh users list
        } catch (error) {
            console.error("Error creating user", error);
        }
    };

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name} - {user.email}</li>
                ))}
            </ul>
            
            <form onSubmit={handleCreateUser}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}

export default UsersComponent;
