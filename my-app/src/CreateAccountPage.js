// CreateAccountPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateAccountPage() {
    const [role, setRole] = useState('student');  // Default role is 'student'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [srn, setSrn] = useState('');  // For student SRN
    const [name, setName] = useState('');  // For student name
    const [phone, setPhone] = useState('');  // For student phone
    const [gpa, setGpa] = useState('');  // For student GPA
    const [gId, setGId] = useState('');  // For teacher Guide ID
    const [gName, setGName] = useState('');  // For teacher Guide name
    const [gDomain, setGDomain] = useState('ML');  // Default guide domain
    const [gLevel, setGLevel] = useState('Professor');  // Default guide level

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
            ...(role === 'student' 
                ? { srn, name, phone, gpa } 
                : { gId, gName, gDomain, gLevel })
        };

        try {
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
                    <label>
                        Name:
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter Name"
                        />
                    </label>
                    <br />
                    <label>
                        Phone:
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="Enter Phone Number"
                        />
                    </label>
                    <br />
                    <label>
                        GPA:
                        <input 
                            type="number" 
                            value={gpa} 
                            onChange={(e) => setGpa(e.target.value)} 
                            placeholder="Enter GPA"
                            step="0.01"
                            min="0.00"
                            max="10.00"
                        />
                    </label>
                    <br />
                </div>
            ) : (
                <div>
                    <label>
                        Guide ID:
                        <input 
                            type="text" 
                            value={gId} 
                            onChange={(e) => setGId(e.target.value)} 
                            placeholder="Enter Guide ID"
                        />
                    </label>
                    <br />
                    <label>
                        Guide Name:
                        <input 
                            type="text" 
                            value={gName} 
                            onChange={(e) => setGName(e.target.value)} 
                            placeholder="Enter Guide Name"
                        />
                    </label>
                    <br />
                    <label>
                        Guide Domain:
                        <select value={gDomain} onChange={(e) => setGDomain(e.target.value)}>
                            <option value="ML">ML</option>
                            <option value="CyberSec">CyberSec</option>
                            <option value="Network">Network</option>
                            <option value="Blockchain">Blockchain</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Guide Level:
                        <select value={gLevel} onChange={(e) => setGLevel(e.target.value)}>
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                        </select>
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



