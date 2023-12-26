import os
import json
from flask import Flask, request, jsonify
import subprocess
from datetime import datetime
from flask_cors import CORS

# Flask App Initialization
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://niles-8df14.web.app"}})

# OpenAI API Key
openai_api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    # Serve the front-end HTML
    return render_template('index.html')

@app.route('/api/run-script', methods=['POST'])
def run_script():
    data = request.get_json()
    prompt = data['prompt']
    username = data['username']
    script_number = prompt[0]

    if script_number in ['1', '2']:
        script = "assistants api_niles_coach.py"
    elif script_number == '3':
        script = "assistants api_niles_info.py"
    else:
        return jsonify({'error': 'Invalid script number'}), 400

    process = subprocess.run(["python", script, prompt], capture_output=True, text=True)
    api_response = process.stdout

    # Here you might want to save the query and response to your database or file system

    return jsonify({'response': api_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
