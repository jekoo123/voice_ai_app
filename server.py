import os
import openai
import os
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from google.oauth2 import service_account
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech

# from pymongo import MongoClient
# from bson.objectid import ObjectId


app = Flask(__name__)

# OpenAI API 키 설정
openai.api_key = "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"
client_file = 'sa_speech_demo.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)
# cluster = MongoClient("mongodb+srv://wprn1116:Z3VuxQrupXHoeoCZ@cluster0.zsnpgns.mongodb.net/?retryWrites=true&w=majority")
# db = cluster["voice_ai"]

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

    # Convert audio file to the required format
    audio = AudioSegment.from_file(file_path)
    audio = audio.set_frame_rate(48000)
    audio = audio.set_channels(1)
    audio = audio.set_sample_width(2)  # set sample width to 2
    audio.export(file_path, format="wav")

    with open(file_path, "rb") as audio_file:
        content = audio_file.read()
        audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=48000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    # Extract transcription results
    for result in response.results:
        transcription = result.alternatives[0].transcript

    return jsonify({"transcription": transcription})


@app.route('/tts', methods=['POST'])
def synthesize_speech():
    text = request.json.get('text')

    client = texttospeech.TextToSpeechClient(credentials=credentials)

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US", 
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input, 
        voice=voice, 
        audio_config=audio_config
    )

    with open('output.mp3', 'wb') as out:
        out.write(response.audio_content)

    return send_file('output.mp3', mimetype='audio/mpeg')

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
