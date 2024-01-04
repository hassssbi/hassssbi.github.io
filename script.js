document.getElementById('task-duedate').valueAsDate = new Date();

function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-duedate').value;
    const priority = document.getElementById('task-priority').value;

    if (!title || !description || !dueDate || !priority) {
        alert('Please fill in all the required fields.');
        return;
    }

    const taskTable = document.getElementById('tasks');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${taskTable.rows.length}</td>
        <td>${title}</td>
        <td style="display:none">${description}</td>
        <td>${dueDate}</td>
        <td>${priority}</td>
        <td>Not Done</td>
        <td>
            <button class="view" onclick="viewTask(this)">View</button>
            <button class="edit" onclick="editTask(this)">Edit</button>
            <button class="delete" onclick="deleteTask(this)">Delete</button>
        </td>
    `;

    taskTable.appendChild(newRow);
    clearForm();
}
function viewTask(button) {
    const taskRow = button.closest('tr');
    const taskCells = taskRow.cells;

    // Extract task details from the table cells
    const taskDetails = {
        title: taskCells[1].textContent,
        description: taskCells[2].textContent,
        dueDate: taskCells[3].textContent,
        priority: taskCells[4].textContent,
        status: taskCells[5].textContent
    };

    // Implement view task logic, e.g., display details in a modal
    console.log('View Task:', taskDetails);
}

function editTask(button) {
    const taskRow = button.closest('tr');
    const taskCells = taskRow.cells;

    // Extract task details from the table cells
    const taskDetails = {
        title: taskCells[1].textContent,
        description: taskCells[2].textContent,
        dueDate: taskCells[3].textContent,
        priority: taskCells[4].textContent,
        status: taskCells[5].textContent
    };

    // Implement edit task logic, e.g., populate form with task details
    console.log('Edit Task:', taskDetails);
}

function deleteTask(button) {
    const taskRow = button.closest('tr');
    taskRow.remove();
}

function clearForm() {
    // Get the form element
    const form = document.querySelector('.task-form');

    // Reset the form to its initial state
    form.reset();
    document.getElementById('task-duedate').valueAsDate = new Date();
}

