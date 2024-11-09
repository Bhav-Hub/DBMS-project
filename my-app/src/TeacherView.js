import React, { useState } from 'react';
import axios from 'axios';

function TeacherView() {
    const [srn, setSrn] = useState('');
    const [data, setData] = useState(null);

    const fetchData = async (srn) => {
        if (!srn) {
            alert("Please enter a valid SRN.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/teacher?srn=${srn}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData(null);
        }
    };

    const handleFetchClick = () => {
        fetchData(srn);
    };

    return (
        <div>
            <h2>Teacher View</h2>
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
                    <h3>Guides</h3>
                    <ul>
                        {data.guides.length > 0 ? (
                            data.guides.map((guide) => (
                                <li key={guide.G_id}>
                                    {guide.G_name} (ID: {guide.G_id})
                                </li>
                            ))
                        ) : (
                            <p>No guide data available.</p>
                        )}
                    </ul>

                    <h3>Marksheet</h3>
                    <ul>
                        {data.marksheets.length > 0 ? (
                            data.marksheets.map((mark) => (
                                <li key={`${mark.SRN}-${mark.G_id}`}>
                                    SRN: {mark.SRN}, Parameter 1: {mark.Parameter1}, Parameter 2: {mark.Parameter2}, Parameter 3: {mark.Parameter3},Parameter 4: {mark.Parameter4},Average Marks: {mark.Average_Marks}, Assessment: {mark.Assessment_Number}
                                </li>
                            ))
                        ) : (
                            <p>No marksheet data available.</p>
                        )}
                    </ul>

                    <h3>Panels</h3>
                    <ul>
                        {data.panels.length > 0 ? (
                            data.panels.map((panel) => (
                                <li key={panel.Panel_Id}>
                                    Panel {panel.Panel_Id} - Guides: {panel.G_id1}, {panel.G_id2}, {panel.G_id3}
                                </li>
                            ))
                        ) : (
                            <p>No panel data available.</p>
                        )}
                    </ul>
                </div>
            ) : (
                <div>No data found for the provided SRN.</div>
            )}
        </div>
    );
}

export default TeacherView;
