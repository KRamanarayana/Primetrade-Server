const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get All Tasks
router.get('/', authMiddleware, async (req, res) => {
    const { search, filter, page = 1, limit = 10 } = req.query;
    try {
        let query = { user: req.user.userId };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (filter === 'completed') {
            query.isCompleted = true;
        } else if (filter === 'pending') {
            query.isCompleted = false;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Task.countDocuments(query);
        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            tasks,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalTasks: total
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create Task
router.post('/', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    try {
        const task = new Task({
            title,
            description,
            user: req.user.userId
        });
        const savedTask = await task.save();
        res.json(savedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Task
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, isCompleted } = req.body;
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.user.toString() !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (isCompleted !== undefined) task.isCompleted = isCompleted;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete Task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.user.toString() !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
