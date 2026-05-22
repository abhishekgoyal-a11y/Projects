import wikipedia
from langchain_text_splitters import RecursiveCharacterTextSplitter

# FIX 1: Tell Wikipedia who is asking so they don't block us
wikipedia.set_user_agent("MyWikipediaRAGBot/1.0 (research_project)") 

def fetch_wikipedia_pages(query, num_pages=3):
    """Fetches content from the top Wikipedia results."""
    search_results = wikipedia.search(query, results=num_pages)
    
    pages_data = []
    for title in search_results:
        # --- FIX 3 IS INTEGRATED RIGHT HERE ---
        try:
            page = wikipedia.page(title, auto_suggest=False)
            pages_data.append({
                "title": page.title,
                "content": page.content,
                "url": page.url
            })
        except (wikipedia.exceptions.DisambiguationError, wikipedia.exceptions.PageError):
            continue
        except Exception as e:
            # This catches the JSON error or network drops without crashing
            print(f"Skipping {title} due to network/parsing error: {e}")
            continue
        # ----------------------------------------
            
    return pages_data

def chunk_documents(pages_data):
    """Splits the raw text into intelligent chunks using LangChain."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100, # Overlap helps keep context between chunks
        separators=["\n\n", "\n", ".", " "]
    )
    
    chunks = []
    for page in pages_data:
        splits = text_splitter.split_text(page["content"])
        for split in splits:
            chunks.append({
                "text": split,
                "source": page["url"]
            })
    return chunks