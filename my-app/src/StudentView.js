

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userID = localStorage.getItem('UserID');  // Retrieve stored UserID

        if (userID) {
            fetchData(userID);
        } else {
            console.error("No UserID found. Please log in.");
        }
    }, []);

    const fetchData = async (userID) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/student', { UserID: userID });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Student Data</h2>

            {data ? (
                <div>
                    <h3>Student Information</h3>
                    <div>
                        <p><strong>SRN:</strong> {data.student.SRN}</p>
                        <p><strong>Name:</strong> {data.student.Name}</p>
                        <p><strong>Email:</strong> {data.student.Email}</p>
                        <p><strong>Phone:</strong> {data.student.Phone}</p>
                        <p><strong>GPA:</strong> {data.student.GPA}</p>
                    </div>

                    <h3>Marksheet</h3>
                    {data.marksheets.length > 0 ? (
                        <ul>
                            {data.marksheets.map((mark) => (
                                <li key={`${mark.SRN}-${mark.Assessment_Number}`}>
                                    SRN: {mark.SRN}, Parameter 1: {mark.Parameter1}, Parameter 2: {mark.Parameter2}, Parameter 3: {mark.Parameter3}, Parameter 4: {mark.Parameter4}, Average Marks: {mark.Average_Marks}, Assessment: {mark.Assessment_Number}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No marksheet data available.</p>
                    )}

                    <h3>Teams</h3>
                    {data.teams.length > 0 ? (
                        <ul>
                            {data.teams.map((team) => (
                                <li key={team.T_id}>
                                    Project Title: {team.Project_Title} (Team ID: {team.T_id})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No team data available.</p>
                    )}
                </div>
            ) : (
                <div>No data found for the provided UserID.</div>
            )}
        </div>
    );
}

export default StudentView;



