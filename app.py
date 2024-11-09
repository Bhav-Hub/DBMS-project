from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = ''
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = ''

mysql = MySQL(app)

# Endpoint for student view with SRN filter
@app.route('/student', methods=['GET'])
def student_view():
    srn = request.args.get('srn')  # Get the SRN from the query parameters
    results = {}

    # Ensure SRN is provided
    if not srn:
        return jsonify({"error": "SRN parameter is required"}), 400

    # Get data from Student table for the specified SRN
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM student WHERE SRN = %s", (srn,))
    student = cur.fetchone()
    if student:
        results['student'] = {
            'SRN': student[0], 'Name': student[1], 'Email': student[2], 'Phone': student[3], 'GPA': student[4]
        }
    else:
        return jsonify({"error": "Student not found"}), 404

    # Get data from Marksheet table for the specified SRN
    cur.execute("SELECT * FROM marksheet WHERE SRN = %s", (srn,))
    marksheets = cur.fetchall()
    results['marksheets'] = [
        {
            'SRN': row[0], 'G_id': row[1], 'T_id': row[2], 'Assessment_Number': row[3],
            'Parameter1': row[4], 'Parameter2': row[5], 'Parameter3': row[6], 'Parameter4': row[7],
            'Semester': row[8], 'Average_Marks': row[9]
        } for row in marksheets
    ]

    # Get data from Team table where the specified SRN is a member
    cur.execute("""
        SELECT * FROM team WHERE SRN1 = %s OR SRN2 = %s OR SRN3 = %s OR SRN4 = %s
    """, (srn, srn, srn, srn))
    teams = cur.fetchall()
    results['teams'] = [
        {
            'T_id': row[0], 'Project_Title': row[1], 'SRN1': row[2], 'SRN2': row[3],
            'SRN3': row[4], 'SRN4': row[5], 'G_id': row[6], 'T_domain': row[7]
        } for row in teams
    ]

    # Get data from Semester table for the specified SRN
    cur.execute("SELECT * FROM semester WHERE SRN = %s", (srn,))
    semester = cur.fetchone()
    if semester:
        results['semester'] = {
            'SRN': semester[0], 'Sem_5': semester[1], 'Sem_6': semester[2],
            'Sem_7': semester[3], 'Sem_8': semester[4]
        }

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
            'Semester': row[8], 'Average_Marks': row[9]
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
    print(data)

    # Example validation (email, password, role)
    if 'email' not in data or 'password' not in data or 'role' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Extract data
    if data['role'] == 'student':
        user_id = data['srn']
    else:
        user_id = data['gId']
    email = data['email']
    password = data['password']
    role = data['role']
    
    print(user_id, email, password, role) 

    # Logic to create an account (insert into the Login table)
    try:
        # Connect to the database
        cursor = mysql.connection.cursor()

        # SQL query to insert into the Login table
        insert_query = """
        INSERT INTO Login (UserID, Email, Password, Role)
        VALUES (%s, %s, %s, %s)
        """
        
        # Executing the insert query with the provided data
        cursor.execute(insert_query, (user_id, email, password, role))

        # Commit the transaction
        mysql.connection.commit()

        # Close the connection
        cursor.close()

        return jsonify({"message": "Account created successfully!"}), 201
    except mysql.connector.Error as e:
        # Handling database errors
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



if __name__ == '__main__':
    app.run(debug=True)



