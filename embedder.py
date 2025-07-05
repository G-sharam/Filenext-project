import os
import fitz  # PyMuPDF
import faiss
import pickle
from tqdm import tqdm
from sentence_transformers import SentenceTransformer

# Setup
model = SentenceTransformer("all-MiniLM-L6-v2")
data_dir = "data"
index_file = "faiss_index.bin"
meta_file = "metadata.pkl"

# Storage
texts = []
metas = []

def read_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def read_pdf(file_path):
    doc = fitz.open(file_path)
    return "\n".join(page.get_text() for page in doc)

# Step 1: Load and process files
for fname in tqdm(os.listdir(data_dir)):
    fpath = os.path.join(data_dir, fname)
    if fname.endswith(".txt"):
        content = read_txt(fpath)
    elif fname.endswith(".pdf"):
        content = read_pdf(fpath)
    else:
        continue  # Skip unsupported
    texts.append(content)
    metas.append({"filename": fname, "type": fname.split('.')[-1]})

# Step 2: Generate embeddings
embeddings = model.encode(texts, show_progress_bar=True)

# Step 3: Create FAISS index
dimension = embeddings[0].shape[0]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Step 4: Save index and metadata
faiss.write_index(index, index_file)
with open(meta_file, "wb") as f:
    pickle.dump(metas, f)

print(f"\n✅ Indexed {len(metas)} files into {index_file}")
