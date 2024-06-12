from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import time
import json
#from pyst import asterisk

app = Flask(__name__, static_folder='static')

app.secret_key = 'your_secret_key'

# Asterisk connection
#ast = asterisk.Manager()
# Mock user data for demo
users = {'demo': 'password'}

@app.route('/')
def main():
    return render_template('home.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/make-call', methods=['POST'])
def make_call():
    try:
        # Hardcoded SIP trunk details
        trunk_username = "1018"
        trunk_password = "1w@ntIN@sb"
        trunk_host = "oxba.voiceflow.co.za"
        destination_number = "destination@example.com"

        # Place a call using Asterisk
        ast.originate(f'SIP/{trunk_username}:{trunk_password}@{trunk_host}/{destination_number}', application='Playback', data='hello-world')
        return jsonify(message='Call initiated successfully'), 200
    except asterisk.ManagerSocketException as e:
        return jsonify(message='Error: ' + str(e)), 500
    

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    if username in users and users[username] == password:
        session['username'] = username
        return redirect(url_for('home'))
    else:
        return redirect(url_for('login'))

@app.route('/dial-pad')
def dial_pad():
    if 'username' in session:
        return render_template('dial.html')
    else:
        return redirect(url_for('home'))

@app.route('/call-in-progress')
def call_in_progress():
    if 'username' in session:
        return render_template('call_in_progress.html')
    else:
        return redirect(url_for('home'))

@app.route('/call-history')
def call_history():
    if 'username' in session:
        return render_template('history.html')
    else:
        return redirect(url_for('home'))
    
@app.route('/contacts')
def contacts():
    if 'username' in session:
        return render_template('contacts.html')
    else:
        return redirect(url_for('home'))

#@app.route('/log-call', methods=['POST'])
#def log_call():
#    data = request.json
#    caller = data['caller']
#    callee = data['callee']
#    duration = data['duration']  # Get call duration from SIP.js or frontend
#    # Save call log to JSON file
#    with open('call_logs.json', 'a') as file:
#        log_entry = {'caller': caller, 'callee': callee, 'duration': duration}
#        json.dump(log_entry, file)
#        file.write('\n')
#    return jsonify(message='Call logged successfully'), 200

if __name__ == '__main__':
    app.run(debug=True)
