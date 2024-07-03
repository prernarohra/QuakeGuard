from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS, cross_origin
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import os
import mysql.connector
from flask import request, make_response
from sklearn.model_selection import train_test_split

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)

# MySQL Configuration 
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'qirat'
app.config['MYSQL_PASSWORD'] = 'abc.123'
app.config['MYSQL_DB'] = 'myuserdb'
mysql = MySQL(app)

def train_intensity_model():
    df = pd.read_csv("intensity 3k.csv")

    train_size = 0.6
    num = int(len(df) * train_size)
    train_data = df.sample(n=num, random_state=42)
    train_data.to_csv("train_data_intensity.csv", index=False)

    test_size = 0.4
    num = int(len(df) * test_size)
    test_data = df.drop(train_data.index).sample(n=num, random_state=42)
    test_data.to_csv("test_data_intensity.csv", index=False)

    X_train = train_data.drop(columns=['Intensity'])
    Y_train = train_data['Intensity']
    X_test = test_data.drop(columns=['Intensity'])
    Y_test = test_data['Intensity']

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train_scaled, Y_train)

    return knn, scaler

def train_damage_model():
    df = pd.read_csv("intensity 3k.csv")

    # X = df.drop('destruction', axis=1)
    # y = df['destruction']

    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    train_size = 0.6
    num = int(len(df) * train_size)
    train_data = df.sample(n=num, random_state=42)
    train_data.to_csv("train_data_intensity.csv", index=False)

    test_size = 0.4
    num = int(len(df) * test_size)
    test_data = df.drop(train_data.index).sample(n=num, random_state=42)
    test_data.to_csv("test_data_intensity.csv", index=False)

    X = train_data.drop(columns=['destruction'])
    Y = train_data['destruction']
    x = test_data.drop(columns=['destruction'])
    y = test_data['destruction']

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X)
    X_test_scaled = scaler.transform(x)

    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train_scaled, Y)

    return knn, scaler

def perform_intensity_prediction(magnitude, depth, destruction, victims, knn, scaler):
    input_parameters = [[magnitude, depth, destruction, victims]]
    input_parameters_scaled = scaler.transform(input_parameters)
    predicted_intensity = knn.predict(input_parameters_scaled)
    return int(predicted_intensity[0])

def perform_damage_prediction(magnitude, depth, intensity, victims, knn, scaler):
    input_parameters = [[magnitude, depth, intensity, victims]]
    input_parameters_scaled = scaler.transform(input_parameters)
    predicted_damage = knn.predict(input_parameters_scaled)
    return int(predicted_damage[0])

intensity_descriptions = {
    1: "I. Not felt. Marginal and long-period effects of large earthquakes.",
    2: "II. Felt by persons at rest, on upper floors, or otherwise favorably placed to sense tremors.",
    3: "III. Felt indoors. Hanging objects swing. Vibrations are similar to those caused by the passing of light trucks. Duration can be estimated.",
    4: "IV. Vibrations are similar to those caused by the passing of heavy trucks (or a jolt similar to that caused by a heavy ball striking the walls). Standing automobiles rock. Windows, dishes, doors rattle. Glasses clink, crockery clashes. In the upper range of grade IV, wooden walls and frames creak.",
    5: "V. Felt outdoors; direction may be estimated. Sleepers awaken. Liquids are disturbed, some spilled. Small objects are displaced or upset. Doors swing, open, close. Pendulum clocks stop, start, change rate.",
    6: "VI. Felt by all; many are frightened and run outdoors. Persons walk unsteadily. Pictures fall off walls. Furniture moves or overturns. Weak plaster and masonry cracks. Small bells ring (church, school). Trees, bushes shake.",
    7: "VII. Difficult to stand. Noticed by drivers of automobiles. Hanging objects quivering. Furniture broken. Damage to weak masonry. Weak chimneys broken at roof line. Fall of plaster, loose bricks, stones, tiles, cornices. Waves on ponds; water turbid with mud. Small slides and caving along sand or gravel banks. Large bells ringing. Concrete irrigation ditches damaged.",
    8: "VIII. Steering of automobiles affected. Damage to masonry; partial collapse. Some damage to reinforced masonry; none to reinforced masonry designed to resist lateral forces. Fall of stucco and some masonry walls. Twisting, fall of chimneys, factory stacks, monuments, towers, elevated tanks. Frame houses moved on foundations if not bolted down; loose panel walls thrown out. Decayed pilings broken off. Branches broken from trees. Changes in flow or temperature of springs and wells. Cracks in wet ground and on steep slopes.",
    9: "IX. General panic. Weak masonry destroyed; ordinary masonry heavily damaged, sometimes with complete collapse; reinforced masonry seriously damaged. Serious damage to reservoirs. Underground pipes broken. Conspicuous cracks in ground. In alluvial areas, sand and mud ejected; earthquake fountains, sand craters.",
    10: "X. Most masonry and frame structures destroyed with their foundations. Some well-built wooden structures and bridges destroyed. Serious damage to dams, dikes, embankments. Large landslides. Water thrown on banks of canals, rivers, lakes, and so on. Sand and mud shifted horizontally on beaches and flat land. Railway rails bent slightly.",
    11: "XI. Rails bent greatly. Underground pipelines completely out of service.",
    12: "XII. Damage nearly total. Large rock masses displaced. Lines of sight and level distorted. Objects thrown into air."
}



@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    magnitude = float(data['magnitude'])
    depth = float(data['depth'])
    destruction = int(data['destruction'])
    victims = int(data['victims'])

    predicted_intensity = perform_intensity_prediction(magnitude, depth, destruction, victims, intensity_knn, intensity_scaler)
    intensity_description = intensity_descriptions.get(predicted_intensity, "Description not available.")

    return jsonify({'prediction': predicted_intensity, 'description': intensity_description})

@app.route('/predict-reduced', methods=['POST'])
def predict_reduced():
    data = request.json
    magnitude = float(data['magnitude'])

    reduced_magnitude = magnitude - 0.5

    return jsonify({'reduced_magnitude': reduced_magnitude})

@app.route('/predict_destruction_from_input', methods=['POST'])
def predict_destruction_from_input():
    data = request.json
    magnitude = float(data['magnitude'])
    depth = float(data['depth'])
    intensity = int(data['intensity'])
    victims = int(data['victims'])

    predicted_damage = perform_damage_prediction(magnitude, depth, intensity, victims, damage_knn, damage_scaler)

    return jsonify({'prediction': predicted_damage})



@app.route('/')
def newhome():
    return render_template("newhome.html")

@app.route('/intensityds')
def intensityds():
    return render_template("intensityds.html")

@app.route('/significantds')
def significantds():
    return render_template("significantds.html")

@app.route('/Earthquake_by_Year')
def Earthquake_by_Year():
    return render_template("Earthquake_by_Year.html")

@app.route('/destruction')
def destruction():
    return render_template("destruction.html")

@app.route('/resources')
def resources():
    return render_template("resources.html")



@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        remember_me = request.form.get('remember-me')

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if user:
            db_password = user[4]
            if check_password_hash(db_password, password):
                session['email'] = email
                session['first_name'] = user[1]
                session['last_name'] = user[2]
                if remember_me:
                    resp = make_response(redirect('/')) #if login with rem it was taking to pred but ive shifted to home
                    resp.set_cookie('remember_token', email, max_age=30*24*60*60)
                    return resp
                return redirect('/') #if not ticked rem me and logged in
            else:
                error = 'Incorrect password. Please try again.'
        else:
            error = 'Account not found. Please register.'

    if 'remember_token' in request.cookies:
        email = request.cookies.get('remember_token')
        session['email'] = email
        return redirect('/') #if ticked rem me and logged in

    return render_template('login.html', error=error) 




@app.route('/automatic-login')
def automatic_login():
    print("Attempting automatic login")
    if 'remember_token' in request.cookies:
        email = request.cookies.get('remember_token')
        session['email'] = email
        print("Automatic login with email:", email)
        return redirect('/predictor')
    return redirect('/login')

@app.route('/logout')
def logout():
    session.clear()
    resp = make_response(redirect(url_for('newhome')))
    resp.delete_cookie('remember_token')  # Clearing the remember token cookie
    return resp
    # return redirect(url_for('homepage')) 


@app.route('/sign-up')
def sign_up():
    return render_template("Sign Up.html")

@app.route('/about')
def about():
    return render_template('About.html')



@app.route('/predictor')
def predictor():
    if 'email' in session:
        email = session.get('email', '')
        # Extract first part of email before '@' symbol
        username = email.split('@')[0]
        # Generate initials from the first letter of the username
        initials = username[0].upper()
        return render_template('predictor.html', initials=initials)
    else:
        return redirect(url_for('login'))



@app.route('/solutions')
def solutions():
    return render_template('Solution.html')

@app.route('/get_reduced_magnitude', methods=['GET'])
def get_reduced_magnitude():
    magnitude = float(request.args.get('magnitude'))
    
    if magnitude >= 7:
        reduced_magnitude = magnitude
    elif 6.5 <= magnitude < 7:
        reduced_magnitude = magnitude - 0.1
    elif 6 <= magnitude < 6.5:
        reduced_magnitude = magnitude - 0.2
    elif 5.5 <= magnitude < 6:
        reduced_magnitude = magnitude - 0.3
    elif 5 <= magnitude < 5.5:
        reduced_magnitude = magnitude - 0.4
    elif 4.5 <= magnitude < 5:
        reduced_magnitude = magnitude - 0.5
    elif 4 <= magnitude < 4.5:
        reduced_magnitude = magnitude - 0.6
    else:
        reduced_magnitude = magnitude - 0.7

    return jsonify({'reduced_magnitude': reduced_magnitude})



@app.route('/get_solutions_based_on_magnitude', methods=['GET'])
def get_solutions_based_on_magnitude():
    magnitude = float(request.args.get('magnitude'))

    solutions = []

    # intro_paragraph = "<strong>Water Injection or Human induced seismicity</strong><br><br>" \
    #                   "The interaction between water injection and earthquake magnitude has garnered scientific interest. The Richter scale provides insight into this relationship, indicating that while the impact of water injection is negligible at higher magnitudes, subtle changes in pressure could theoretically affect earthquakes in the 5.0 to 6.0 range.<br><br>" \
    #                   "Moreover, human activities altering underground water levels can redistribute stress in the Earth's crust, potentially influencing the buildup of strain along fault lines and altering seismic risk. Understanding this interplay is vital for managing seismic hazards effectively.<br><br>" \
    #                   "Human activity can also be beneficial for us as it generates smaller earthquakes of maximum 4 to 5 magnitude which are not that much harmful for us but it prevents the higher build up of stress in the crust preventing larger earthquakes causing destruction to our environment.<br><br>"

    if magnitude >= 7:
        solutions.append(
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "Due to the immense energy release at these high magnitudes, the pressure reduction from water injection is unlikely to have any measurable impact. That's why the effect of water injection would likely be negligible at these magnitudes.")
    elif 6.5 <= magnitude < 7:
        solutions.append(#intro_paragraph +
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "In this range, a very slight pressure reduction might lead to a fractional decrease on the Richter scale.")
    elif 6 <= magnitude < 6.5:
        solutions.append(
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "In this range, a very slight pressure reduction a little more than magnitudes of 6.5 to 7 might lead to a fractional decrease on the Richter scale, potentially 0.2 change in magnitude.")
    elif 5.5 <= magnitude < 6:
        solutions.append(
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "Here, the pressure change from water injection could lead to a possible decrease of 0.2 to 0.3 on the Richter scale.")
    elif 5 <= magnitude < 5.5:
        solutions.append(
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "Here, the pressure change from water injection could lead to a possible decrease of 0.3 to 0.4 on the Richter scale.")
    elif 4.5 <= magnitude < 5:
        solutions.append(
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "This range represents the unlikely scenario where water injection drastically reduces pressure, leading to a theoretical decrease of 0.5 on the Richter scale.")
    elif 4 <= magnitude < 4.5:
        solutions.append(
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "This range represents the unlikely scenario where water injection drastically reduces pressure, leading to a theoretical decrease of more than 0.5 on the Richter scale, potentially 0.6 or something.")
    else:
        solutions.append(
                         "<strong>Reduced Magnitude description</strong><br><br>"
                         "This range represents the unlikely scenario where water injection drastically reduces pressure, leading to a theoretical decrease of more than 0.6 on the Richter scale, potentially 0.7 or something.")

    return jsonify({'solutions': solutions})



@app.route('/insurance')
def insurance():
    return render_template('Insurance.html')

@app.route('/contact')
def contact():
    return render_template('Contact.html')



@app.route('/signup', methods=['POST'])
def submit_signup():
    if request.method == 'POST':
        first_name = request.json.get('firstName')
        last_name = request.json.get('lastName')
        email = request.json.get('email')
        password = request.json.get('password')

   
        hashed_password = generate_password_hash(password)

        try:
            cursor = mysql.connection.cursor()

            cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                
                return jsonify({'error': 'Email already exists. Please choose a different one.'}), 400

            cursor.execute('INSERT INTO users (first_name, last_name, email, password) VALUES (%s, %s, %s, %s)',
                           (first_name, last_name, email,  hashed_password))
            mysql.connection.commit()
            cursor.close()
            return redirect(url_for('login'))

        except Exception as e:
            print(f"Error during sign-up: {e}")
            return render_template('error.html', error_message='An error occurred during registration. Please try again.')

        finally:
            mysql.connection.close()



@app.route('/intensity-reduction', methods=['POST'])
def intensity_reduction():
    try:
        data = request.json
        predicted_intensity = int(data['predicted_intensity'])
        
        if 'standard' in data['button']:
            reduced_intensity = predicted_intensity / 2
            suggestion = "We suggest you use these combined standards on tall and high budget buildings."
        elif 'seishen' in data['button']:
            reduced_intensity = predicted_intensity * 0.70
            suggestion = "We suggest you use this Seishen standard to reduce intensity."
        elif 'menshin' in data['button']:
            building = data.get('building', '').lower()
            if building == "tall":
                reduced_intensity = predicted_intensity / 5
                suggestion = "We suggest you use this standard for tall buildings."
            elif building == "medium":
                reduced_intensity = predicted_intensity / 3
                suggestion = "We suggest you use this standard for medium-sized buildings."
            elif building == "small":
                reduced_intensity = predicted_intensity
                suggestion = "We don't recommend using this standard on small buildings because it's expensive, and small buildings don't need it. Taishin is enough."
            else:
                return jsonify({'error': 'Invalid building size entered.'}), 400

        roundoff = round(reduced_intensity)
        return jsonify({'reduced_intensity': roundoff, 'suggestion': suggestion})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    intensity_knn, intensity_scaler = train_intensity_model()
    damage_knn, damage_scaler = train_damage_model()
    app.run(debug=True)
