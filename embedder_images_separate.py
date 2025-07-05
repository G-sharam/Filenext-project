import os
import clip
import torch
import numpy as np
from PIL import Image
import faiss
import pickle

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

image_dir = "data"
image_files = [f for f in os.listdir(image_dir) if f.lower().endswith((".jpg", ".jpeg", ".png"))]

embeddings = []
metadata = []

for fname in image_files:
    img_path = os.path.join(image_dir, fname)
    try:
        image = preprocess(Image.open(img_path)).unsqueeze(0).to(device)
        with torch.no_grad():
            embedding = model.encode_image(image).cpu().numpy()[0]
        embeddings.append(embedding)
        metadata.append({
            "filename": fname,
            "type": "image"
        })
        print(f"✅ Embedded: {fname}")
    except Exception as e:
        print(f"❌ Skipped {fname}: {e}")

if not embeddings:
    print("⚠️ No valid images found.")
    exit()

# Create separate FAISS index for image embeddings
dimension = embeddings[0].shape[0]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

# Save image index and metadata
faiss.write_index(index, "faiss_images.bin")
with open("metadata_images.pkl", "wb") as f:
    pickle.dump(metadata, f)

print("✅ Saved image index and metadata.")
