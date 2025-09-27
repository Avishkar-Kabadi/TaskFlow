const taskModel = require('../models/taskModel');


exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }

        const newTask = await taskModel.create({ title, description, user: userId });
        if (!newTask) {
            return res.status(400).json({ message: "Task creation failed" });
        }
        return res.status(201).json({ message: "Task Created successfully", newTask });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await taskModel.find({ user: userId });
        return res.status(200).json({ tasks });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.marksTaskAsCompleted = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const task = await taskModel.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.completed = true;
        await task.save();
        return res.status(200).json({ message: "Task marked as completed", task });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const task = await taskModel.findOneAndDelete({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user.id;
        const task = await taskModel.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (title) task.title = title;
        if (description) task.description = description;
        await task.save();
        return res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.getTodayTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const tasks = await taskModel.find({
            user: userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        return res.status(200).json({ tasks });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}