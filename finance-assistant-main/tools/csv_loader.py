import pandas as pd

def load_csv(file_path):
    """Loads CSV and ensures no null values break the LLM prompt."""
    df = pd.read_csv(file_path)
    if "Amount" in df.columns:
        df["Amount"] = df["Amount"].fillna(0)
    return df