import os
import sys
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

INDEX_DIR = "faiss_index"
EMBED_MODEL = "all-MiniLM-L6-v2"


def ingest(pdf_path: str, index_dir: str = INDEX_DIR):
    if not os.path.exists(pdf_path):
        print(f"Error: file not found — {pdf_path}")
        sys.exit(1)

    print(f"Loading {pdf_path}...")
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    print(f"  Loaded {len(docs)} pages")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=60,
    )
    chunks = splitter.split_documents(docs)
    print(f"  Split into {len(chunks)} chunks")

    print(f"  Embedding with {EMBED_MODEL} (local, no API key)...")
    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
    vectorstore = FAISS.from_documents(chunks, embeddings)
    vectorstore.save_local(index_dir)
    print(f"  Index saved to ./{index_dir}/")
    print("Done. Run chatbot.py to start chatting.")


if __name__ == "__main__":
    pdf = sys.argv[1] if len(sys.argv) > 1 else "document.pdf"
    ingest(pdf)
