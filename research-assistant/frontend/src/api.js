import axios from 'axios'

// Use relative URLs — Vite dev server proxies /query and /health to localhost:8000
// This avoids cross-origin issues entirely
const client = axios.create({
  baseURL: '',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
})

export async function sendQuery(question) {
  const response = await client.post('/query', { question })
  return response.data
}

export async function checkHealth() {
  const response = await client.get('/health')
  return response.data
}
