import os
import uuid
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from google.oauth2 import service_account
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech
from google.cloud import storage
import openai

app = Flask(__name__)

# OpenAI API 키 설정
openai.api_key = "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"

client_file = 'google_stt_key.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

language_code = "en-US"  # 기본 언어 코드: 영어

class Conversation:
    def __init__(self):
        self.flow_flag = 0
        self.context = ""

    def set_flow_flag(self, flag):
        self.flow_flag = flag

    def get_flow_flag(self):
        return self.flow_flag

    def append_context(self, user_input, ai_response):
        self.context += f"User: {user_input}\nAI: {ai_response}\n"

    def reset_context(self):
        self.context = ""

conversation = Conversation()

@app.route('/flow_flag', methods=['GET'])
def get_flow_flag():
    flow_flag = conversation.get_flow_flag()
    flow_flag = 1 if flow_flag == 0 else 0
    conversation.set_flow_flag(flow_flag)
    return jsonify({'flow_flag': flow_flag})

def chat(user_input):
    try:
        flow_flag = conversation.get_flow_flag()
        print(f"Current flow_flag value: {flow_flag}")
        if flow_flag == 1:  # 문맥용 대화 실행문구
            conversation.set_flow_flag(2)
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Let's set random situation and engage in talk with me. \nUse language {language_code}",
                temperature=0.5,
                max_tokens=150,
                top_p=1.0,
                frequency_penalty=1.0,
                presence_penalty=1.0,
                n=1,
                stop=["User:"],
            )
            ai_response = response.choices[0].text.strip()
            conversation.append_context(user_input, ai_response)
            return ai_response
        elif flow_flag == 2:  # 문맥용 대화 중
            conversation.append_context(user_input, "")
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=conversation.context,
                temperature=0.2,
                max_tokens=1500,
                top_p=1.0,
                frequency_penalty=0.5,
                presence_penalty=0.5,
                n=1,
                stop=["User:"],
            )

            ai_response = response.choices[0].text.strip()
            conversation.append_context(user_input, ai_response)
            return ai_response
        else:  # 일반 대화
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"User: {user_input}\n{language_code}AI:",
                temperature=0.5,
                max_tokens=150,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0,
                n=1,
                stop=["User:"],
            )
            ai_response = response.choices[0].text.strip()
            return ai_response

    except Exception as e:
        return str(e)

@app.route("/language", methods=["GET"])
def get_language():
    return jsonify({"language_code": language_code})

@app.route('/set_language', methods=['POST'])
def set_language():
    global language_code
    language = request.json.get('language')
    if language == "english":
        language_code = "en-US"
    elif language == "japanese":
        language_code = "ja-JP"
    return jsonify({"success": True}), 200

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file found"}), 400
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
        language_code=language_code,  # 언어 코드 설정
    )

    response = client.recognize(config=config, audio=audio)

    for result in response.results:
        transcription_text = result.alternatives[0].transcript
    chat_response = chat(transcription_text)
    audio_url = synthesize_speech_and_upload_to_gcs(chat_response)

    transcription_text = str(transcription_text)
    chat_response = str(chat_response)

    response_data = {
        "sttResponse": transcription_text,
        "chatResponse": chat_response,
        "audioUrl": audio_url
    }

    return response_data, 200

def synthesize_speech_and_upload_to_gcs(text):
    client = texttospeech.TextToSpeechClient(credentials=credentials)

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,  # 언어 코드 설정
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

    try:
        output_filename = 'output.mp3'
        with open(output_filename, 'wb') as out:
            out.write(response.audio_content)

        gcs_url = save_to_gcs("capstone_230523", output_filename)
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
    blob.make_public()

    return blob.public_url

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)