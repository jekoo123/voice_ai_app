import os
import openai
import base64
import uuid
import time
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
openai.api_key = "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"
client_file = 'sa_speech_demo.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)


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

language_code = "en-US" 
conversation = Conversation()

@app.route('/flow_flag', methods=['GET'])
def get_flow_flag():
    flow_flag = conversation.get_flow_flag()
    flow_flag = 1 if flow_flag == 0 else 0
    conversation.set_flow_flag(flow_flag)
    return jsonify({'flow_flag': flow_flag})

def synthesize_speech_and_upload_to_gcs(text):
    startTime= time.time()
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
    endTime = time.time()
    elapse = endTime - startTime
    print("5: ", elapse)
    startTime= time.time()
    audio_base64_bytes = base64.b64encode(response.audio_content)
    audio_base64_string = audio_base64_bytes.decode('ascii')
    endTime = time.time()
    elapse = endTime - startTime
    print("5-1", elapse)
    return (audio_base64_string)
    # try : 
    #     output_filename = 'output.m`p3'
    #     with open(output_filename, 'wb') as out:
    #         out.write(response.audio_content)
    #     # print('Audio content written to file:', output_filename)

    #     # gcs_url = save_to_gcs("jekoo", output_filename)
    
    #     return gcs_url
    
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500


# def save_to_gcs(bucket_name, source_file_name):
#     startTime =time.time()
#     credentials = service_account.Credentials.from_service_account_file(client_file)
#     storage_client = storage.Client(credentials=credentials)

#     bucket = storage_client.bucket(bucket_name)
    
#     unique_id = str(uuid.uuid4())  # Generate unique ID
#     base_name, ext = os.path.splitext(source_file_name)
#     blob_name = f"{base_name}_{unique_id}{ext}"  # Construct unique blob name
#     blob = bucket.blob(blob_name)

#     blob.upload_from_filename(source_file_name)


#     # print(
#     #     "File {} uploaded as {}.".format(
#     #         source_file_name, blob_name
#     #     )
#     # )
    
#     blob.make_public()
#     endTime = time.time()
#     elapse = endTime - startTime
#     print("6: ", elapse)
    
#     return blob.public_url


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
    
@app.route("/get_language", methods=["GET"])
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
        return jsonify({"error": "No f ile found"}), 400
    
    startTime = time.time()
    transcription_text = ""
    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join("uploads", filename)
    file.save(file_path)
    endTime = time.time()
    elapse = endTime - startTime
    print("1: ", elapse)

    startTime = time.time()
    audio = AudioSegment.from_file(file_path)
    audio = audio.set_frame_rate(48000)
    audio = audio.set_channels(1)
    audio = audio.set_sample_width(2)
    audio.export(file_path, format="wav")
    endTime = time.time()
    elapse = endTime - startTime
    print("2: ", elapse)


    startTime = time.time()

    with open(file_path, "rb") as audio_file:
        content = audio_file.read()
        audio = speech.RecognitionAudio(content=content)

    endTime = time.time()
    elapse = endTime - startTime
    print("3: ", elapse)


    startTime = time.time()
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=48000,
        language_code="en-US",
    )
    response = client.recognize(config=config, audio=audio)
    endTime = time.time()
    elapse = endTime - startTime
    print("3-1: stt ", elapse)

    startTime = time.time()
    for result in response.results:
        transcription_text = result.alternatives[0].transcript
    chat_response = chat(transcription_text)
    endTime = time.time()
    elapse = endTime - startTime
    print("4: ai response", elapse)


    audio = synthesize_speech_and_upload_to_gcs(chat_response)

    return jsonify({"sttResponse": transcription_text, "chatResponse": chat_response, "audio": audio}), 200

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
    letters = ('?', ',', '.')
    replacements = ('', '', '')
    table = input2.maketrans(dict(zip(letters, replacements)))
    input2 = input2.translate(table)
    input2 = input2[0].upper() + input2[1:]
    ratio = SequenceMatcher(None, input,input2 ).ratio()
    return jsonify({"grammer_score" : ratio})

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
