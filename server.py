import os
import openai
import uuid
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from google.oauth2 import service_account
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech
from google.cloud import storage
from difflib import SequenceMatcher

app = Flask(__name__)

# OpenAI API 키 설정
openai.api_key = ""
client_file = 'sa_speech_demo.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

def synthesize_speech_and_upload_to_gcs(text):
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
    try : 
        output_filename = 'output.mp3'
        with open(output_filename, 'wb') as out:
            out.write(response.audio_content)
        # print('Audio content written to file:', output_filename)

        gcs_url = save_to_gcs("jekoo", output_filename)

        return gcs_url
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def save_to_gcs(bucket_name, source_file_name):
    credentials = service_account.Credentials.from_service_account_file(client_file)
    storage_client = storage.Client(credentials=credentials)

    bucket = storage_client.bucket(bucket_name)
    
    unique_id = str(uuid.uuid4())  # Generate unique ID
    base_name, ext = os.path.splitext(source_file_name)
    blob_name = f"{base_name}_{unique_id}{ext}"  # Construct unique blob name
    blob = bucket.blob(blob_name)

    blob.upload_from_filename(source_file_name)

    # print(
    #     "File {} uploaded as {}.".format(
    #         source_file_name, blob_name
    #     )
    # )
    
    blob.make_public()
    
    return blob.public_url

def chat(user_input):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
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
        return ai_response

    except Exception as e:
        return str(e)
    
@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No f ile found"}), 400
    transcription_text = ""
    file = request.files['file']
    filename = secure_filename(file.filename)
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
    )

    response = client.recognize(config=config, audio=audio)

    for result in response.results:
        transcription_text = result.alternatives[0].transcript
    chat_response = chat(transcription_text)
    audio_url = synthesize_speech_and_upload_to_gcs(chat_response)
    return jsonify({"sttResponse": transcription_text, "chatResponse": chat_response, "audioUrl": audio_url}), 200

@app.route('/evaluation', methods=['POST'])
def evaluation():
    input = request.json.get('input')
    response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Correct this to standard English:\n\n {input}",
            temperature=0,
            max_tokens=60,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
    return jsonify({"grammer": response.choices[0].text.strip()})

@app.route('/score', methods=['POST'])
def score():
    input = request.json.get('input')
    input2 = request.json.get('input2')
    ratio = SequenceMatcher(None, input,input2 ).ratio()
    return jsonify({"grammer_score" : ratio})

# str1 = "hello how are you"
# str2 = "Hello, how are you?"
# ratio = SequenceMatcher(None, str1, str2).ratio()
# print(ratio)

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)


# cluster = MongoClient("mongodb+srv://wprn1116:Z3VuxQrupXHoeoCZ@cluster0.zsnpgns.mongodb.net/?retryWrites=true&w=majority")
# db = cluster["voice_ai"]
# stt -> {바로 open ai - response} -> tts -> gcs -> load
# stt의 response를 프론트를 거치지 않고 바로 chat으로 보내고 chat에서 chat에서의 response와 받은 stt의 response를 앱으로 보내면서 chat의 response만 tts로 보내고 싶어

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_input = request.json.get('input')

#     if not user_input:
#         return jsonify({'error': 'No input provided'}), 400

#     try:
#         response = openai.Completion.create(
#             engine="text-davinci-002",
#             prompt=f"User: {user_input}\nAI:",
#             temperature=0.5,
#             max_tokens=150,
#             top_p=1.0,
#             frequency_penalty=0.0,
#             presence_penalty=0.0,
#             n=1,
#             stop=["User:"]
#         )

#         ai_response = response.choices[0].text.strip()

#         return jsonify({'response': ai_response})

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# if not os.path.exists('uploads'):
#     os.makedirs('uploads')

# @app.route('/transcribe', methods=['POST'])
# def transcribe_audio():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file found"}), 400

#     file = request.files['file']
#     filename = secure_filename(file.filename)

#     if not filename.endswith(('.m4a', '.mp3', '.webm', '.mp4', '.mpga', '.wav', '.mpeg')):
#         return jsonify({"error": "Invalid file format. Supported formats: ['m4a', 'mp3', 'webm', 'mp4', 'mpga', 'wav', 'mpeg']"}), 400

#     file_path = os.path.join("uploads", filename)
#     file.save(file_path)

#     # Convert audio file to the required format
#     audio = AudioSegment.from_file(file_path)
#     audio = audio.set_frame_rate(48000)
#     audio = audio.set_channels(1)
#     audio = audio.set_sample_width(2)  # set sample width to 2
#     audio.export(file_path, format="wav")

#     with open(file_path, "rb") as audio_file:
#         content = audio_file.read()
#         audio = speech.RecognitionAudio(content=content)

#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=48000,
#         language_code="en-US",
#     )

#     response = client.recognize(config=config, audio=audio)

#     # Extract transcription results
#     # for result in response.results:
#     #     transcription = result.alternatives[0].transcript
#     # return jsonify({"transcription": transcription})
#     for result in response.results:
#         transcription_text = result.alternatives[0].transcript
#     return chat()


# @app.route('/tts', methods=['POST'])
# def synthesize_speech():
#     text = request.json.get('text')

#     client = texttospeech.TextToSpeechClient(credentials=credentials)

#     synthesis_input = texttospeech.SynthesisInput(text=text)

#     voice = texttospeech.VoiceSelectionParams(
#         language_code="en-US", 
#         ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
#     )

#     audio_config = texttospeech.AudioConfig(
#         audio_encoding=texttospeech.AudioEncoding.MP3
#     )

#     response = client.synthesize_speech(
#         input=synthesis_input, 
#         voice=voice, 
#         audio_config=audio_config
#     )

#     with open('output.mp3', 'wb') as out:
#         out.write(response.audio_content)

#     return send_file('output.mp3', mimetype='audio/mpeg')

# if __name__ == '__main__':
#     if not os.path.exists('uploads'):
#         os.makedirs('uploads')
#     app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
