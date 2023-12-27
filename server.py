from flask import Flask, request, jsonify, render_template
from google.cloud import storage
from google.cloud import secretmanager
import subprocess
from datetime import datetime

# Flask App Initialization
app = Flask(__name__)

# Function to access secret in Google Secret Manager
def access_secret_version(project_id, secret_id, version_id):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode('UTF-8')

# OpenAI API Key
openai_api_key = access_secret_version('api-call-niles', 'projects/857423205039/secrets/OPENAI_API_KEY', '1')

# Now you can validate the key
if not openai_api_key:
    raise ValueError("Missing OpenAI API Key")

# Create a storage client
storage_client = storage.Client()

# Get your bucket
bucket = storage_client.bucket('your-bucket-name')

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
        # Prepend the script number to the prompt
        prompt = script_number + ' ' + prompt
    elif script_number == '3':
        script = "assistants api_niles_info.py"
    else:
        return jsonify({'error': 'Invalid script number'}), 400

    process = subprocess.run(["python", script, prompt], capture_output=True, text=True)
    api_response = process.stdout

    # Log the data
    timestamp = datetime.now().isoformat()
    log_data = f'Username: {username}, Timestamp: {timestamp}, Query: {prompt}, Response: {api_response}\n'

    # Create a new blob and upload the log data
    blob = bucket.blob(f'logs/{username}/{timestamp}.txt')
    blob.upload_from_string(log_data)

    return jsonify({'response': api_response})