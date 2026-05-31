import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_COLORS = {
  completed: 'text-green-400',
  failed: 'text-red-400',
  pending: 'text-gray-400',
};

export default function TaskHistory({ refresh }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('/api/tasks').then(r => setTasks(r.data.reverse())).catch(() => {});
  }, [refresh]);

  if (!tasks.length) return null;

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 mt-4">
      <h2 className="text-xl font-semibold text-blue-400 mb-4">🗂 Task History</h2>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {tasks.map(t => (
          <div key={t.id} className="bg-gray-800 rounded-lg p-3 text-sm">
            <div className="flex justify-between items-start">
              <p className="text-white font-medium truncate max-w-xs">{t.input}</p>
              <span className={`ml-2 font-semibold capitalize ${STATUS_COLORS[t.status] || 'text-yellow-400'}`}>
                {t.status}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">{t.created_at?.slice(0, 19).replace('T', ' ')} UTC</p>
          </div>
        ))}
      </div>
    </div>
  );
}
