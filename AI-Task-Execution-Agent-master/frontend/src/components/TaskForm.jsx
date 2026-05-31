import { useState } from 'react';
import axios from 'axios';

export default function TaskForm({ onTaskStarted }) {
  const [task, setTask] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim() || !email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/run-task', { task, email });
      onTaskStarted(res.data.task_id);
      setTask('');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-blue-400 mb-4">🤖 New Task</h2>
      <textarea
        className="w-full bg-gray-800 text-white rounded-lg p-3 mb-3 border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
        rows={3}
        placeholder='e.g. "Research competitors of Notion and make a report"'
        value={task}
        onChange={(e) => setTask(e.target.value)}
        required
      />
      <input
        type="email"
        className="w-full bg-gray-800 text-white rounded-lg p-3 mb-4 border border-gray-600 focus:outline-none focus:border-blue-500"
        placeholder="Your email for report delivery"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? '⏳ Starting...' : '🚀 Run Task'}
      </button>
    </form>
  );
}
