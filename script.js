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
        document.getElementById('priority').value = 'High'; // Set default priority
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
            <p><strong>Due Date: </strong>${taskDetails.dueDate}</p>
            <p><strong>Priority: </strong><span>${taskDetails.priority}</span></p>
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

    // Function to filter tasks based on completion status or priority level
    function filterTasks(filter) {
        const tasks = document.querySelectorAll('.task');

        tasks.forEach(task => {
            const completed = task.classList.contains('completed');
            const priority = task.querySelector('span').textContent.toLowerCase();

            switch (filter) {
                case 'all':
                task.style.display = 'block';
                break;
                case 'completed':
                task.style.display = completed ? 'block' : 'none';
                break;
                case 'incomplete':
                task.style.display = completed ? 'none' : 'block';
                break;
                case 'high':
                case 'medium':
                case 'low':
                task.style.display = priority === filter ? 'block' : 'none';
                break;
            }
        });
    }

    // Add event listeners for filter tabs
    const filterAllBtn = document.getElementById('filter-all');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const filterIncompleteBtn = document.getElementById('filter-incomplete');
    const filterHighBtn = document.getElementById('filter-high');
    const filterMediumBtn = document.getElementById('filter-medium');
    const filterLowBtn = document.getElementById('filter-low');

    filterAllBtn.addEventListener('click', function () {
        filterTasks('all');
    });

    filterCompletedBtn.addEventListener('click', function () {
        filterTasks('completed');
    });

    filterIncompleteBtn.addEventListener('click', function () {
        filterTasks('incomplete');
    });

    filterHighBtn.addEventListener('click', function () {
        filterTasks('high');
    });

    filterMediumBtn.addEventListener('click', function () {
        filterTasks('medium');
    });

    filterLowBtn.addEventListener('click', function () {
        filterTasks('low');
    });

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
            <option value="High" ${taskDetails.priority === 'High' ? 'selected' : ''}>High</option>
            <option value="Medium" ${taskDetails.priority === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="Low" ${taskDetails.priority === 'Low' ? 'selected' : ''}>Low</option>
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
        titleElement.innerText = updatedTaskDetails.title;
    
        const descriptionElement = titleElement.nextElementSibling;
        descriptionElement.innerText = updatedTaskDetails.description;
    
        const dueDateElement = descriptionElement.nextElementSibling;
        dueDateElement.innerText = `Due Date: ${updatedTaskDetails.dueDate}`;
    
        const priorityElement = dueDateElement.nextElementSibling;
        priorityElement.innerHTML = `Priority: <span>${updatedTaskDetails.priority}</span>`;
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