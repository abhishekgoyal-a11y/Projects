import os
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

_chain = None


def build_chain(transcript: str):
    global _chain
    docs = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150).create_documents([transcript])
    retriever = FAISS.from_documents(docs, HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")).as_retriever(search_kwargs={"k": 4})
    prompt = ChatPromptTemplate.from_template(
        "You are a helpful assistant. Using the context below, answer the question in English only, regardless of the language of the context.\n\nContext: {context}\n\nQuestion: {question}"
    )
    _chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | ChatGroq(model="llama-3.3-70b-versatile", temperature=0, api_key=os.getenv("GROQ_API_KEY"))
        | StrOutputParser()
    )


def ask(question: str) -> str:
    if _chain is None:
        raise RuntimeError("No video loaded yet.")
    return _chain.invoke(question)
