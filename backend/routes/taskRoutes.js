const express = require('express');

const router = express.Router();
const Task = require('../models/taskModel');
const { createTask, getAllTasks, marksTaskAsCompleted, updateTask, deleteTask, getTodayTasks } = require('../controllers/taskController');
const isLoggedIn = require('../middlewares/isLoggedIn');


router.post('/create', isLoggedIn, createTask);

router.get('/all-tasks', isLoggedIn, getAllTasks);

router.put('/complete/:id', isLoggedIn, marksTaskAsCompleted);

router.put('/update/:id', isLoggedIn, updateTask);

router.delete('/delete/:id', isLoggedIn, deleteTask);

router.get('/today', isLoggedIn, getTodayTasks)
module.exports = router;