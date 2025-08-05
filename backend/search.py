import faiss
import pickle
from sentence_transformers import SentenceTransformer

# Load resources
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("faiss_index.bin")
with open("metadata.pkl", "rb") as f:
    metas = pickle.load(f)

# Get user query
query = input("🔍 Enter your search query: ")

# Encode query
q_embed = model.encode([query])

# Search
k = 5  # number of results
D, I = index.search(q_embed, k)

print("\n📂 Top Matches:\n")
for idx, score in zip(I[0], D[0]):
    if idx < len(metas):
        print(f"- {metas[idx]['filename']} ({metas[idx]['type']}) | Score: {score:.2f}")
