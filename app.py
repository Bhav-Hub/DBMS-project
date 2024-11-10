from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '7151'
app.config['MYSQL_DB'] = 'CAPSTONERS'

mysql = MySQL(app)





# Modify the '/student' endpoint to retrieve user data based on the logged-in UserID
@app.route('/student', methods=['POST'])
def student_view():
    data = request.get_json()  # Get JSON data from request
    user_id = data.get('UserID')  # Extract UserID directly from the request body

    if not user_id:
        return jsonify({"error": "UserID is required"}), 400

    results = {}

    # Fetch data for student based on UserID (assumed to be SRN)
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM student WHERE SRN = %s", (user_id,))
    student = cur.fetchone()
    if student:
        results['student'] = {
            'SRN': student[0], 'Name': student[1], 'Email': student[2], 'Phone': student[3], 'GPA': student[4]
        }
    else:
        return jsonify({"error": "Student not found"}), 404

    # Fetch marksheet data for the student
    cur.execute("SELECT * FROM marksheet WHERE SRN = %s", (user_id,))
    marksheets = cur.fetchall()
    results['marksheets'] = [
        {
            'SRN': row[0], 'G_id': row[1], 'T_id': row[2], 'Assessment_Number': row[3],
            'Parameter1': row[4], 'Parameter2': row[5], 'Parameter3': row[6], 'Parameter4': row[7],
            'Average_Marks': row[8]
        } for row in marksheets
    ]

    # Fetch team data for the student
    cur.execute("""
        SELECT * FROM team WHERE SRN1 = %s OR SRN2 = %s OR SRN3 = %s OR SRN4 = %s
    """, (user_id, user_id, user_id, user_id))
    teams = cur.fetchall()
    results['teams'] = [
        {
            'T_id': row[0], 'Project_Title': row[1], 'SRN1': row[2], 'SRN2': row[3],
            'SRN3': row[4], 'SRN4': row[5], 'G_id': row[6], 'T_domain': row[7]
        } for row in teams
    ]

    cur.close()
    return jsonify(results)





# Endpoint for teacher view with SRN filter
@app.route('/teacher', methods=['GET'])
def teacher_view():
    srn = request.args.get('srn')  # Get the SRN from the query parameters
    results = {}

    if not srn:
        return jsonify({"error": "SRN parameter is required"}), 400

    # Get data from Guide table (no SRN filter as guides are general information)
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM guide")
    guides = cur.fetchall()
    results['guides'] = [
        {
            'G_id': row[0], 'G_name': row[1], 'G_domain': row[2], 'G_level': row[3]
        } for row in guides
    ]

    # Get data from Marksheet table for the specified SRN
    cur.execute("SELECT * FROM marksheet WHERE SRN = %s", (srn,))
    marksheets = cur.fetchall()
    results['marksheets'] = [
        {
            'SRN': row[0], 'G_id': row[1], 'T_id': row[2], 'Assessment_Number': row[3],
            'Parameter1': row[4], 'Parameter2': row[5], 'Parameter3': row[6], 'Parameter4': row[7],
            'Average_Marks': row[8]
        } for row in marksheets
    ]

    # Get data from Panel table (no SRN filter as panels are general information)
    cur.execute("""
        SELECT p.Panel_Id, p.G_id1, p.G_id2, p.G_id3, 
               g1.G_name as Guide1_Name, g1.G_domain as Guide1_Domain, g1.G_level as Guide1_Level,
               g2.G_name as Guide2_Name, g2.G_domain as Guide2_Domain, g2.G_level as Guide2_Level,
               g3.G_name as Guide3_Name, g3.G_domain as Guide3_Domain, g3.G_level as Guide3_Level
        FROM panel p
        JOIN guide g1 ON p.G_id1 = g1.G_id
        JOIN guide g2 ON p.G_id2 = g2.G_id
        JOIN guide g3 ON p.G_id3 = g3.G_id
    """)
    panels = cur.fetchall()
    results['panels'] = [
        {
            'Panel_Id': row[0],
            'Guide1': {'G_id': row[1], 'Name': row[4], 'Domain': row[5], 'Level': row[6]},
            'Guide2': {'G_id': row[2], 'Name': row[7], 'Domain': row[8], 'Level': row[9]},
            'Guide3': {'G_id': row[3], 'Name': row[10], 'Domain': row[11], 'Level': row[12]}
        } for row in panels
    ]

    cur.close()
    return jsonify(results)





@app.route('/create-account', methods=['POST'])
def create_account():
    data = request.get_json()

    if 'email' not in data or 'password' not in data or 'role' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    role = data['role']
    email = data['email']
    password = data['password']

    try:
        cursor = mysql.connection.cursor()

        # Student role
        if role == 'student':
            srn = data.get('srn')
            name = data.get('name')
            phone = data.get('phone')
            gpa = data.get('gpa')

            # Insert into student table
            cursor.execute("""
                INSERT INTO student (SRN, Name, Email, Phone, gpa)
                VALUES (%s, %s, %s, %s, %s)
            """, (srn, name, email, phone, gpa))

            user_id = srn  # For login table

        # Teacher role
        elif role == 'teacher':
            g_id = data.get('gId')
            g_name = data.get('gName')
            g_domain = data.get('gDomain')
            g_level = data.get('gLevel')

            # Insert into guide table
            cursor.execute("""
                INSERT INTO guide (G_id, G_name, G_domain, G_level)
                VALUES (%s, %s, %s, %s)
            """, (g_id, g_name, g_domain, g_level))

            user_id = g_id  # For login table

        # Insert into Login table
        cursor.execute("""
            INSERT INTO Login (UserID, Email, Password, Role)
            VALUES (%s, %s, %s, %s)
        """, (user_id, email, password, role))

        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Account created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500





@app.route('/handlelogin', methods=['POST'])
def login():
    # Get the login data from the request body
    data = request.get_json()
    print(data)

    if data['role'] == 'student':
        user_id = data['srn']
    else:
        user_id = data['gId']
    password = data['password']
    role = data['role']

    if not (user_id or password):
        return jsonify({'message': 'User_ID and password are required'}), 400


    # Query the database based on the role
    cursor = mysql.connection.cursor()
    if role == 'student':
        cursor.execute('SELECT * FROM login WHERE UserID = %s AND Password = %s', (user_id, password))
    elif role == 'teacher':
        cursor.execute('SELECT * FROM login WHERE  UserID = %s AND password = %s', (user_id, password))
    else:
        return jsonify({'message': 'Invalid role or missing SRN/G_ID'}), 400

    user = cursor.fetchone()

    if user:
        # User found, login successful
        return jsonify({'message': 'Login successful'}), 201
    else:
        # User not found
        return jsonify({'message': 'Invalid credentials'}), 401




# Endpoint for fetching teams associated with a specific G_id
@app.route('/teacher-teams', methods=['GET'])
def teacher_teams():
    g_id = request.args.get('gId')  # Get the G_id from the query parameters

    if not g_id:
        return jsonify({"error": "G_id parameter is required"}), 400

    results = {}

    # Fetch teams where the guide (teacher) is associated
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT T_id, Project_Title, SRN1, SRN2, SRN3, SRN4 
        FROM team WHERE G_id = %s
    """, (g_id,))
    teams = cur.fetchall()
    results['teams'] = [
        {
            'T_id': row[0], 'Project_Title': row[1], 
            'SRNs': [srn for srn in row[2:6] if srn]
        } for row in teams
    ]

    cur.close()
    return jsonify(results)


# Endpoint to fetch student details by SRN
@app.route('/student-details', methods=['GET'])
def student_details():
    srn = request.args.get('srn')  # Get the SRN from query parameters
    results = {}

    if not srn:
        return jsonify({"error": "SRN parameter is required"}), 400

    # Fetch student details
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM student WHERE SRN = %s", (srn,))
    student = cur.fetchone()
    if student:
        results['student'] = {
            'SRN': student[0], 'Name': student[1], 'Email': student[2], 
            'Phone': student[3], 'GPA': student[4]
        }
    else:
        return jsonify({})

    cur.close()
    return jsonify(results)



# Endpoint to fetch marksheet data by SRN
@app.route('/marksheet-by-srn', methods=['GET'])
def marksheet_by_srn():
    srn = request.args.get('srn')  # Get the SRN from query parameters
    results = {}

    if not srn:
        return jsonify({"error": "SRN parameter is required"}), 400

    # Fetch marksheet data for the specified SRN
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM marksheet WHERE SRN = %s", (srn,))
    marksheets = cur.fetchall()

    if marksheets:
        results['marksheets'] = [
            {
                'SRN': row[0], 'G_id': row[1], 'T_id': row[2], 'Assessment_Number': row[3],
                'Parameter1': row[4], 'Parameter2': row[5], 'Parameter3': row[6], 'Parameter4': row[7],
                'Average_Marks': row[8]
            } for row in marksheets
        ]
    else:
        return jsonify({})

    cur.close()
    return jsonify(results)




# Endpoint for creating a new team
@app.route('/create-team', methods=['POST'])
def create_team():
    data = request.get_json()

    # Ensure all required fields are present
    required_fields = ['T_id', 'Project_Title', 'SRN1', 'SRN2', 'SRN3', 'SRN4', 'T_domain']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    t_id = data['T_id']
    project_title = data['Project_Title']
    srn1 = data['SRN1']
    srn2 = data['SRN2']
    srn3 = data['SRN3']
    srn4 = data['SRN4']
    t_domain = data['T_domain']
    g_id = data['G_id']  # Teacher's guide ID

    # Check if the team already exists
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM team WHERE T_id = %s", (t_id,))
    existing_team = cur.fetchone()
    if existing_team:
        return jsonify({"error": "Team ID already exists"}), 400

    # Check if any student is already in another team
    cur.execute("SELECT * FROM team WHERE SRN1 = %s OR SRN2 = %s OR SRN3 = %s OR SRN4 = %s", 
                (srn1, srn2, srn3, srn4))
    conflicting_teams = cur.fetchall()
    if conflicting_teams:
        return jsonify({"error": "One or more students are already in another team"}), 400

    # Insert the new team
    try:
        cur.execute("""
            INSERT INTO team (T_id, Project_Title, SRN1, SRN2, SRN3, SRN4, G_id, T_domain)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (t_id, project_title, srn1, srn2, srn3, srn4, g_id, t_domain))
        mysql.connection.commit()
        return jsonify({"message": "Team created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500





# Endpoint to fetch all student details
@app.route('/get_student_list', methods=['GET'])
def get_all_students():
    # Fetch all students not in any team
    cur = mysql.connection.cursor()

    # Fixed SQL query to fetch students not in any team
    query = """
        SELECT SRN, Name, Email, Phone, GPA
        FROM student
        WHERE NOT EXISTS (
            SELECT 1
            FROM team
            WHERE team.SRN1 = student.SRN
               OR team.SRN2 = student.SRN
               OR team.SRN3 = student.SRN
               OR team.SRN4 = student.SRN
        );
    """
    cur.execute(query)
    
    students = cur.fetchall()  # Fetch all students that are not in teams
    results = []

    if students:
        for student in students:
            results.append({
                'SRN': student[0], 
                'Name': student[1], 
                'Email': student[2], 
                'Phone': student[3], 
                'GPA': student[4]
            })
    else:
        return jsonify({"error": "No students found"}), 404

    cur.close()
    return jsonify({"students": results})






if __name__ == '__main__':
    app.run(debug=True)



