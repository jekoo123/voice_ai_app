import os
import openai
from flask import Flask, request, jsonify
from happytransformer import TTSettings
from happytransformer import HappyTextToText
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from google.oauth2 import service_account
from google.cloud import speech_v1p1beta1 as speech

app = Flask(__name__)

openai.api_key = "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"
client_file = 'sa_speech_demo.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

if not os.path.exists('uploads'):
    os.makedirs('uploads')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('input')

    if not user_input:
        return jsonify({'error': 'No input provided'}), 400

    try:
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=f"User: {user_input}\nAI:",
            temperature=0.5,
            max_tokens=150,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            n=1,
            stop=["User:"]
        )
        ai_response = response.choices[0].text.strip()
        return jsonify({'response': ai_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if not os.path.exists('uploads'):
    os.makedirs('uploads')

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file found"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)

    if not filename.endswith(('.m4a', '.mp3', '.webm', '.mp4', '.mpga', '.wav', '.mpeg')):
        return jsonify({"error": "Invalid file format. Supported formats: ['m4a', 'mp3', 'webm', 'mp4', 'mpga', 'wav', 'mpeg']"}), 400

    file_path = os.path.join("uploads", filename)
    file.save(file_path)

    audio = AudioSegment.from_file(file_path)
    audio = audio.set_frame_rate(48000)
    audio = audio.set_channels(1)
    audio = audio.set_sample_width(2) 
    audio.export(file_path, format="wav")

    with open(file_path, "rb") as audio_file:
        content = audio_file.read()
        audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=48000,
        language_code="en-US",
        # language_code="ja-JP",
    )

    response = client.recognize(config=config, audio=audio)

    for result in response.results:
        transcription = result.alternatives[0].transcript

    return jsonify({"transcription": transcription})

@app.route('/grammer', methods=['POST'])
def Grammer():
    user_input = request.json.get('input')
    if not user_input:
        return jsonify({'error': 'No input provided'}), 400
    beam_settings =  TTSettings(num_beams=5, min_length=1, max_length=20)
    happy_tt= HappyTextToText(model_type="T5", model_name="t5-base", load_path="model/")
    result_1 = happy_tt.generate_text(user_input, args=beam_settings)
    return jsonify({'Modified': str(result_1)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)