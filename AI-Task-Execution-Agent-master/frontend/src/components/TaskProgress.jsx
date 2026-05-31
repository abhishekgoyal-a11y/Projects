import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_LABELS = {
  pending:          { label: 'Pending',           icon: '⏳', color: 'text-gray-400' },
  planning:         { label: 'Planning...',        icon: '🧠', color: 'text-yellow-400' },
  searching:        { label: 'Searching Web...',   icon: '🌐', color: 'text-blue-400' },
  summarizing:      { label: 'Summarizing...',     icon: '📚', color: 'text-purple-400' },
  generating_report:{ label: 'Generating Report',  icon: '📄', color: 'text-orange-400' },
  sending_email:    { label: 'Sending Email...',   icon: '📧', color: 'text-teal-400' },
  completed:        { label: 'Completed!',         icon: '✅', color: 'text-green-400' },
  failed:           { label: 'Failed',             icon: '❌', color: 'text-red-400' },
};

async function downloadPDF(reportUrl) {
  const path = reportUrl.replace(/\\/g, '/');
  const res = await axios.get(`/api/download/${path}`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = path.split('/').pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default function TaskProgress({ taskId }) {
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!taskId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/task/${taskId}`);
        setTask(res.data);
        if (['completed', 'failed'].includes(res.data.status)) clearInterval(interval);
      } catch {}
    }, 2000);
    return () => clearInterval(interval);
  }, [taskId]);

  if (!task) return null;

  const s = STATUS_LABELS[task.status] || STATUS_LABELS.pending;

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-blue-400">📊 Progress</h2>
        <span className={`font-semibold ${s.color}`}>{s.icon} {s.label}</span>
      </div>

      <p className="text-gray-400 text-sm mb-4 italic">"{task.input}"</p>

      <div className="space-y-2 mb-4">
        {task.steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-green-400">
            <span>✔</span><span>{s.step}</span>
          </div>
        ))}
      </div>

      {task.error && (
        <p className="text-red-400 text-sm bg-red-900/20 rounded p-2">Error: {task.error}</p>
      )}

      {task.status === 'completed' && (
        <div className="flex gap-3 mt-4">
          {task.report_url && (
            <button
              onClick={() => downloadPDF(task.report_url)}
              className="flex-1 text-center bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition"
            >
              📄 Download Report
            </button>
          )}
          <div className="flex-1 text-center bg-teal-700 text-white py-2 rounded-lg text-sm font-semibold">
            📧 Sent to {task.email}
          </div>
        </div>
      )}
    </div>
  );
}
