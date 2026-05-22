import pandas as pd

def get_total_spending(df: pd.DataFrame) -> float:
    """Helper function to calculate total spend before passing to AI."""
    if "Amount" in df.columns:
        return float(df["Amount"].sum())
    return 0.0