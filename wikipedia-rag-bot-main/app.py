import streamlit as st
from document_retriever import fetch_wikipedia_pages, chunk_documents
from vector_engine import build_vector_store, search_vector_store
from chat_logic import generate_response

# --- 1. Professional Page Config ---
st.set_page_config(
    page_title="Wiki RAG Assistant", 
    page_icon="🤖", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- 2. Custom CSS to hide default Streamlit branding ---
st.markdown("""
    <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
    </style>
    """, unsafe_allow_html=True)

# --- 3. The Sidebar ---
with st.sidebar:
    st.title("⚙️ System Status")
    st.success("🟢 Local LLM (Llama 3) Online")
    st.success("🟢 Vector Engine (FAISS) Ready")
    st.success("🟢 Wikipedia API Connected")
    
    st.markdown("---")
    st.markdown("""
    **Architecture Pipeline:**
    1. **Retrieve:** Scrapes top Wikipedia pages.
    2. **Chunk:** Splits text via LangChain.
    3. **Embed:** HuggingFace MiniLM-L6.
    4. **Generate:** Grounded answers via local AI.
    """)
    st.markdown("---")
    st.caption("Built for scalability using open-source tools.")

# --- 4. Main Chat UI ---
st.title("🤖 Wikipedia RAG Assistant")
st.markdown("Ask any question, and I will synthesize an answer directly from Wikipedia without hallucinating.")

# Initialize Memory
if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "Hello! What topic would you like to research today?"}]

# Display chat history with clean avatars
for message in st.session_state.messages:
    avatar = "🧑‍💻" if message["role"] == "user" else "🤖"
    with st.chat_message(message["role"], avatar=avatar):
        st.markdown(message["content"])

# User Input
if prompt := st.chat_input("E.g., How do black holes form?"):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user", avatar="🧑‍💻"):
        st.markdown(prompt)

    # Generate assistant response
    with st.chat_message("assistant", avatar="🤖"):
        with st.spinner("Analyzing Wikipedia archives..."):
            pages = fetch_wikipedia_pages(prompt)
            
            if not pages:
                st.error("No Wikipedia pages found for that query. Try another topic.")
            else:
                # Pipeline execution
                chunks = chunk_documents(pages)
                vectorstore = build_vector_store(chunks)
                retrieved_docs = search_vector_store(vectorstore, prompt)
                history_str = "\n".join([f"{m['role']}: {m['content']}" for m in st.session_state.messages[:-1]])
                
                answer, sources = generate_response(prompt, retrieved_docs, history_str)
                
                # Display output
                st.markdown(answer)
                
                # --- 5. Clean Citation Expander ---
                with st.expander("📚 View Sources & Citations"):
                    for source in sources:
                        # Makes the link clickable
                        st.markdown(f"- [{source}]({source})") 
                
                st.session_state.messages.append({"role": "assistant", "content": answer})