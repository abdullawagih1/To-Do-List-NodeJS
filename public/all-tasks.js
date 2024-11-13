// Get references to DOM elements
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');

let tasks = []; // Store all tasks for easy filtering

// Fetch and display all tasks
async function fetchTasks() {
  try {
    const response = await fetch('/tasks');
    tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    taskList.innerHTML = '<li>Error loading tasks.</li>';
  }
}

// Display tasks based on search and filter criteria
function displayTasks(filteredTasks) {
  // Clear the task list
  taskList.innerHTML = '';

  // Check if there are tasks to display
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li>No tasks found.</li>';
    return;
  }

  // Create list items for each task
  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${task.title}</strong> - ${task.description} 
      [${task.completed ? 'Completed' : 'Not Completed'}]
      <button onclick="toggleComplete('${task._id}', ${task.completed})">
        Mark as ${task.completed ? 'Incomplete' : 'Complete'}
      </button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

// Filter tasks based on search input and selected filter
function filterTasks() {
  const searchText = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchText);
    const matchesFilter =
      filterValue === 'all' ||
      (filterValue === 'completed' && task.completed) ||
      (filterValue === 'incomplete' && !task.completed);

    return matchesSearch && matchesFilter;
  });

  displayTasks(filteredTasks);
}

// Toggle task completion status
async function toggleComplete(id, completed) {
  try {
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

// Delete a task
async function deleteTask(id) {
  try {
    await fetch(`/tasks/${id}`, {
      method: 'DELETE',
    });
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// Event listeners for search input and filter select
searchInput.addEventListener('input', filterTasks);
filterSelect.addEventListener('change', filterTasks);

// Initial fetch of tasks when the page loads
fetchTasks();
