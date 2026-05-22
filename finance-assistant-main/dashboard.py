import streamlit as st
import pandas as pd
import os
from tools.csv_loader import load_csv
from crew import create_finance_crew

os.environ["OPENAI_API_KEY"] = "NA"

st.set_page_config(page_title="AI Finance Assistant", layout="wide")
st.title("💰 AI Personal Finance Assistant")

uploaded_file = st.file_uploader("Upload CSV", type=["csv"])

if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    
    if "Amount" in df.columns:
        df["Amount"] = df["Amount"].fillna(0)
        
    st.subheader("Raw Transaction Data")
    st.dataframe(df, use_container_width=True)
    
    if st.button("🤖 Analyze with AI Agents"):
        with st.spinner("Agents are analyzing your finances..."):
            finance_crew = create_finance_crew(df.to_string())
            result = finance_crew.kickoff()
            
            st.success("Analysis Complete!")
            st.subheader("📊 AI Financial Report")
            st.markdown(result)