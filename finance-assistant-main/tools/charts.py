import streamlit as st
import pandas as pd

def render_spending_chart(df: pd.DataFrame):
    """Helper to render basic Streamlit charts for the dashboard."""
    if "Category" in df.columns and "Amount" in df.columns:
        st.bar_chart(df.groupby("Category")["Amount"].sum())
    else:
        st.info("Run the categorizer agent first to generate chart data.")