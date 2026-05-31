import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskProgress from './components/TaskProgress';
import TaskHistory from './components/TaskHistory';

export default function App() {
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [historyKey, setHistoryKey] = useState(0);

  const handleTaskStarted = (taskId) => {
    setActiveTaskId(taskId);
    setHistoryKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🤖 AI Task Agent</h1>
          <p className="text-gray-400">Give a high-level task — the agent plans, researches, reports & emails.</p>
        </div>

        <TaskForm onTaskStarted={handleTaskStarted} />
        <TaskProgress taskId={activeTaskId} />
        <TaskHistory refresh={historyKey} />
      </div>
    </div>
  );
}
