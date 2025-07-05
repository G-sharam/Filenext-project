from flask import send_from_directory
import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import numpy as np
import clip
import torch

app = Flask(__name__)
CORS(app)

# Load models
device = "cuda" if torch.cuda.is_available() else "cpu"
text_model = SentenceTransformer("all-MiniLM-L6-v2")
clip_model, _ = clip.load("ViT-B/32", device=device)

# Load indexes and metadata
text_index = faiss.read_index("faiss_index.bin")
with open("metadata.pkl", "rb") as f:
    text_meta = pickle.load(f)

image_index = faiss.read_index("faiss_images.bin")
with open("metadata_images.pkl", "rb") as f:
    image_meta = pickle.load(f)

@app.route("/files/<path:filename>")
def serve_file(filename):
    filepath = os.path.join("data", filename)
    if not os.path.exists(filepath):
        return f"❌ File not found: {filepath}", 404
    return send_from_directory("data", filename)



@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "Missing query"}), 400

    # Text query → both encoders
    text_vec = text_model.encode([query])
    image_vec = clip_model.encode_text(clip.tokenize([query]).to(device)).cpu().detach().numpy()

    k = 5
    text_D, text_I = text_index.search(text_vec, k)
    image_D, image_I = image_index.search(image_vec, k)

    results = []

    for idx, score in zip(text_I[0], text_D[0]):
        if idx < len(text_meta):
            results.append({
                "filename": text_meta[idx]["filename"],
                "type": text_meta[idx]["type"],
                "score": float(score)
            })

    for idx, score in zip(image_I[0], image_D[0]):
        if idx < len(image_meta):
            results.append({
                "filename": image_meta[idx]["filename"],
                "type": image_meta[idx]["type"],
                "score": float(score)
            })

    # Sort by score (lower = more similar in L2 space)
    results = sorted(results, key=lambda x: x["score"])
    return jsonify(results)
print("🚀 Flask app is starting on http://localhost:5000")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
