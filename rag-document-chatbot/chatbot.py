import os
import truststore
truststore.inject_into_ssl()
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from operator import itemgetter

INDEX_DIR = "faiss_index"
EMBED_MODEL = "all-MiniLM-L6-v2"
GROQ_MODEL = "llama-3.3-70b-versatile"

if not os.path.exists(INDEX_DIR):
    print("Index not found. Run 'python ingest.py <your_document.pdf>' first.")
    raise SystemExit(1)

# ── Load vector store ──────────────────────────────────────────────────────────
embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
vectorstore = FAISS.load_local(
    INDEX_DIR, embeddings, allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# ── LLM (Groq) ────────────────────────────────────────────────────────────────
llm = ChatGroq(model=GROQ_MODEL, temperature=0)

# ── Prompt ────────────────────────────────────────────────────────────────────
system_prompt = """You are a helpful assistant that answers questions \
about a document. Use only the context provided below to answer. \
If the answer is not in the context, say "I don't know based on the document."

Context:
{context}"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{question}"),
])

# ── Chain ─────────────────────────────────────────────────────────────────────
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

chain = (
    {
        "context":  itemgetter("question") | retriever | format_docs,
        "question": itemgetter("question"),
        "history":  itemgetter("history"),
    }
    | prompt
    | llm
    | StrOutputParser()
)

# ── Memory ────────────────────────────────────────────────────────────────────
store = {}

def get_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

chat = RunnableWithMessageHistory(
    chain,
    get_history,
    input_messages_key="question",
    history_messages_key="history",
)

config = {"configurable": {"session_id": "default"}}

# ── Chat loop ─────────────────────────────────────────────────────────────────
print(f"RAG Document Chatbot (Groq / {GROQ_MODEL}) — type 'quit' to exit\n")
while True:
    try:
        question = input("You: ").strip()
    except (EOFError, KeyboardInterrupt):
        print("\nBye!")
        break
    if question.lower() in ("quit", "exit", "q"):
        break
    if not question:
        continue
    answer = chat.invoke({"question": question}, config=config)
    print(f"Bot: {answer}\n")
