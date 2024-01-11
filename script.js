document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    document.getElementById('due-date').valueAsDate = new Date();

    taskForm.addEventListener('submit', addTask);

    function showModal(message, type = 'info') {
        const modal = document.createElement('div');
        modal.classList.add('modal', type);

        const modalContent = `
            <p>${message}</p>
            <button id="close-modal">Close</button>
        `;
        modal.innerHTML = modalContent;

        document.body.appendChild(modal);

        const closeModalBtn = document.getElementById('close-modal');
        closeModalBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    function addTask(e) {
        e.preventDefault();
        const taskDetails = getTaskDetailsFromForm();

        if (taskDetails) {
            const taskElement = createTaskElement(taskDetails);
            taskList.appendChild(taskElement);

            clearTaskForm();

            showModal('Task added successfully!', 'success');
            
            document.getElementById('title').focus();
        }
    }

    function clearTaskForm() {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due-date').valueAsDate = new Date();
        document.getElementById('priority').value = 'High';
    }

    function getTaskDetailsFromForm() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('due-date').value;
        const priority = document.getElementById('priority').value;

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

        const editBtn = taskElement.querySelector('.edit-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');
        const completeBtn = taskElement.querySelector('.complete-btn');

        editBtn.addEventListener('click', () => editTask(taskElement, taskDetails));
        deleteBtn.addEventListener('click', () => deleteTask(taskElement));
        completeBtn.addEventListener('click', () => completeTask(taskElement));

        return taskElement;
    }

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
        const existingEditForm = taskElement.querySelector('form');

        if (existingEditForm) {
            existingEditForm.remove();
            return;
        }

        const editForm = document.createElement('form');
        editForm.innerHTML = `
            <label for="edit-title">Title:</label>
            <input type="text" id="edit-title" value="${taskDetails.title}" required placeholder="What is your task?">

            <label for="edit-description">Description:</label>
            <textarea id="edit-description" required placeholder="Describe your task...">${taskDetails.description}</textarea>

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

        const cancelBtn = editForm.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function () {
            editForm.remove();
        });

        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const updatedTaskDetails = {
                title: editForm.querySelector('#edit-title').value,
                description: editForm.querySelector('#edit-description').value,
                dueDate: editForm.querySelector('#edit-due-date').value,
                priority: editForm.querySelector('#edit-priority').value,
            };

            updateTaskElement(taskElement, updatedTaskDetails);

            editForm.remove();

            showModal('Task updated successfully!', 'success');
        });

        taskElement.appendChild(editForm);
    }

    function updateTaskElement(taskElement, updatedTaskDetails) {
        const titleElement = taskElement.querySelector('h3');
        titleElement.innerText = updatedTaskDetails.title;
    
        const descriptionElement = titleElement.nextElementSibling;
        descriptionElement.innerText = updatedTaskDetails.description;
    
        const dueDateElement = descriptionElement.nextElementSibling;
        dueDateElement.innerText = `Due Date: ${updatedTaskDetails.dueDate}`;
    
        const priorityElement = dueDateElement.nextElementSibling;
        priorityElement.innerHTML = `Priority: <span>${updatedTaskDetails.priority}</span>`;
    
        const buttons = taskElement.querySelectorAll('button');
        buttons.forEach(button => button.remove());
    
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerText = 'Edit';
        editBtn.addEventListener('click', () => editTask(taskElement, updatedTaskDetails));
    
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(taskElement));
    
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('complete-btn');
        completeBtn.innerText = 'Complete';
        completeBtn.addEventListener('click', () => completeTask(taskElement));
    
        taskElement.appendChild(editBtn);
        taskElement.appendChild(deleteBtn);
        taskElement.appendChild(completeBtn);

        [editBtn, deleteBtn, completeBtn].forEach(button => {
            button.style.marginRight = '.75em';
        });
    }

    function deleteTask(taskElement) {
        const deleteModal = document.createElement('div');
        deleteModal.classList.add('modal', 'danger');
    
        const modalContent = `
            <p>Are you sure you want to delete this task?</p>
            <button id="cancel-delete">Cancel</button>
            <button id="confirm-delete">Confirm</button>
        `;
        deleteModal.innerHTML = modalContent;
    
        document.body.appendChild(deleteModal);
    
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.remove();
        });
    
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        confirmDeleteBtn.addEventListener('click', () => {
            taskElement.remove();
            deleteModal.remove();
            showModal('Task deleted successfully!', 'success');
        });
    }

    function completeTask(taskElement) {
        taskElement.classList.toggle('completed');
    }

    function changeAppTitle(newTitle) {
        appTitle.textContent = newTitle;
    }

    function changeTitleFromUI(newTitle) {
        changeAppTitle(newTitle);
    }

    function applyColorCustomization(colorPalette) {
        document.documentElement.style.setProperty('--primary-bg-color', colorPalette.primaryBgColor);
        document.documentElement.style.setProperty('--secondary-bg-color', colorPalette.secondaryBgColor);
        document.documentElement.style.setProperty('--text-color', colorPalette.textColor);
        document.documentElement.style.setProperty('--button-bg-color', colorPalette.buttonBgColor);
        document.documentElement.style.setProperty('--header-color', colorPalette.headerColor);
        document.documentElement.style.setProperty('--footer-color', colorPalette.footerColor);
    }

    const colorForm = document.getElementById('color-form');
    colorForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const colorPalette = {
            primaryBgColor: document.getElementById('primary-bg-color').value,
            secondaryBgColor: document.getElementById('secondary-bg-color').value,
            textColor: document.getElementById('text-color').value,
            buttonBgColor: document.getElementById('button-bg-color').value,
            headerColor: document.getElementById('header-color').value,
            footerColor: document.getElementById('footer-color').value,
        };

        applyColorCustomization(colorPalette);

        showModal('Application successfully customized!', 'success');
    });

    const toggleColorFormBtn = document.getElementById('toggle-color-form');
    toggleColorFormBtn.addEventListener('click', function () {
        colorForm.classList.toggle('hidden');
        const buttonText = toggleColorFormBtn.textContent;
        toggleColorFormBtn.textContent = buttonText === 'Hide Customization' ? 'Customization' : 'Hide Customization';
    });
});
