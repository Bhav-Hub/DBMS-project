import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setRole }) {

    const [password, setPassword] = useState('');  // Password field
    const [srn, setSrn] = useState('');  // For student SRN
    const [gId, setGId] = useState('');  // For teacher G_ID
    const [userRole, setUserRole] = useState('student');  // Default role is 'student'
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Validate input fields
        if (!password) {
            alert("Please enter your password.");
            return;
        }

        // Prepare the login data based on role
        const loginData = {
            password,
            role: userRole,
            srn: userRole === 'student' ? srn : undefined,
            gId: userRole === 'teacher' ? gId : undefined
        };

        try {
            const response = await fetch('http://localhost:5000/handlelogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.status === 201) {
                // If login is successful, set the role and navigate
                setRole(userRole);
                if (userRole === 'student') {
                    navigate('/student');
                } else {
                    navigate('/teacher');
                }
            } else {
                // Handle error messages
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your request.');
        }
    };

    const handleCreateAccount = () => {
        // Redirect to the account creation page
        navigate('/create-account');
    };

    return (
        <div>
            <h2>Login</h2>

            <label>
                Select Role:
                <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </label>
            <br />

            {userRole === 'student' ? (
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
                Password:
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter Password"
                />
            </label>
            <br />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleCreateAccount}>Create Account</button>
        </div>
    );
}

export default LoginPage;

