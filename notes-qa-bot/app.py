"""Smart Q&A Bot for Your Notes — Streamlit + LangChain + Chroma + OpenAI (RAG beginner app).

Run from this directory: streamlit run app.py
Set OPENAI_API_KEY in .streamlit/secrets.toml (see README).
"""

import streamlit as st
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

st.set_page_config(page_title="Notes Q&A", layout="centered")
st.title("Smart Q&A Bot for Your Notes")
st.caption("Index a small .txt file or pasted notes, then ask questions grounded in that text (RAG).")

OPENAI_API_KEY = st.secrets["OPENAI_API_KEY"]
CHAT_MODEL = "gpt-4o-mini"
EMBED_MODEL = "text-embedding-3-small"
MAX_NOTES_CHARS = 80_000

if "vectorstore" not in st.session_state:
    st.session_state.vectorstore = None

notes = st.text_area("Or paste notes here", height=160, placeholder="Lecture bullets, reading summary…")
upload = st.file_uploader("Upload a plain-text file (.txt)", type=["txt"])

if st.button("Build / refresh index", type="primary"):
    raw = ""
    if upload is not None:
        raw = upload.read().decode("utf-8", errors="replace")
    elif notes.strip():
        raw = notes.strip()
    if not raw.strip():
        st.warning("Add a .txt upload or paste some text before indexing.")
    elif len(raw) > MAX_NOTES_CHARS:
        st.warning(f"Notes are too long for this demo (max {MAX_NOTES_CHARS:,} characters). Trim and try again.")
    else:
        with st.spinner("Chunking, embedding, storing in Chroma…"):
            try:
                docs = [Document(page_content=raw)]
                splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
                chunks = splitter.split_documents(docs)
                emb = OpenAIEmbeddings(model=EMBED_MODEL, api_key=OPENAI_API_KEY)
                st.session_state.vectorstore = Chroma.from_documents(chunks, embedding=emb)
                st.success(f"Indexed {len(chunks)} chunks.")
            except Exception as err:
                st.session_state.vectorstore = None
                st.error(f"Index failed: {err}")

question = st.text_input("Your question", placeholder="What does the text say about…?")

if st.button("Answer from my notes"):
    if st.session_state.vectorstore is None:
        st.warning("Build an index first.")
    elif not question.strip():
        st.warning("Please enter a question.")
    else:
        with st.spinner("Retrieving chunks and calling the model…"):
            try:
                llm = ChatOpenAI(model=CHAT_MODEL, temperature=0, api_key=OPENAI_API_KEY)
                retriever = st.session_state.vectorstore.as_retriever(search_kwargs={"k": 4})
                qa = RetrievalQA.from_chain_type(
                    llm=llm,
                    chain_type="stuff",
                    retriever=retriever,
                    return_source_documents=True,
                )
                out = qa.invoke({"query": question})
                st.markdown(out["result"])
                with st.expander("Sources (retrieved chunks)"):
                    for i, doc in enumerate(out["source_documents"], start=1):
                        preview = doc.page_content[:700]
                        suffix = "…" if len(doc.page_content) > 700 else ""
                        st.markdown(f"**Chunk {i}**")
                        st.write(preview + suffix)
            except Exception as err:
                st.error(f"Something went wrong: {err}")
