const express = require('express');
const Task = require('../models/Task');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/add-task', verifyToken, async (req, res) => {
    const { title, date } = req.body;
  
    try {
      const task = new Task({ userId: req.userId, title, date });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error adding task' });
    }
  });
  
  // Delete a task
  router.delete('/delete-task/:id', verifyToken, async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  });
  
  // Edit a task
  router.put('/edit-task/:id', verifyToken, async (req, res) => {
    const { title, date } = req.body;
  
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, date },
        { new: true }
      );
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task' });
    }
  });

// Fetch tasks for the logged-in user
router.get('/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

module.exports = router;
