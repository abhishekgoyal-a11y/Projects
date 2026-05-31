import axios from 'axios'

const API_URL =
  'https://api.groq.com/openai/v1/chat/completions'

export const askGroq = async (
  prompt
) => {

  try {

    const response =
      await axios.post(

        API_URL,

        {
          model:
            'llama-3.1-8b-instant',

          messages: [
            {
              role: 'user',
              content: String(prompt)
            }
          ],

          temperature: 0.7,

          max_tokens: 200
        },

        {
          headers: {

            Authorization:
              `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,

            'Content-Type':
              'application/json'
          }
        }
      )

    return response.data
      .choices[0]
      .message
      .content

  } catch (error) {

    console.log(
      'FULL GROQ ERROR:',
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    )

    return 'AI unavailable'
  }
}