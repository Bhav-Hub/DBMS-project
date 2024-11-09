import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentView() {
    const [srn, setSrn] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (srn) => {
        if (!srn) {
            alert("Please enter a valid SRN.");
            return;
        }
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:5000/student?srn=${srn}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchClick = () => {
        fetchData(srn);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Student Data</h2>
            <div>
                <label>
                    Enter Student SRN:
                    <input
                        type="text"
                        value={srn}
                        onChange={(e) => setSrn(e.target.value)}
                        placeholder="Enter SRN"
                    />
                </label>
                <button onClick={handleFetchClick}>Fetch Data</button>
            </div>

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
                                <li key={`${mark.SRN}-${mark.G_id}`}>
                                    SRN: {mark.SRN}, Parameter 1: {mark.Parameter1}, Parameter 2: {mark.Parameter2}, Parameter 3: {mark.Parameter3},Parameter 4: {mark.Parameter4},Average Marks: {mark.Average_Marks}, Assessment: {mark.Assessment_Number}
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
                <div>No data found for the provided SRN.</div>
            )}
        </div>
    );
}

export default StudentView;
