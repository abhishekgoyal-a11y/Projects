import os
import json
from datetime import datetime, timezone
from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.rag.embeddings import get_embeddings
from app.utils.logger import get_logger

logger = get_logger(__name__)

VECTOR_STORE_PATH = os.getenv("VECTOR_STORE_PATH", "./data/vector_store")
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "800"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "100"))


class KnowledgeMemory:
    def __init__(self):
        self.embeddings = get_embeddings()
        self.store_path = Path(VECTOR_STORE_PATH)
        self.store_path.mkdir(parents=True, exist_ok=True)
        self.vectorstore: FAISS | None = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
        self._load_or_init()

    def _load_or_init(self):
        index_file = self.store_path / "index.faiss"
        if index_file.exists():
            try:
                self.vectorstore = FAISS.load_local(
                    str(self.store_path),
                    self.embeddings,
                    allow_dangerous_deserialization=True,
                )
                logger.info(f"Loaded existing FAISS store from {self.store_path}")
            except Exception as e:
                logger.warning(f"Failed to load FAISS store: {e}. Starting fresh.")
                self.vectorstore = None
        else:
            logger.info("No existing vector store found. Will create on first insert.")

    def add_documents(self, texts: list[str], metadatas: list[dict] | None = None) -> int:
        if not texts:
            return 0

        now = datetime.now(timezone.utc).isoformat()
        docs = []

        for i, text in enumerate(texts):
            meta = metadatas[i] if metadatas and i < len(metadatas) else {}
            meta.setdefault("timestamp", now)
            meta.setdefault("source", "unknown")

            chunks = self.text_splitter.split_text(text)
            for chunk in chunks:
                docs.append(Document(page_content=chunk, metadata=meta.copy()))

        if not docs:
            return 0

        if self.vectorstore is None:
            self.vectorstore = FAISS.from_documents(docs, self.embeddings)
        else:
            self.vectorstore.add_documents(docs)

        self._save()
        logger.info(f"Stored {len(docs)} chunks from {len(texts)} documents")
        return len(docs)

    def similarity_search(
        self, query: str, k: int = 4, score_threshold: float | None = None
    ) -> list[tuple[Document, float]]:
        if self.vectorstore is None:
            logger.info("Vector store empty — no results")
            return []

        try:
            results = self.vectorstore.similarity_search_with_score(query, k=k)
            if score_threshold is not None:
                results = [(doc, score) for doc, score in results if score <= score_threshold]
            logger.debug(f"Found {len(results)} results for query: {query[:60]}...")
            return results
        except Exception as e:
            logger.error(f"Similarity search failed: {e}")
            return []

    def _save(self):
        try:
            self.vectorstore.save_local(str(self.store_path))
            logger.debug(f"Saved FAISS store to {self.store_path}")
        except Exception as e:
            logger.error(f"Failed to save FAISS store: {e}")

    @property
    def is_empty(self) -> bool:
        return self.vectorstore is None
