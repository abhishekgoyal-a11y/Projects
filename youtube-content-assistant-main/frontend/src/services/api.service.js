const API_BASE_URL = "http://localhost:5000/api";

export const generateContent = async (niche, topic) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ niche, topic }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content from server.");
    }

    return await response.json();
  } catch (error) {
    console.error("API Service Error:", error);
    throw error;
  }
};
