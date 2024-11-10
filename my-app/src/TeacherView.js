import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherView() {
    const [teams, setTeams] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeamSRNs, setSelectedTeamSRNs] = useState([]);
    const [selectedSRN, setSelectedSRN] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);
    const [marksheets, setMarksheets] = useState([]); // State to store marksheets
    const [tId, setTId] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [tDomain, setTDomain] = useState('ML'); // Default domain
    const [selectedSRNs, setSelectedSRNs] = useState({
        SRN1: '',
        SRN2: '',
        SRN3: '',
        SRN4: ''
    });

    // Fetch teams and students when component mounts
    useEffect(() => {
        const gId = localStorage.getItem('UserID');
        if (gId) {
            // Fetch teacher's teams
            axios.get(`http://localhost:5000/teacher-teams?gId=${gId}`)
                .then(response => {
                    setTeams(response.data.teams || []);
                })
                .catch(error => {
                    console.error("Error fetching teams:", error);
                });
    
            // Fetch all students for creating teams (change the endpoint to '/students')
            axios.get('http://localhost:5000/get_student_list')
                .then(response => {
                    console.log("Fetched students: ", response.data.students); // Debugging line
                    setStudents(response.data.students || []);
                })
                .catch(error => {
                    console.error("Error fetching students:", error);
                });
        }
    }, []);
    

    // Handle team selection to populate SRNs
    const handleTeamSelect = (teamSRNs) => {
        setSelectedTeamSRNs(teamSRNs);
        setSelectedSRN('');
        setStudentDetails(null);
        setMarksheets([]); // Reset marksheets when team is changed
    };

    // Fetch student details and marksheets by SRN
    const fetchStudentDetailsAndMarksheets = async (srn) => {
        try {
            const studentResponse = await axios.get(`http://localhost:5000/student-details?srn=${srn}`);
            const marksheetResponse = await axios.get(`http://localhost:5000/marksheet-by-srn?srn=${srn}`);
            setStudentDetails(studentResponse.data.student || null);
            setMarksheets(marksheetResponse.data.marksheets || []); // Set the marksheet data
        } catch (error) {
            console.error("Error fetching student details or marksheets:", error);
        }
    };

    // Handle the submission of a new team
    const handleCreateTeam = (e) => {
        e.preventDefault();
        const gId = localStorage.getItem('UserID'); // Guide ID from localStorage

        const teamData = {
            T_id: tId,
            Project_Title: projectTitle,
            SRN1: selectedSRNs.SRN1,
            SRN2: selectedSRNs.SRN2,
            SRN3: selectedSRNs.SRN3,
            SRN4: selectedSRNs.SRN4,
            T_domain: tDomain,
            G_id: gId
        };

        axios.post('http://localhost:5000/create-team', teamData)
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                alert("Error creating team: " + error.response.data.error);
            });
    };

    return (
        <div>
            <h2>Teacher View</h2>

            {/* Create Team Section */}
            <div>
                <h3>Create Team</h3>
                <form onSubmit={handleCreateTeam}>
                    <div>
                        <label>Team ID:</label>
                        <input 
                            type="text" 
                            value={tId} 
                            onChange={(e) => setTId(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                        <label>Project Title:</label>
                        <input 
                            type="text" 
                            value={projectTitle} 
                            onChange={(e) => setProjectTitle(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                        <label>Domain:</label>
                        <select value={tDomain} onChange={(e) => setTDomain(e.target.value)} required>
                            <option value="ML">ML</option>
                            <option value="CyberSec">CyberSec</option>
                            <option value="Network">Network</option>
                            <option value="Blockchain">Blockchain</option>
                        </select>
                    </div>

                    {['SRN1', 'SRN2', 'SRN3', 'SRN4'].map((srnField, index) => (
                        <div key={index}>
                            <label>Select {srnField}:</label>
                            <select 
                                value={selectedSRNs[srnField]} 
                                onChange={(e) => setSelectedSRNs({
                                    ...selectedSRNs, 
                                    [srnField]: e.target.value
                                })} 
                                required
                            >
                                <option value="">Select SRN</option>
                                {/* Check if students are available */}
                                {students.length > 0 ? (
                                    students.map(student => (
                                        <option key={student.SRN} value={student.SRN}>
                                            {student.SRN} - {student.Name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Loading...</option>
                                )}
                            </select>
                        </div>
                    ))}

                    <button type="submit">Create Team</button>
                </form>
            </div>

            {/* Existing Teacher View Section */}
            <div>
                <h3>Select Team</h3>
                <label>Select Team:</label>
                <select onChange={(e) => handleTeamSelect(teams.find(team => team.T_id === e.target.value)?.SRNs || [])}>
                    <option value="">Select a team</option>
                    {teams.map(team => (
                        <option key={team.T_id} value={team.T_id}>
                            {team.Project_Title} (ID: {team.T_id})
                        </option>
                    ))}
                </select>
            </div>

            {selectedTeamSRNs.length > 0 && (
                <div>
                    <label>Select SRN:</label>
                    <select onChange={(e) => {
                        const srn = e.target.value;
                        setSelectedSRN(srn);
                        fetchStudentDetailsAndMarksheets(srn); // Fetch both student details and marksheets
                    }}>
                        <option value="">Select an SRN</option>
                        {selectedTeamSRNs.map(srn => (
                            <option key={srn} value={srn}>{srn}</option>
                        ))}
                    </select>
                </div>
            )}

            {studentDetails && (
                <div>
                    <h3>Student Details</h3>
                    <p><strong>SRN:</strong> {studentDetails.SRN}</p>
                    <p><strong>Name:</strong> {studentDetails.Name}</p>
                    <p><strong>Email:</strong> {studentDetails.Email}</p>
                    <p><strong>Phone:</strong> {studentDetails.Phone}</p>
                    <p><strong>GPA:</strong> {studentDetails.GPA}</p>
                </div>
            )}

            {marksheets.length > 0 && (
                <div>
                    <h3>Marksheets</h3>
                    {marksheets.map((marksheet, index) => (
                        <div key={index}>
                            <p><strong>Assessment Number:</strong> {marksheet.Assessment_Number}</p>
                            <p><strong>Parameter 1:</strong> {marksheet.Parameter1}</p>
                            <p><strong>Parameter 2:</strong> {marksheet.Parameter2}</p>
                            <p><strong>Parameter 3:</strong> {marksheet.Parameter3}</p>
                            <p><strong>Parameter 4:</strong> {marksheet.Parameter4}</p>
                            <p><strong>Average Marks:</strong> {marksheet.Average_Marks}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TeacherView;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function TeacherView() {
//     const [teams, setTeams] = useState([]);
//     const [students, setStudents] = useState([]);
//     const [selectedTeamSRNs, setSelectedTeamSRNs] = useState([]);
//     const [selectedSRN, setSelectedSRN] = useState('');
//     const [studentDetails, setStudentDetails] = useState(null);
//     const [marksheets, setMarksheets] = useState([]); // State to store marksheets
//     const [tId, setTId] = useState('');
//     const [projectTitle, setProjectTitle] = useState('');
//     const [tDomain, setTDomain] = useState('ML'); // Default domain
//     const [selectedSRNs, setSelectedSRNs] = useState({
//         SRN1: '',
//         SRN2: '',
//         SRN3: '',
//         SRN4: ''
//     });

//     // Fetch teams and students when component mounts
//     useEffect(() => {
//         const gId = localStorage.getItem('UserID');
//         if (gId) {
//             // Fetch teacher's teams
//             axios.get(`http://localhost:5000/teacher-teams?gId=${gId}`)
//                 .then(response => {
//                     setTeams(response.data.teams || []);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching teams:", error);
//                 });

//             // Fetch all students for creating teams (change the endpoint to '/students')
//             axios.get('http://localhost:5000/get_student_list')
//                 .then(response => {
//                     console.log("Fetched students: ", response.data.students); // Debugging line
//                     setStudents(response.data.students || []);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching students:", error);
//                 });
//         }
//     }, []);

//     // Handle team selection to populate SRNs
//     const handleTeamSelect = (teamSRNs) => {
//         setSelectedTeamSRNs(teamSRNs);
//         setSelectedSRN('');
//         setStudentDetails(null);
//         setMarksheets([]); // Reset marksheets when team is changed
//     };

//     // Fetch student details and marksheets by SRN
//     const fetchStudentDetailsAndMarksheets = async (srn) => {
//         try {
//             const studentResponse = await axios.get(`http://localhost:5000/student-details?srn=${srn}`);
//             const marksheetResponse = await axios.get(`http://localhost:5000/marksheet-by-srn?srn=${srn}`);
//             setStudentDetails(studentResponse.data.student || null);
//             setMarksheets(marksheetResponse.data.marksheets || []); // Set the marksheet data
//         } catch (error) {
//             console.error("Error fetching student details or marksheets:", error);
//         }
//     };

//     // Handle the submission of a new team
//     const handleCreateTeam = (e) => {
//         e.preventDefault();
//         const gId = localStorage.getItem('UserID'); // Guide ID from localStorage

//         const teamData = {
//             T_id: tId,
//             Project_Title: projectTitle,
//             SRN1: selectedSRNs.SRN1,
//             SRN2: selectedSRNs.SRN2,
//             SRN3: selectedSRNs.SRN3,
//             SRN4: selectedSRNs.SRN4,
//             T_domain: tDomain,
//             G_id: gId
//         };

//         axios.post('http://localhost:5000/create-team', teamData)
//             .then(response => {
//                 alert(response.data.message);
//             })
//             .catch(error => {
//                 alert("Error creating team: " + error.response.data.error);
//             });
//     };

//     // Filter students based on selected SRNs
//     const getFilteredStudents = (excludeSRNs) => {
//         return students.filter(student => !excludeSRNs.includes(student.SRN));
//     };

//     return (
//         <div>
//             <h2>Teacher View</h2>

//             {/* Create Team Section */}
//             <div>
//                 <h3>Create Team</h3>
//                 <form onSubmit={handleCreateTeam}>
//                     <div>
//                         <label>Team ID:</label>
//                         <input 
//                             type="text" 
//                             value={tId} 
//                             onChange={(e) => setTId(e.target.value)} 
//                             required 
//                         />
//                     </div>

//                     <div>
//                         <label>Project Title:</label>
//                         <input 
//                             type="text" 
//                             value={projectTitle} 
//                             onChange={(e) => setProjectTitle(e.target.value)} 
//                             required 
//                         />
//                     </div>

//                     <div>
//                         <label>Domain:</label>
//                         <select value={tDomain} onChange={(e) => setTDomain(e.target.value)} required>
//                             <option value="ML">ML</option>
//                             <option value="CyberSec">CyberSec</option>
//                             <option value="Network">Network</option>
//                             <option value="Blockchain">Blockchain</option>
//                         </select>
//                     </div>

//                     {['SRN1', 'SRN2', 'SRN3', 'SRN4'].map((srnField, index) => (
//                         <div key={index}>
//                             <label>Select {srnField}:</label>
//                             <select 
//                                 value={selectedSRNs[srnField]} 
//                                 onChange={(e) => setSelectedSRNs({
//                                     ...selectedSRNs, 
//                                     [srnField]: e.target.value
//                                 })} 
//                                 required
//                             >
//                                 <option value="">Select SRN</option>
//                                 {/* Check if students are available */}
//                                 {students.length > 0 ? (
//                                     getFilteredStudents(
//                                         Object.values(selectedSRNs) // Pass all selected SRNs to filter out
//                                     ).map(student => (
//                                         <option key={student.SRN} value={student.SRN}>
//                                             {student.SRN} - {student.Name}
//                                         </option> 
//                                     ))
//                                 ) : (
//                                     <option value="">Loading...</option>
//                                 )}
//                             </select>
//                         </div>
//                     ))}

//                     <button type="submit">Create Team</button>
//                 </form>
//             </div>

//             {/* Existing Teacher View Section */}
//             <div>
//                 <h3>Select Team</h3>
//                 <label>Select Team:</label>
//                 <select onChange={(e) => handleTeamSelect(teams.find(team => team.T_id === e.target.value)?.SRNs || [])}>
//                     <option value="">Select a team</option>
//                     {teams.map(team => (
//                         <option key={team.T_id} value={team.T_id}>
//                             {team.Project_Title} (ID: {team.T_id})
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {selectedTeamSRNs.length > 0 && (
//                 <div>
//                     <label>Select SRN:</label>
//                     <select onChange={(e) => {
//                         const srn = e.target.value;
//                         setSelectedSRN(srn);
//                         fetchStudentDetailsAndMarksheets(srn); // Fetch both student details and marksheets
//                     }}>
//                         <option value="">Select an SRN</option>
//                         {selectedTeamSRNs.map(srn => (
//                             <option key={srn} value={srn}>{srn}</option>
//                         ))}
//                     </select>
//                 </div>
//             )}

//             {studentDetails && (
//                 <div>
//                     <h3>Student Details</h3>
//                     <p><strong>SRN:</strong> {studentDetails.SRN}</p>
//                     <p><strong>Name:</strong> {studentDetails.Name}</p>
//                     <p><strong>Email:</strong> {studentDetails.Email}</p>
//                     <p><strong>Phone:</strong> {studentDetails.Phone}</p>
//                     <p><strong>GPA:</strong> {studentDetails.GPA}</p>
//                 </div>
//             )}

//             {marksheets.length > 0 && (
//                 <div>
//                     <h3>Marksheets</h3>
//                     {marksheets.map((marksheet, index) => (
//                         <div key={index}>
//                             <p><strong>Assessment Number:</strong> {marksheet.Assessment_Number}</p>
//                             <p><strong>Parameter 1:</strong> {marksheet.Parameter1}</p>
//                             <p><strong>Parameter 2:</strong> {marksheet.Parameter2}</p>
//                             <p><strong>Parameter 3:</strong> {marksheet.Parameter3}</p>
//                             <p><strong>Parameter 4:</strong> {marksheet.Parameter4}</p>
//                             <p><strong>Average Marks:</strong> {marksheet.Average_Marks}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default TeacherView;




