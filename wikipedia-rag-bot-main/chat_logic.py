from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate

# Initialize the local LLM
llm = Ollama(model="llama3")

def generate_response(query, retrieved_docs, chat_history):
    """Generates an answer using the LLM, context, and memory."""
    
    # Format the context and extract unique sources
    context_text = "\n\n".join([doc.page_content for doc in retrieved_docs])
    sources = list(set([doc.metadata["source"] for doc in retrieved_docs]))
    
    prompt_template = PromptTemplate.from_template("""
    You are an intelligent Wikipedia research assistant.
    Use the following Wikipedia context to answer the user's question. 
    If the answer is not in the context, say "I cannot find the answer in the provided Wikipedia pages."
    Do not hallucinate.

    Context:
    {context}
    
    Previous Conversation History:
    {history}

    User Question: {question}
    
    Answer:
    """)
    
    prompt = prompt_template.format(
        context=context_text,
        history=chat_history,
        question=query
    )
    
    response = llm.invoke(prompt)
    
    return response, sources