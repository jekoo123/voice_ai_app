import os
import openai
import tempfile
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename


app = Flask(__name__)

openai.api_key = "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"

# @app.route('/transcribe', methods=['POST'])
# def transcribe():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file provided'}), 400
#     audio_file = request.files['file']
#     headers = {
#         'Content-Type': 'audio/x-wav',
#         'Authorization': f'Bearer {openai.api_key}',
#     }

#     response = requests.post(
#         'https://api.openai.com/v1/engines/whisper/asr',
#         headers=headers,
#         data=audio_file.read()
#     )

#     if response.status_code != 200:
#         return jsonify({'error': 'Failed to transcribe audio'}), response.status_code

#     transcription = response.json()['choices'][0]['text']
#     return jsonify({'transcription': transcription})
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


@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file found"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join("uploads", filename)
    file.save(file_path)


    # 오디오 파일을 WAV 형식으로 변환
    with tempfile.NamedTemporaryFile(suffix=".wav") as wav_file:
        with open(file_path, 'rb') as f:
            files = {'file': f}
            api_requestor = openai.api_requestor.APIRequestor()
            response = api_requestor.request(
                "POST",
                "/v1/engines/text-davinci-002/audio/transcribe",
                headers={
                    "Content-Type": "multipart/form-data",
                    "Transfer-Encoding": "chunked",
                },
                files=files,
            )
        # WAV 파일을 텍스트로 변환
        with open(wav_file.name, 'rb') as f:
            response = openai.Completion.create(
                engine="text-davinci-002",
                prompt=f"Transcribe the following audio file: {f.read()}",
                max_tokens=2048,
                n_stop=1,
            )

    # 변환된 텍스트 반환
    transcription = response.choices[0].text.strip()
    return jsonify({"transcription": transcription})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
