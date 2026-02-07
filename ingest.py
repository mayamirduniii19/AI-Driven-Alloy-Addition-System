
import os
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Configuration
DOCS_DIR = os.path.join(os.path.dirname(__file__), 'documents')
VECTOR_STORE_DIR = os.path.join(os.path.dirname(__file__), 'vector_store')
VECTORIZER_PATH = os.path.join(VECTOR_STORE_DIR, 'vectorizer.pkl')
MATRIX_PATH = os.path.join(VECTOR_STORE_DIR, 'tfidf_matrix.pkl')
CHUNKS_PATH = os.path.join(VECTOR_STORE_DIR, 'chunks.pkl')

def load_documents():
    documents = []
    if not os.path.exists(DOCS_DIR):
        print(f"Error: {DOCS_DIR} does not exist.")
        return []
        
    for filename in os.listdir(DOCS_DIR):
        if filename.endswith(".txt"):
            filepath = os.path.join(DOCS_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                text = f.read()
                documents.append({"source": filename, "text": text})
    return documents

def chunk_text(text, source, chunk_size=500, overlap=50):
    # Simple chunking by characters for now (or split by newlines if preferred)
    chunks = []
    # Split by paragraphs first
    paragraphs = text.split('\n\n')
    for p in paragraphs:
        if len(p.strip()) > 10:
            chunks.append({"source": source, "content": p.strip()})
    return chunks

def ingest():
    print("Loading documents...")
    raw_docs = load_documents()
    print(f"Loaded {len(raw_docs)} files.")

    all_chunks = []
    for doc in raw_docs:
        chunks = chunk_text(doc['text'], doc['source'])
        all_chunks.extend(chunks)
    
    print(f"Created {len(all_chunks)} chunks.")

    print("Vectorizing...")
    vectorizer = TfidfVectorizer(stop_words='english')
    corpus = [chunk['content'] for chunk in all_chunks]
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # Ensure vector store directory exists
    os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

    print("Saving vector store...")
    with open(VECTORIZER_PATH, 'wb') as f:
        pickle.dump(vectorizer, f)
    with open(MATRIX_PATH, 'wb') as f:
        pickle.dump(tfidf_matrix, f)
    with open(CHUNKS_PATH, 'wb') as f:
        pickle.dump(all_chunks, f)
    
    print("Ingestion complete.")

if __name__ == "__main__":
    ingest()
