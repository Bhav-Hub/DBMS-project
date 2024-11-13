    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import './TeacherView.css'; // Import the new CSS

    function TeacherView() {
        const [teams, setTeams] = useState([]);
        const [students, setStudents] = useState([]);
        const [selectedTeamSRNs, setSelectedTeamSRNs] = useState([]);
        const [selectedSRN, setSelectedSRN] = useState('');
        const [studentDetails, setStudentDetails] = useState(null);
        const [marksheets, setMarksheets] = useState([]);
        const [marksheetData, setMarksheetData] = useState({
            Assessment_Number: '',
            Parameter1: '',
            Parameter2: '',
            Parameter3: '',
            Parameter4: '',
        });

        const [tId, setTId] = useState('');
        const [projectTitle, setProjectTitle] = useState('');
        const [tDomain, setTDomain] = useState('ML');
        const [selectedSRNs, setSelectedSRNs] = useState({
            SRN1: '',
            SRN2: '',
            SRN3: '',
            SRN4: ''
        });
        
        const [activeTab, setActiveTab] = useState('createTeam'); // State to track active tab
        const [action, setAction] = useState(''); // To track the action: 'viewMarksheet' or 'addMarks'


        const [filteredStudent, setfilteredStudents] = useState('');
        


        // Fetch teams and students when component mounts
        useEffect(() => {
            const gId = localStorage.getItem('UserID');
            if (gId) {
                axios.get(`http://localhost:5000/teacher-teams?gId=${gId}`)
                    .then(response => {
                        setTeams(response.data.teams || []);
                    })
                    .catch(error => {
                        console.error("Error fetching teams:", error);
                    });

                axios.get('http://localhost:5000/get_student_list')
                    .then(response => {
                        setStudents(response.data.students || []);
                    })
                    .catch(error => {
                        console.error("Error fetching students:", error);
                    });
            }
        }, []);

        const handleTeamSelect = (teamSRNs) => {
            setSelectedTeamSRNs(teamSRNs);
            setSelectedSRN('');
            setStudentDetails(null);
            setMarksheets([]);
        };









        const [selectedGrade, setSelectedGrade] = useState('S');
        const [gradeStudent, setgradeStudents] = useState([]);



        const handleGradeSubmit = (e) => {
            e.preventDefault();
            const gId = localStorage.getItem('UserID');
            axios.get(`http://localhost:5000/get_students_by_grade?grade=${selectedGrade}&guide_id=${gId}`)
                .then(response => {
                    // Convert the response data into an array of objects with properties like SRN, Name, Team_ID, etc.
                    const gradeStudents = response.data.map(student => ({
                        SRN: student[0],           // First element is SRN
                        Name: student[1],          // Second element is Name
                        Team_ID: student[2],       // Third element is Team ID
                        Project_Title: student[3]  // Fourth element is Project Title
                    }));
        
                    setgradeStudents(gradeStudents);  // Update state with the structured data
                })
                .catch(error => {
                    console.error("Error filtering students by grade:", error);
                });
        };        

        const handleGradeChange = (e) => {
            setSelectedGrade(e.target.value);
        };
    





        const fetchStudentDetailsAndMarksheets = async (srn) => {
            try {
                const studentResponse = await axios.get(`http://localhost:5000/student-details?srn=${srn}`);
                const marksheetResponse = await axios.get(`http://localhost:5000/marksheet-by-srn?srn=${srn}`);
                setStudentDetails(studentResponse.data.student || null);
                setMarksheets(marksheetResponse.data.marksheets || []);
            } catch (error) {
                console.error("Error fetching student details or marksheets:", error);
            }
        };

        const handleCreateTeam = (e) => {
            e.preventDefault();
            const gId = localStorage.getItem('UserID');

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

        
        

        const handleMarksheetSubmit = async (e) => {
            e.preventDefault();
            const gId = localStorage.getItem('UserID');
            const data = {
                ...marksheetData,
                SRN: selectedSRN,
                G_id: gId
            };

            try {
                const response = await axios.post('http://localhost:5000/add-marksheet', data);
                alert(response.data.message);
                fetchStudentDetailsAndMarksheets(selectedSRN);
            } catch (error) {
                console.error("Error adding marksheet:", error);
                alert("Error adding marksheet");
            }
        };

        const handleMarksheetChange = (e) => {
            const { name, value } = e.target;
            setMarksheetData(prevState => ({
                ...prevState,
                [name]: value
            }));
        };
        
        return (
            <div className="teacher-view-container">
                <h2>Teacher View</h2>

                {/* Navigation Buttons */}
                <div className="nav-buttons">
                    <button onClick={() => setActiveTab('createTeam')}>Create Team</button>
                    <button onClick={() => setActiveTab('viewTeam')}>View Team</button>
                    <button onClick={() => setActiveTab('filterByGrades')}>Filter By Grades</button>
                </div>

                {/* Conditional Rendering of Content Based on Active Tab */}
                {activeTab === 'createTeam' && (
                    <div className="active-tab">
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
                                        {students.map(student => (
                                            <option key={student.SRN} value={student.SRN}>
                                                {student.SRN} - {student.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}

                {activeTab === 'viewTeam' && (
                    <div className="active-tab">
                        <h3>View Team</h3>

                        {/* Select Team */}
                        <div>
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

                        {/* Select SRN */}
                        {selectedTeamSRNs.length > 0 && (
                            <div>
                                <label>Select SRN:</label>
                                <select onChange={(e) => {
                                    const srn = e.target.value;
                                    setSelectedSRN(srn);
                                    fetchStudentDetailsAndMarksheets(srn);
                                }}>
                                    <option value="">Select an SRN</option>
                                    {selectedTeamSRNs.map(srn => (
                                        <option key={srn} value={srn}>{srn}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* View Marksheet and Add Marks buttons */}
                        {selectedSRN && (
                            <div className='nav-buttons'>
                                <button onClick={() => setAction('viewMarksheet')}>View Marksheet</button>
                                <button onClick={() => setAction('addMarks')}>Add Marks</button>
                                <br></br>
                                <br></br>
                            </div>
                        )}

                        {/* Show Marksheet */}
                        {action === 'viewMarksheet' && marksheets.length > 0 && (
                        <div className="marksheet-container">
                            <h3>Marksheets</h3>
                            {marksheets.map((marksheet, index) => (
                                <div key={index} className="marksheet-box">
                                    <p><strong>Assessment Number:</strong> {marksheet.Assessment_Number}</p>
                                    <p><strong>Parameter 1:</strong> {marksheet.Parameter1}</p>
                                    <p><strong>Parameter 2:</strong> {marksheet.Parameter2}</p>
                                    <p><strong>Parameter 3:</strong> {marksheet.Parameter3}</p>
                                    <p><strong>Parameter 4:</strong> {marksheet.Parameter4}</p>

                                    {/* Display semester and grade based on assessment number */}
                                    {marksheet.Assessment_Number === 3 && marksheet.Semester && marksheet.Grade && (
                                        <>
                                            <br></br>
                                            <p><strong>Semester 5:</strong> {marksheet.Grade}</p>
                                        </>
                                    )}
                                    {marksheet.Assessment_Number === 6 && marksheet.Semester && marksheet.Grade && (
                                        <>
                                            <br></br>
                                            <p><strong>Semester 6:</strong> {marksheet.Grade}</p>
                                        </>
                                    )}
                                    {marksheet.Assessment_Number === 9 && marksheet.Semester && marksheet.Grade && (
                                        <>
                                            <br></br>
                                            <p><strong>Semester 7:</strong> {marksheet.Grade}</p>
                                        </>
                                    )}
                                    {marksheet.Assessment_Number === 11 && marksheet.Semester && marksheet.Grade && (
                                        <>
                                            <br></br>
                                            <p><strong>Semester 8:</strong> {marksheet.Grade}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}


                        {/* Add Marks Form */}
                        {action === 'addMarks' && selectedSRN && (
                            <div className="add-marks-form">
                                <h3>Add Marks</h3>
                                <form onSubmit={handleMarksheetSubmit}>
                                    <div>
                                        <label>Assessment Number:</label>
                                        <input
                                            type="text"
                                            name="Assessment_Number"
                                            value={marksheetData.Assessment_Number}
                                            onChange={handleMarksheetChange}
                                            required
                                        />
                                    </div>
                                    {['Parameter1', 'Parameter2', 'Parameter3', 'Parameter4'].map((param, index) => (
                                        <div key={index}>
                                            <label>{param}:</label>
                                            <input
                                                type="text"
                                                name={param}
                                                value={marksheetData[param]}
                                                onChange={handleMarksheetChange}
                                                required
                                            />
                                        </div>
                                    ))}
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                
               
                    {activeTab === 'filterByGrades' && (
                        <div className="marksheet-container">
                            <h3>Filter Students by Grade</h3>
                            <form onSubmit={handleGradeSubmit}>
                                <div>
                                    <label>Grade:</label>
                                    <select
                                        name="grade"
                                        value={selectedGrade}
                                        onChange={handleGradeChange}
                                        required
                                    >
                                        <option value="S">S</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                        <option value="F">F</option>
                                    </select>
                                </div>
                                <button type="submit">Filter</button>
                            </form>

                            {/* Render the filtered students */}
                            <div className="marksheet-container">
                                <h3>Students</h3>
                                {gradeStudent.length > 0 ? (
                                    gradeStudent.map((student, index) => (
                                        <div key={index} className="marksheet-box">
                                            <p><strong>SRN:</strong> {student.SRN}</p>
                                            <p><strong>Name:</strong> {student.Name}</p>
                                            <p><strong>Team ID:</strong> {student.Team_ID}</p>
                                            <p><strong>Project Title:</strong> {student.Project_Title}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No students found for the selected grade.</p>
                                )}
                            </div>
                        </div>
                    )}






                
            </div>
        );
    }

    export default TeacherView;
