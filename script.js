document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    document.getElementById('due-date').valueAsDate = new Date();
    taskForm.addEventListener('submit', addTask);

    //DISPLAY MODAL
    // Array to store references to currently open modals
    const openModals = [];

    function showModal(message, type = 'info') {
        // Close all open modals before displaying a new one
        closeOpenModals();

        const modal = document.createElement('div');
        modal.classList.add('modal', type);

        const modalContent = `
            <p>${message}</p>
            <button class="close-modal">Close</button>
        `;
        modal.innerHTML = modalContent;

        document.body.appendChild(modal);

        // Add event listener to close the modal when the close button is clicked
        const closeModalBtn = modal.querySelector('.close-modal');
        closeModalBtn.addEventListener('click', () => {
            modal.remove();
            // Remove the closed modal from the openModals array
            const modalIndex = openModals.indexOf(modal);
            if (modalIndex !== -1) {
                openModals.splice(modalIndex, 1);
            }
        });

        // Add the new modal to the openModals array
        openModals.push(modal);
    }

    function closeOpenModals() {
        // Close all open modals
        openModals.forEach(modal => modal.remove());
        // Clear the openModals array
        openModals.length = 0;
    }

    //ADD NEW TASK
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

    //CLEAR TASK FORM FIELDS
    function clearTaskForm() {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due-date').valueAsDate = new Date();
        document.getElementById('priority').value = 'High';
    }

    //GET TASK DETAILS
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

    // CREATE TASK ELEMENT 
    function createTaskElement(taskDetails) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const taskContent = `
            <h3>${taskDetails.title}</h3>
            <p>${taskDetails.description}</p>
            <p><strong>Due Date: </strong>${taskDetails.dueDate}</p>
            <p><strong>Priority: </strong><span class="${taskDetails.priority}">${taskDetails.priority}</span></p>
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

    // TASK FILTERING
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

    // task filter buttons
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
    
    // EDIT EXISTING TASK
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
            <div></div>
            <div class="button">
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

    // UPDATE TASK ELEMENT
    function updateTaskElement(taskElement, updatedTaskDetails) {
        const titleElement = taskElement.querySelector('h3');
        titleElement.innerText = updatedTaskDetails.title;
    
        const descriptionElement = titleElement.nextElementSibling;
        descriptionElement.innerText = updatedTaskDetails.description;
    
        const dueDateElement = descriptionElement.nextElementSibling;
        dueDateElement.innerText = `Due Date: ${updatedTaskDetails.dueDate}`;
    
        const priorityElement = dueDateElement.nextElementSibling;
        priorityElement.innerHTML = `Priority: <span class="${updatedTaskDetails.priority}">${updatedTaskDetails.priority}</span>`;
    
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

    // DELETE TASK
    function deleteTask(taskElement) {
        // Close all open modals before displaying a new one
        closeOpenModals();
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

    // MARK TASK AS COMPLETE
    function completeTask(taskElement) {
        taskElement.classList.toggle('completed');
    }

    // CHANGE APPLICATION TITLE
    function changeAppTitle(newTitle) {
        appTitle.textContent = newTitle;
    }
    function changeTitleFromUI(newTitle) {
        changeAppTitle(newTitle);
    }

    // PAGE CUSTOMIZATION
    function applyColorCustomization(colorPalette) {
        document.documentElement.style.setProperty('--primary-bg-color', colorPalette.secondaryBgColor);
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
            primaryBgColor: document.getElementById('secondary-bg-color').value,
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
        toggleColorFormBtn.textContent = buttonText === 'Hide Customization' ? 'Customize Your Page' : 'Hide Customization';
    });

    function testAddDummyTask(dummyTask) {
        // Create a dummy task with legitimate information
        if(!dummyTask) {
            dummyTask = {
                title: 'Dummy Task',
                description: 'This is a dummy task for testing purposes.',
                dueDate: '2023-12-31', // Use a valid date format
                priority: 'Medium', // Choose a priority level
            };
        }

        // Create a new task element using the dummy task details
        const dummyTaskElement = createTaskElement(dummyTask);
    
        // Append the dummy task element to the task list
        const taskList = document.getElementById('task-list');
        taskList.appendChild(dummyTaskElement);
    
        // Optionally, you can trigger the success modal or any other feedback
        // showModal('Dummy task added for testing!', 'info');
    };

    dummyTasks = [
        {
            title: 'Complete Project Proposal',
            description: 'Write and finalize the project proposal document.',
            dueDate: '2023-02-15', // Use a valid date format
            priority: 'High', // Choose a priority level
        },
        {
            title: 'Review Code Changes',
            description: 'Review and provide feedback on recent code changes.',
            dueDate: '2023-02-28', // Use a valid date format
            priority: 'Medium', // Choose a priority level
        },
        {
            title: 'Client Meeting',
            description: 'Schedule and prepare for a meeting with the client.',
            dueDate: '2023-03-05', // Use a valid date format
            priority: 'High', // Choose a priority level
        },
        {
            title: 'Research New Technologies',
            description: 'Investigate and document the potential benefits of adopting new technologies.',
            dueDate: '2023-03-10', // Use a valid date format
            priority: 'Medium', // Choose a priority level
        },
        {
            title: 'Update User Documentation',
            description: 'Revise and update the user documentation for the latest software release.',
            dueDate: '2023-03-15', // Use a valid date format
            priority: 'Low', // Choose a priority level
        },
        {
            title: 'Create Wireframes for UI Redesign',
            description: 'Design wireframes for the upcoming user interface redesign.',
            dueDate: '2023-03-20',
            priority: 'Medium',
        },
        {
            title: 'Conduct Team Training Session',
            description: 'Organize and lead a training session for team members on new tools.',
            dueDate: '2023-03-25',
            priority: 'High',
        },
        {
            title: 'Prepare Monthly Progress Report',
            description: 'Compile and summarize the team\'s progress for the monthly report.',
            dueDate: '2023-04-01',
            priority: 'Medium',
        },
        {
            title: 'Test and Debug New Features',
            description: 'Thoroughly test and debug the recently developed features.',
            dueDate: '2023-04-10',
            priority: 'High',
        },
        {
            title: 'Brainstorm Ideas for Marketing Campaign',
            description: 'Collaborate with the marketing team to generate creative ideas for the upcoming campaign.',
            dueDate: '2023-04-15',
            priority: 'Low',
        },
    ];

    // FOR TESTING, UNCOMMENT TO USE
    for(let i=0; i<dummyTasks.length; i++) {
        testAddDummyTask(dummyTasks[i]);
    }
});
