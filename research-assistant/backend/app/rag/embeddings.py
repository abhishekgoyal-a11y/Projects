from langchain_huggingface import HuggingFaceEmbeddings
from app.utils.logger import get_logger
import os

logger = get_logger(__name__)


def get_embeddings() -> HuggingFaceEmbeddings:
    model = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    logger.info(f"Initializing local HuggingFace embeddings: {model}")
    return HuggingFaceEmbeddings(
        model_name=model,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
