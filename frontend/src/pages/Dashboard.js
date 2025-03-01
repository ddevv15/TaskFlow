import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5555';
  const fetchTasks = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}/api/tasks/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTasks(data);
  };

  const getTodayTasks = () => {
    const today = new Date();
    return tasks.filter(
      (task) => new Date(task.date).toDateString() === today.toDateString()
    );
  };

  const getFutureTasks = () => {
    const today = new Date();
    return tasks.filter((task) => new Date(task.date) > today);
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter((task) => new Date(task.date) < today);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = '';
    navigate('/login');
  };

  const renderTasks = () => {
    let filteredTasks = [];
    if (selectedFilter === 'today') filteredTasks = getTodayTasks();
    if (selectedFilter === 'future') filteredTasks = getFutureTasks();
    if (selectedFilter === 'overdue') filteredTasks = getOverdueTasks();

    return filteredTasks.map((task) => (
      <li key={task._id}>
        {task.title} - {new Date(task.date).toDateString()}
      </li>
    ));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <img src="/TFLogo.png" alt="Logo" className="dashboard-logo" />
          <h1>TaskFlow</h1>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <button onClick={() => setSelectedFilter('today')}>
            Today’s Tasks
          </button>
          <button onClick={() => setSelectedFilter('future')}>
            Future Tasks
          </button>
          <button onClick={() => setSelectedFilter('overdue')}>
            Overdue Tasks
          </button>
          <hr />
          <button onClick={() => navigate('/task-manager')}>
            Task Manager
          </button>
          <button>Customization</button>
          <button>Category</button>
          <br />
          <button onClick={handleLogout}>Logout</button>
        </aside>

        <main className="dashboard-main">
          <h2>Tasks</h2>
          <ul>{renderTasks()}</ul>
        </main>

        <aside className="dashboard-calendar">
          <button>Calendar View</button>
          <Calendar
            onChange={setDate} // Set selected date
            value={date} // Current date in state
          />
          <p>Selected date: {date.toDateString()}</p>
        </aside>
      </div>

      <div className="dashboard-future">
        <p>Task Temperature Bar Coming Soon...</p>
      </div>

      <footer className="dashboard-footer">
        <p>Made by Group 9</p>
      </footer>
    </div>
  );
}

export default Dashboard;
