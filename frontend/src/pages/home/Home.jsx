"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logo from "../../assets/taskflow-logo.jpg";
import profile from "../../assets/user-profile-avatar.jpg";
import { useAuth } from "../../AuthContext";
import {
  createTask,
  deleteTask,
  getAllTasks,
  markedAsCompleted,
  updateTask,
} from "../../service/TaskService";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetTasks();
  }, []);

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  // Task form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const userData = localStorage.getItem("userData");

  const { email, name } = JSON.parse(userData);

  const [tasks, setTasks] = useState([]);

  const handleCancel = () => {
    setTaskTitle("");
    setTaskDescription("");
    setEditingTask(null);
    setShowAddTaskModal(false);
    setShowEditTaskModal(false);
  };

  const handleGetTasks = async () => {
    try {
      const response = await getAllTasks();
      setTasks(response);
    } catch (error) {
      error("Error fetching tasks:", error);
    }
  };
  const today = new Date().toDateString();
  const todaysTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt).toDateString();
    return taskDate === today;
  });

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.createdAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  const handleLogout = () => {
    logout();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (taskTitle.trim() && taskDescription.trim()) {
      try {
        const response = await createTask(taskTitle, taskDescription);

        if (response && response.newTask) {
          setTasks([...tasks, response.newTask]);
        }

        setTaskTitle("");
        setTaskDescription("");
        setShowAddTaskModal(false);
        Swal.fire({
          title: "Success!",
          text: response.message || "Task added successfully",
          icon: "success",
          confirmButtonText: "Cool",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to add task. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    }
  };

  const [taskId, setTaskId] = useState();

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskId(task._id);
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (taskTitle.trim() && taskDescription.trim()) {
      try {
        const res = await updateTask(taskId, taskTitle, taskDescription);

        if (res.task) {
          setTaskTitle("");
          setTaskDescription("");
          setEditingTask(null);
          setShowEditTaskModal(false);
          handleGetTasks();

          Swal.fire({
            title: "Success!",
            text: res.message || "Task updated successfully",
            icon: "success",
            confirmButtonText: "Cool",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to update task. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      Swal.fire({
        title: "Deleted!",
        text: "Task deleted successfully",
        icon: "success",
        confirmButtonText: "Cool",
      });
      handleGetTasks();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete task. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const toggleTaskComplete = async (taskId) => {
    try {
      const response = await markedAsCompleted(taskId);
      if (response.task) {
        Swal.fire({
          title: "Success!",
          text: response.message || "Task status updated successfully",
          icon: "success",
          confirmButtonText: "Cool",
        });
        handleGetTasks();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text:
          error.message || "Failed to update task status. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-2xl border-accent-foreground border-b-black  flex items-center justify-center shadow-lg">
                <img
                  src={logo}
                  alt="TaskFlow Logo"
                  onClick={() => navigate("https://github.com/Avishkar-Kabadi")}
                  className="w-12 h-12 rounded-2xl"
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
            </div>

            {/* Profile and Logout */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-10 h-10 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <img
                  src={profile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span className="text-xl">+</span>
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setShowAllTasksModal(true)}
            className="flex-1 bg-card hover:bg-secondary text-card-foreground px-6 py-4 rounded-xl font-semibold border border-border shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>📅</span>
            <span>View All Tasks</span>
          </button>
        </div>

        {/* Today's Tasks */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <span>📋</span>
            <span>Today's Tasks</span>
            <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
              {todaysTasks.length}
            </span>
          </h2>

          {todaysTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-xl text-muted-foreground">
                No tasks for today!
              </p>
              <p className="text-muted-foreground">
                Add a new task to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-background/50 rounded-lg p-4 border border-border hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        disabled={task.completed}
                        onClick={() => toggleTaskComplete(task._id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 transition-colors duration-200 ${
                          task.completed
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {task.completed && <span className="text-xs">✓</span>}
                      </button>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {task.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(task.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditTask(task)}
                        hidden={task.completed}
                        className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="px-3 py-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-sm font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-2xl border border-border p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">
                Profile Information
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>
            <div className="text-center mb-6">
              <img
                src={profile}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20"
              />
              <h4 className="text-lg font-semibold text-foreground">{name}</h4>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-2xl border border-border p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">
                Add New Task
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground h-24 resize-none"
                  placeholder="Enter task description"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors duration-200"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-2xl border border-border p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">Edit Task</h3>
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground h-24 resize-none"
                  placeholder="Enter task description"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors duration-200"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Tasks Modal */}
      {showAllTasksModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-2xl border border-border p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">
                All Tasks (Date-wise)
              </h3>
              <button
                onClick={() => setShowAllTasksModal(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] space-y-6">
              {Object.entries(tasksByDate).map(([date, dateTasks]) => (
                <div key={date} className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <span>📅</span>
                    <span>{date}</span>
                    <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {dateTasks.length}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {dateTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-background/30 rounded-lg p-3 border border-border/50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <button
                              onClick={() => toggleTaskComplete(task._id)}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-1 transition-colors duration-200 ${
                                task.completed
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-border hover:border-primary"
                              }`}
                            >
                              {task.completed && (
                                <span className="text-xs">✓</span>
                              )}
                            </button>
                            <div className="flex-1">
                              <h5
                                className={`font-medium text-sm ${
                                  task.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {task.title}
                              </h5>
                              <p
                                className={`text-xs mt-1 ${
                                  task.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {task.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setShowAllTasksModal(false);
                                handleEditTask(task);
                              }}
                              className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded text-xs font-medium transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="px-2 py-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs font-medium transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
