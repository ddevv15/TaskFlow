import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskManager.css';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5555';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}/api/tasks/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTasks(data);
  };

  const handleAddTask = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}/api/tasks/add-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: taskTitle, date: taskDate }),
    });

    if (response.ok) {
      setTaskTitle('');
      setTaskDate('');
      fetchTasks();
    }
  };

  const handleEditTask = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${apiUrl}/api/tasks/edit-task/${editingTask._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle, date: taskDate }),
      }
    );

    if (response.ok) {
      setEditingTask(null);
      setTaskTitle('');
      setTaskDate('');
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}/api/tasks/delete-task/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      fetchTasks();
    }
  };

  const handleSearch = () => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="task-manager">
      <div className="task-manager-controls">
        {/* Home Button to return to Dashboard */}
        <button onClick={() => navigate('/dashboard')}>Home</button>

        <input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <div className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
          <button onClick={editingTask ? handleEditTask : handleAddTask}>
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {editingTask && (
            <button onClick={() => setEditingTask(null)}>Cancel Edit</button>
          )}
        </div>
      </div>

      <div className="task-list">
        <h2>Task List</h2>
        <ul>
          {handleSearch().map((task) => (
            <li key={task._id}>
              <span>
                {task.title} - {new Date(task.date).toDateString()}
              </span>
              <button
                onClick={() => {
                  setEditingTask(task);
                  setTaskTitle(task.title);
                  setTaskDate(task.date.split('T')[0]);
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaskManager;
