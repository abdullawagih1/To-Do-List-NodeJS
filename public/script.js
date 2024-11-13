// Get references to DOM elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');

// Fetch and display all tasks
async function fetchTasks() {
  try {
    const response = await fetch('/tasks');
    const tasks = await response.json();

    // Clear the task list
    taskList.innerHTML = '';

    // Check if there are tasks to display
    if (tasks.length === 0) {
      taskList.innerHTML = '<li>No tasks found.</li>';
      return;
    }

    // Create list items for each task
    tasks.forEach((task) => {
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
  } catch (error) {
    console.error('Error fetching tasks:', error);
    taskList.innerHTML = '<li>Error loading tasks.</li>';
  }
}

// Add a new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const description = descriptionInput.value;

  try {
    await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    // Clear input fields
    titleInput.value = '';
    descriptionInput.value = '';

    // Refresh the task list
    fetchTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
});

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

// Get reference to the "View All Tasks" button
const viewAllTasksButton = document.getElementById('viewAllTasksButton');

// Navigate to the "All Tasks" page when the button is clicked
viewAllTasksButton.addEventListener('click', () => {
  window.location.href = 'all-tasks.html';
});


// Initial fetch of tasks when the page loads
fetchTasks();
