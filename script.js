// Task Manager Application JavaScript
// Runs all the interactive portions of the page
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskImportantCheckbox = document.getElementById('task-important');
    const taskCompletedCheckbox = document.getElementById('task-completed');
    const taskManagerDiv = document.getElementById('taskmanager');
    
    // Tasks array to store all tasks
    let tasks = [];
    let taskIdCounter = 1;
    
    // Initialize the application
    init();
    
    function init() {
        // Load tasks from localStorage if available
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
            renderTasks();
        }
        
        // Set up event listeners
        taskForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate input
        const taskName = taskNameInput.value.trim();
        if (!taskName) {
            alert('Please enter a task name');
            return;
        }
        
        // Create new task object
        const newTask = {
            id: taskIdCounter++,
            name: taskName,
            priority: taskPrioritySelect.value,
            isImportant: taskImportantCheckbox.checked,
            isCompleted: taskCompletedCheckbox.checked,
            date: new Date().toLocaleString()
        };
        
        // Add task to array
        tasks.push(newTask);
        
        // Save to localStorage
        saveTasks();
        
        // Render tasks
        renderTasks();
        
        // Reset form
        taskForm.reset();
        
        // Log to console
        console.log(JSON.stringify(tasks));
    }
    
    // Render all tasks
    function renderTasks() {
        // Clear the task manager div
        taskManagerDiv.innerHTML = '';
        
        if (tasks.length === 0) {
            taskManagerDiv.innerHTML = '<p class="no-tasks">No tasks added yet.</p>';
            return;
        }
        
        // Create and append each task element
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskManagerDiv.appendChild(taskElement);
        });
    }
    
    // Create a task element
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.priority.toLowerCase()}-priority ${task.isImportant ? 'important' : ''} ${task.isCompleted ? 'completed' : ''}`;
        
        // Task info
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        
        const taskName = document.createElement('div');
        taskName.className = 'task-name';
        taskName.textContent = task.name;
        
        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';
        taskMeta.innerHTML = `
            <span>Priority: ${task.priority}</span>
            <span>Added: ${task.date}</span>
        `;
        
        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskMeta);
        
        // Task actions
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        
        const completeButton = document.createElement('button');
        completeButton.className = 'complete-btn';
        completeButton.textContent = task.isCompleted ? 'Undo' : 'Complete';
        completeButton.addEventListener('click', () => toggleTaskCompletion(task.id));
        
        const importantButton = document.createElement('button');
        importantButton.className = 'important-btn';
        importantButton.textContent = task.isImportant ? 'Unmark Important' : 'Mark Important';
        importantButton.addEventListener('click', () => toggleTaskImportance(task.id));
        
        taskActions.appendChild(deleteButton);
        taskActions.appendChild(completeButton);
        taskActions.appendChild(importantButton);
        
        // Combine elements
        taskElement.appendChild(taskInfo);
        taskElement.appendChild(taskActions);
        
        return taskElement;
    }
    
    // Delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        console.log(JSON.stringify(tasks));
    }
    
    // Toggle task completion
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, isCompleted: !task.isCompleted };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        console.log(JSON.stringify(tasks));
    }
    
    // Toggle task importance
    function toggleTaskImportance(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, isImportant: !task.isImportant };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        console.log(JSON.stringify(tasks));
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});