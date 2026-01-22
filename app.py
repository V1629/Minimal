import os
import base64
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv()

app = Flask(__name__)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def encode_image_to_base64(image_file):
    return base64.b64encode(image_file.read()).decode("utf-8")

@app.route("/")
def index():
    return render_template("index.html")





#TEXT ONLY
@app.route("/text-query", methods=["POST"])
def text_query():
    text = request.form.get("text")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    message = HumanMessage(content=[{"type": "text", "text": text}])
    response = llm.invoke([message])

    return jsonify({"response": response.content})




#IMAGE + TEXT
@app.route("/vision-query", methods=["POST"])
def vision_query():
    text = request.form.get("text", "")
    image = request.files.get("image")


    base64_image = encode_image_to_base64(image)

    message = HumanMessage(content=[
        {"type": "text", "text": text},
        {
            "type": "image_url",
            "image_url": f"data:image/jpeg;base64,{base64_image}"
        }
    ])

    response = llm.invoke([message])
    return jsonify({"response": response.content})

if __name__ == "__main__":
    app.run(debug=True)
