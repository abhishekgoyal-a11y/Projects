from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# Using a lightweight, fast, and free embedding model
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def build_vector_store(chunks):
    """Creates a FAISS index from text chunks."""
    texts = [chunk["text"] for chunk in chunks]
    metadatas = [{"source": chunk["source"]} for chunk in chunks]
    
    # LangChain's FAISS wrapper makes this much cleaner than raw FAISS
    vectorstore = FAISS.from_texts(texts, embeddings, metadatas=metadatas)
    return vectorstore

def search_vector_store(vectorstore, query, k=4):
    """Retrieves the most relevant chunks based on the query."""
    docs = vectorstore.similarity_search(query, k=k)
    return docs