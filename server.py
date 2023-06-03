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
from pymongo import MongoClient
# from bson.objectid import ObjectId

app = Flask(__name__)

# OpenAI API 키 설정
openai.api_key = "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"
client_file = 'sa_speech_demo.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)
app.secret_key = '1234'
cluster = MongoClient("mongodb+srv://wprn1116:Z3VuxQrupXHoeoCZ@cluster0.zsnpgns.mongodb.net/?retryWrites=true&w=majority")
db = cluster["voice_ai_app"]

def synthesize_speech(text, language_code):
    startTime= time.time()
    client = texttospeech.TextToSpeechClient(credentials=credentials)
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code, 
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
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


def chat(user_input , prevDialog):
    print("atchat"+prevDialog)
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt= prevDialog+f"User: {user_input}\nAi: ""\n",
            temperature=0.5,
            max_tokens=150,
            top_p=1.0,
            frequency_penalty=1.0,
            presence_penalty=1.0,
            n=1,
            stop=["User:"],
        )
        ai_response = response.choices[0].text.strip()
        return ai_response
            # print("love")
            # response = openai.Completion.create(
            #     engine="text-davinci-003",
            #     prompt=f"User: {user_input}\n{language_code}AI:",
            #     temperature=0.5,
            #     max_tokens=150,
            #     top_p=1.0,
            #     frequency_penalty=0.0,
            #     presence_penalty=0.0,
            #     n=1,
            #     stop=["User:"],
            # )
            # ai_response = response.choices[0].text.strip()
            # return ai_response
    except Exception as e:
        return str(e)

@app.route("/contextstart",methods=['POST'])
def contextstart():
    language_code = request.json.get('input')
    response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Let's set random situation and engage in talk with me. talk to me anything.\nUse language {language_code}.",
                temperature=0.5,
                max_tokens=150,
                top_p=1.0,
                frequency_penalty=1.0,
                presence_penalty=1.0,
                n=1,
                stop=["User:"],)
    ai_response = response.choices[0].text.strip()
    audio = synthesize_speech(ai_response,language_code)
    return(jsonify({"ai_response":ai_response,"audio": audio}))

@app.route('/signup', methods=['POST'])
def signup():
    id = request.json.get('id')
    password = request.json.get('password')
    name = request.json.get('name')
    if db.users.find_one({"id": id}):
        return jsonify({"message": "Fail"})
    else : 
        db.users.insert_one({"id": id, "password": password, "name": name, "language": "ja-JP", "contextMode" : 0 ,"list":[]})
        return jsonify({"message":"Success"})

@app.route('/login', methods=['POST'])
def login():
    id = request.json.get('id')
    password = request.json.get('password')
    user = db.users.find_one({"id": id, "password": password})
    if user:
        return jsonify({"message" : "Success", "id" : id, "language" : user["language"], "contextMode" : user["contextMode"], "list":user["list"]})
    else :
        return jsonify({"message" : "Fail"})

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file found"}), 400
    language_code = request.form.get('languageCode')
    startTime = time.time()
    transcription_text = ""
    pronunciation = 0
    prevDialog = request.form.get('prevDialog')
    print(prevDialog)
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
        language_code=language_code,
    )
    response = client.recognize(config=config, audio=audio)
    endTime = time.time()
    elapse = endTime - startTime
    print("3-1: stt ", elapse)
    startTime = time.time()
    for result in response.results:
        transcription_text = result.alternatives[0].transcript
        pronunciation = result.alternatives[0].confidence

    chat_response = chat(transcription_text ,prevDialog)
    endTime = time.time()
    elapse = endTime - startTime
    print("4: ai response", elapse)
    audio = synthesize_speech(chat_response, language_code)
    return jsonify({"sttResponse": transcription_text, "chatResponse": chat_response, "audio": audio, "pronunciation" : pronunciation}), 200

@app.route('/evaluation', methods=['POST'])
def evaluation():
    input = request.json.get('input')
    id = request.json.get('id')
    user = db.users.find_one({"id": id})
    language = user['language']
    response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Correct grammer in standard {language}:\n\n {input}.",
            temperature=0,
            max_tokens=60,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
    output = response.choices[0].text.strip().split('\n')
    if len(output) <= 2:
        return jsonify({"grammer": output[0]})
    else:
        return jsonify({"grammer": output[2]})

@app.route('/score', methods=['POST'])
def score():
    input = request.json.get('input')
    input2 = request.json.get('input2')
    letters = ('?', ',', '.')
    replacements = ('', '', '')
    table = input2.maketrans(dict(zip(letters, replacements)))
    input2 = input2.translate(table)
    input = input[0].upper() + input[1:]
    ratio = SequenceMatcher(None, input,input2 ).ratio()
    return jsonify({"grammer_score" : ratio})

@app.route('/fetch', methods=['POST'])
def language():
    id = request.json.get('id')
    user = db.users.find_one({"id": id})
    return jsonify({"language":user['language'] , "context": user['contextMode'], "list":user['list']}), 200

@app.route('/change_language',methods =['POST'] )
def change_language():
    id = request.json.get('id')
    language = request.json.get('language')
    db.users.update_one({"id": id}, {"$set": {"language": language}})
    user = db.users.find_one({"id": id})
    return jsonify({"language":user['language']}),200

@app.route('/flow_flag', methods=['POST'])
def get_flow_flag():
    id = request.json.get('id')
    flow_flag = request.json.get('flow_flag')
    print("in /flow_flag", flow_flag)
    db.users.update_one({"id": id}, {"$set": {"contextMode": flow_flag}})
    user = db.users.find_one({"id": id})
    print("in db",user['contextMode'])
    return jsonify({"contextMode":user['contextMode']}),200

@app.route('/update_list',methods =['POST'] )
def update_list():
    id = request.json.get('id')
    list = request.json.get('list')
    db.users.update_one({"id": id}, {"$set": {"list": list}})
    return jsonify({"message":"success"}),200


@app.route('/credits', methods=['POST'])
def get_user_credits():
    id = request.json.get('id')
    user = db.users.find_one({"id": id})
    return jsonify({"credits": user["credit"]})

@app.route('/update-credits', methods=['POST'])
def update_credits():
    id = request.json.get('id')
    credits = request.json.get('credits')
    db.users.update_one({"id": id}, {"$set": {"credit": credits}})
    return jsonify({"message": "Success"})

@app.route('/update-purchase', methods=['POST'])
def update_purchase():
    id = request.json.get('id')
    items = request.json.get('items')

    db.purchases.insert_one({"id": id, "items": items})
    return jsonify({"message": "Success"})

@app.route('/user-purchases', methods=['POST'])
def get_user_purchases():
    id = request.json.get('id')
    purchases = db.purchases.find({"id": id})
    purchases_list = []
    for purchase in purchases:
        purchases_list.append(purchase['items'])    
    return jsonify({"purchases": purchases_list})

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)