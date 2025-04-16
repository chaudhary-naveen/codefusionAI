from flask import Flask, render_template,request
import subprocess
import json

from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Generate requirements.txt file
with open("requirements.txt", "w") as f:
    subprocess.run(["pip", "freeze"], stdout=f)


@app.route('/')
def home():
    return "Hii, I am Code LLAMA 7B"


def run_llama_prompt(prompt, model="llama3"):
    """
    Run a prompt using a locally installed LLaMA model via Ollama.

    Parameters:
    - prompt (str): The prompt to send to the LLaMA model.
    - model (str): The name of the model to use (default: llama3).

    Returns:
    - str: The response from the model.
    """
    try:
        # Prepare the command
        command = ["ollama", "run", model, prompt]
        # Run the command and capture output
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding="utf-8",  # ✅ force UTF-8 decoding
            errors="replace"   # ✅ replace unknown characters instead of crashing
        )
        # Return the output
        return result.stdout.strip()
    
    except subprocess.CalledProcessError as e:
        return f"Error running the model: {e.stderr.strip()}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"

@app.route('/ask', methods=['POST'])
def llm():
    data = request.get_json()
    prompt = "Code : " + data["code"] + " query : " + data["query"]
    return run_llama_prompt(prompt, "codellama")

if __name__ == '__main__':
    app.run(debug=True)