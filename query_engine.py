
import os
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Configuration
VECTOR_STORE_DIR = os.path.join(os.path.dirname(__file__), 'vector_store')
VECTORIZER_PATH = os.path.join(VECTOR_STORE_DIR, 'vectorizer.pkl')
MATRIX_PATH = os.path.join(VECTOR_STORE_DIR, 'tfidf_matrix.pkl')
CHUNKS_PATH = os.path.join(VECTOR_STORE_DIR, 'chunks.pkl')

class RAGQueryEngine:
    def __init__(self):
        self.vectorizer = None
        self.tfidf_matrix = None
        self.chunks = None
        self.load_models()

    def load_models(self):
        try:
            with open(VECTORIZER_PATH, 'rb') as f:
                self.vectorizer = pickle.load(f)
            with open(MATRIX_PATH, 'rb') as f:
                self.tfidf_matrix = pickle.load(f)
            with open(CHUNKS_PATH, 'rb') as f:
                self.chunks = pickle.load(f)
        except FileNotFoundError:
            print("Vector store not found. Please run ingest.py first.")

    def query(self, query_text, top_k=3):
        if self.vectorizer is None or self.tfidf_matrix is None:
            return [{"content": "Error: Knowledge base not initialized.", "source": "System", "score": 0.0}]

        query_vec = self.vectorizer.transform([query_text])
        cosine_sim = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get top_k indices
        related_docs_indices = cosine_sim.argsort()[:-top_k-1:-1]
        
        results = []
        for idx in related_docs_indices:
            score = cosine_sim[idx]
            if score > 0.05: # Threshold to filter irrelevant results
                chunk = self.chunks[idx]
                results.append({
                    "content": chunk['content'],
                    "source": chunk['source'],
                    "score": float(score)
                })
        
        return results

if __name__ == "__main__":
    # Test
    engine = RAGQueryEngine()
    response = engine.query("What is the recovery rate of Chromium?")
    for res in response:
        print(f"[{res['score']:.2f}] {res['source']}: {res['content']}")
