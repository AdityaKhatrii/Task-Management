import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";

export function TaskUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask } = useTaskContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Find the task from context
  useEffect(() => {
    if (!id) return;
    const task = tasks.find((t) => String(t.id) === String(id));
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
      setLoading(false);
    } else {
      setError("Task not found.");
      setLoading(false);
    }
  }, [id, tasks]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await updateTask(Number(id), { title, description, dueDate });
      navigate("/update");
    } catch {
      setError("Failed to update task.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-blue-600 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Update Task</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-blue-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-blue-300 rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-blue-700 mb-1">Description</label>
          <textarea
            className="w-full border border-blue-300 rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-blue-700 mb-1">Due Date</label>
          <input
            type="date"
            className="w-full border border-blue-300 rounded px-3 py-2"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}