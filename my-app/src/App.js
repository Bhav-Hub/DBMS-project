// App.js
import './styles.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import StudentPage from './StudentPage';
import TeacherPage from './TeacherPage';
import CreateAccountPage from './CreateAccountPage'; // Import the CreateAccountPage component

function App() {
    const [role, setRole] = useState(null);

    return (
        <Router>
            <div className="App">
                <h1>Role-Based Data Access Portal</h1>
                <Routes>
                    <Route path="/" element={<LoginPage setRole={setRole} />} />
                    <Route path="/student" element={role === 'student' ? <StudentPage /> : <LoginPage setRole={setRole} />} />
                    <Route path="/teacher" element={role === 'teacher' ? <TeacherPage /> : <LoginPage setRole={setRole} />} />
                    <Route path="/create-account" element={<CreateAccountPage />} /> {/* Route for the Create Account page */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
