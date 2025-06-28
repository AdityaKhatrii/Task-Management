import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";

export function UpdateTasks() {
  const { tasks, loading } = useTaskContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-blue-600 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">All Tasks (Update)</h2>
      <div className="space-y-4">
        {tasks.length === 0 && <div>No tasks found.</div>}
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <div className="font-semibold">{task.title}</div>
              <div className="text-sm text-gray-500">{task.description}</div>
              <div className="text-xs text-gray-400">{task.dueDate?.slice(0, 10)}</div>
            </div>
            <button
              className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate(`/update/${task.id}`)}
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}