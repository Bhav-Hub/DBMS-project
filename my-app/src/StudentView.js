// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './StudentView.css';

// function StudentView() {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const userID = localStorage.getItem('UserID');  // Retrieve stored UserID

//         if (userID) {
//             fetchData(userID);
//         } else {
//             console.error("No UserID found. Please log in.");
//         }
//     }, []);

//     const fetchData = async (userID) => {
//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:5000/student', { UserID: userID });
//             setData(response.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setData(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="loading">Loading...</div>;

//     return (
//         <div className="student-container">
//             <h2>Student Data</h2>

//             {data ? (
//                 <div>
//                     <h3>Student Information</h3>
//                     <div>
//                         <p><strong>SRN:</strong> {data.student.SRN}</p>
//                         <p><strong>Name:</strong> {data.student.Name}</p>
//                         <p><strong>Email:</strong> {data.student.Email}</p>
//                         <p><strong>Phone:</strong> {data.student.Phone}</p>
//                         <p><strong>GPA:</strong> {data.student.GPA}</p>
//                     </div>

//                     <h3>Marksheet</h3>
//                     {data.marksheets.length > 0 ? (
//                         <div className="marksheet-list">
//                             {data.marksheets.map((mark) => (
//                                 <div key={`${mark.SRN}-${mark.Assessment_Number}`} className="marksheet-item">
//                                     <p><strong>Assessment Number:</strong> {mark.Assessment_Number}</p>
//                                     <p><strong>Parameter 1:</strong> {mark.Parameter1}</p>
//                                     <p><strong>Parameter 2:</strong> {mark.Parameter2}</p>
//                                     <p><strong>Parameter 3:</strong> {mark.Parameter3}</p>
//                                     <p><strong>Parameter 4:</strong> {mark.Parameter4}</p>
//                                     <p><strong>Average Marks:</strong> {mark.Average_Marks}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p>No marksheet data available.</p>
//                     )}


//                     <h3>Team</h3>
//                     {data.teams.length > 0 ? (
//                         <ul>
//                             {data.teams.map((team) => (
//                                 <li key={team.T_id}>
//                                     Project Title: {team.Project_Title} (Team ID: {team.T_id})
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No team data available.</p>
//                     )}

//                     <h3>Guide</h3>
//                     {data.guides.length > 0 ? (
//                         <ul>
//                             {data.guides.map((guide) => (
//                                 <li key={guide.G_id}>
//                                     Guide ID: {guide.G_id}, Name: {guide.G_level} {guide.G_name}, Domain: {guide.G_domain}
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No guide data available.</p>
//                     )}
//                 </div>
//             ) : (
//                 <div>No data found for the provided UserID.</div>
//             )}
//         </div>
//     );
// }

// export default StudentView;




























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentView.css'; // Import the CSS file

function StudentView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('studentInfo'); // State to track active tab

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

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="student-view-container">
            <h2>Student View</h2>

            {/* Navigation Buttons */}
            <div className="nav-buttons">
                <button onClick={() => setActiveTab('studentInfo')}>Student Information</button>
                <button onClick={() => setActiveTab('marksheet')}>Marksheet</button>
                <button onClick={() => setActiveTab('team')}>Team</button>
                <button onClick={() => setActiveTab('guide')}>Guide</button>
            </div>

            {/* Conditional Rendering of Content Based on Active Tab */}
            {activeTab === 'studentInfo' && (
                <div className="active-tab">
                    <h3>Student Information</h3>
                    {data ? (
                        <div className="box">
                            <p><strong>SRN:</strong> {data.student.SRN}</p>
                            <p><strong>Name:</strong> {data.student.Name}</p>
                            <p><strong>Email:</strong> {data.student.Email}</p>
                            <p><strong>Phone:</strong> {data.student.Phone}</p>
                            <p><strong>GPA:</strong> {data.student.GPA}</p>
                        </div>
                    ) : (
                        <p>No data found for the provided UserID.</p>
                    )}
                </div>
            )}

            {activeTab === 'marksheet' && (
                <div className="active-tab">
                    <h3>Marksheet</h3>
                    {data && data.marksheets.length > 0 ? (
                        <div className="list">
                            {data.marksheets.map((mark) => (
                                <div key={`${mark.SRN}-${mark.Assessment_Number}`} className="box">
                                    <p><strong>Assessment Number:</strong> {mark.Assessment_Number}</p>
                                    <p><strong>Parameter 1:</strong> {mark.Parameter1}</p>
                                    <p><strong>Parameter 2:</strong> {mark.Parameter2}</p>
                                    <p><strong>Parameter 3:</strong> {mark.Parameter3}</p>
                                    <p><strong>Parameter 4:</strong> {mark.Parameter4}</p>
                                    <p><strong>Average Marks:</strong> {mark.Average_Marks}</p>

                                    {/* Conditional rendering of semester grade based on Assessment_Number */}
                                    {mark.Assessment_Number === 3 && (
                                        <p><strong>Semester 5:</strong> {mark.Semester_Grade}</p>
                                    )}
                                    {mark.Assessment_Number === 6 && (
                                        <p><strong>Semester 6:</strong> {mark.Semester_Grade}</p>
                                    )}
                                    {mark.Assessment_Number === 9 && (
                                        <p><strong>Semester 7:</strong> {mark.Semester_Grade}</p>
                                    )}
                                    {mark.Assessment_Number === 11 && (
                                        <p><strong>Semester 8:</strong> {mark.Semester_Grade}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No marksheet data available.</p>
                    )}
                </div>
            )}


            {activeTab === 'team' && (
                <div className="active-tab">
                    <h3>Team</h3>
                    {data && data.teams.length > 0 ? (
                        <div className="list">
                            {data.teams.map((team) => (
                                <div key={team.T_id} className="box">
                                    <p><strong>Team ID:</strong> {team.T_id}</p>
                                    <p><strong>Project Title:</strong> {team.Project_Title}</p>
                                    <p><strong>Member 1:</strong> {team.SRN1}</p>
                                    <p><strong>Member 2:</strong> {team.SRN2}</p>
                                    <p><strong>Member 3:</strong> {team.SRN3}</p>
                                    <p><strong>Member 4:</strong> {team.SRN4}</p>
                                    <p><strong>Project Domain:</strong> {team.T_domain}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No team data available.</p>
                    )}
                </div>
            )}

            {activeTab === 'guide' && (
                <div className="active-tab">
                    <h3>Guide</h3>
                    {data && data.guides.length > 0 ? (
                        data.guides.map((guide) => (
                            <div key={guide.G_id} className="box">
                                <p><strong>Guide ID:</strong> {guide.G_id}</p>
                                <p><strong>Name:</strong> {guide.G_level} {guide.G_name}</p>
                                <p><strong>Domain:</strong> {guide.G_domain}</p>
                            </div>
                        ))
                    ) : (
                        <p>No guide data available.</p>
                    )}
                </div>
            )}

        </div>
    );
}

export default StudentView;
