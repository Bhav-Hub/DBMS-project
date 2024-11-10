import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setRole }) {

    const [password, setPassword] = useState('');
    const [srn, setSrn] = useState('');
    const [gId, setGId] = useState('');
    const [userRole, setUserRole] = useState('student');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!password) {
            alert("Please enter your password.");
            return;
        }

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
                setRole(userRole);

                // Store the UserID (SRN for students, G_ID for teachers) in localStorage
                if (userRole === 'student') {
                    localStorage.setItem('UserID', srn);
                    navigate('/student');
                } else {
                    localStorage.setItem('UserID', gId);
                    navigate('/teacher');
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your request.');
        }
    };

    const handleCreateAccount = () => {
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
            
            {/* Create Account Button */}
            <div style={{ marginTop: '10px' }}>
                <button onClick={handleCreateAccount}>Create Account</button>
            </div>
        </div>
    );
}

export default LoginPage;

