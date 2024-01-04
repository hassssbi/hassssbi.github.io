document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', addTask);

    function addTask(e) {
    e.preventDefault();
    const taskDetails = getTaskDetailsFromForm();

    if (taskDetails) {
        const taskElement = createTaskElement(taskDetails);
        taskList.appendChild(taskElement);
        taskForm.reset();
    }
    }

    function getTaskDetailsFromForm() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    // Simple form validation
    if (!title || !description || !dueDate || !priority) {
        alert('Please fill in all fields');
        return null;
    }

    return { title, description, dueDate, priority };
    }

    function createTaskElement(taskDetails) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const taskContent = `
        <h3>${taskDetails.title}</h3>
        <p>${taskDetails.description}</p>
        <p><strong>Due Date:</strong> ${taskDetails.dueDate}</p>
        <p><strong>Priority:</strong> ${taskDetails.priority}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="complete-btn">Complete</button>
    `;

    taskElement.innerHTML = taskContent;

    // Event listeners for edit, delete, and complete buttons
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    const completeBtn = taskElement.querySelector('.complete-btn');

    editBtn.addEventListener('click', () => editTask(taskElement, taskDetails));
    deleteBtn.addEventListener('click', () => deleteTask(taskElement));
    completeBtn.addEventListener('click', () => completeTask(taskElement));

    return taskElement;
    }

    function editTask(taskElement, taskDetails) {
    // Implement the logic to edit task details
    // You can use prompt or create a modal for editing
    }

    function deleteTask(taskElement) {
    taskElement.remove();
    }

    function completeTask(taskElement) {
    taskElement.classList.toggle('completed');
    }

    // Function to change the app title
    function changeAppTitle(newTitle) {
    appTitle.textContent = newTitle;
    }

    // Function to change app title from UI element
    function changeTitleFromUI(newTitle) {
    changeAppTitle(newTitle);
    }
});