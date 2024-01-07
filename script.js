document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    document.getElementById('due-date').valueAsDate = new Date();


    taskForm.addEventListener('submit', addTask);

    function addTask(e) {
        e.preventDefault();
        const taskDetails = getTaskDetailsFromForm();

        if (taskDetails) {
            const taskElement = createTaskElement(taskDetails);
            taskList.appendChild(taskElement);

            // Clear the form fields manually
            clearTaskForm();
            
            // Optionally, you can focus on the title field for a better user experience
            document.getElementById('title').focus();
        }
    }

      // Add a new function to clear the task form fields
    function clearTaskForm() {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due-date').valueAsDate = new Date();
        document.getElementById('priority').value = 'high'; // Set default priority
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
        // Check if an edit form is already present
        const existingEditForm = taskElement.querySelector('form');

        // If an edit form is present, remove it and return
        if (existingEditForm) {
        existingEditForm.remove();
        return;
        }

        // Create a form for editing
        const editForm = document.createElement('form');
        editForm.innerHTML = `
        <label for="edit-title">Title:</label>
        <input type="text" id="edit-title" value="${taskDetails.title}" required>

        <label for="edit-description">Description:</label>
        <textarea id="edit-description" required>${taskDetails.description}</textarea>

        <label for="edit-due-date">Due Date:</label>
        <input type="date" id="edit-due-date" value="${taskDetails.dueDate}" required>

        <label for="edit-priority">Priority:</label>
        <select id="edit-priority" required>
            <option value="high" ${taskDetails.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${taskDetails.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${taskDetails.priority === 'low' ? 'selected' : ''}>Low</option>
        </select>
        <div>
            <button type="submit">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
        </div>
        `;

        // Event listener for the cancel button
        const cancelBtn = editForm.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function () {
        // Remove the form when the cancel button is clicked
        editForm.remove();
        });

        // Submit event for the form
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get updated task details
            const updatedTaskDetails = {
                title: editForm.querySelector('#edit-title').value,
                description: editForm.querySelector('#edit-description').value,
                dueDate: editForm.querySelector('#edit-due-date').value,
                priority: editForm.querySelector('#edit-priority').value,
            };

            // Update the task element with the new details
            updateTaskElement(taskElement, updatedTaskDetails);

            // Remove the form after updating
            editForm.remove();
        });

        // Append the form to the task element
        taskElement.appendChild(editForm);
    }

    function updateTaskElement(taskElement, updatedTaskDetails) {
        // Update the task element with the new details
        const titleElement = taskElement.querySelector('h3');
        titleElement.textContent = updatedTaskDetails.title;
    
        const descriptionElement = titleElement.nextElementSibling;
        descriptionElement.textContent = updatedTaskDetails.description;
    
        const dueDateElement = descriptionElement.nextElementSibling;
        dueDateElement.textContent = `Due Date: ${updatedTaskDetails.dueDate}`;
    
        const priorityElement = dueDateElement.nextElementSibling;
        priorityElement.textContent = `Priority: ${updatedTaskDetails.priority}`;
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