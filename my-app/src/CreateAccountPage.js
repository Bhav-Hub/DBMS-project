// CreateAccountPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateAccountPage() {
    const [role, setRole] = useState('student');  // Default role is 'student'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [srn, setSrn] = useState('');  // For student SRN
    const [gId, setGId] = useState('');  // For teacher G_ID
    const navigate = useNavigate();

    const handleCreateAccount = async () => {
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const data = {
            email,
            password,
            role,
            ...(role === 'student' ? { srn } : { gId })
        };

        try {
            // Send the account creation request to the backend (adjust the endpoint as needed)
            const response = await axios.post('http://localhost:5000/create-account', data);

            if (response.status === 201) {
                alert("Account created successfully! You can now log in.");
                navigate('/');  // Redirect to login page after successful account creation
            } else {
                alert("Error creating account.");
            }
        } catch (error) {
            console.error("Error creating account:", error);
            alert("An error occurred while creating the account.");
        }
    };

    return (
        <div>
            <h2>Create Account</h2>
            <label>
                Select Role:
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </label>
            <br />
            
            {role === 'student' ? (
                <div>
                    <label>
                        SRN:
                        <input 
                            type="text" 
                            value={srn} 
                            onChange={(e) => setSrn(e.target.value)} 
                            placeholder="Enter SRN"
                        />
                    </label>
                    <br />
                </div>
            ) : (
                <div>
                    <label>
                        G_ID:
                        <input 
                            type="text" 
                            value={gId} 
                            onChange={(e) => setGId(e.target.value)} 
                            placeholder="Enter G_ID"
                        />
                    </label>
                    <br />
                </div>
            )}

            <label>
                Email:
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter Email"
                />
            </label>
            <br />

            <label>
                Password:
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter Password"
                />
            </label>
            <br />

            <button onClick={handleCreateAccount}>Create Account</button>
        </div>
    );
}

export default CreateAccountPage;
