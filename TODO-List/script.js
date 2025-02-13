
class Task {
    constructor(name, description, priority, deadLine) {
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.deadLine = deadLine;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const addTaskButton = document.getElementById('add-task-button');
    const addTaskWindow = document.getElementById('add-task-window');
    const editTaskWindow = document.getElementById('edit-task-window');
    const showTaskWindow = document.getElementById('show-task-window');
    const closeAddTaskWindow = document.getElementById('close-add-task-button');
    const form = document.getElementById('make-task-form');
    const newTaskForm = document.getElementById('new-make-task-form');
    const tasksContainer = document.getElementById('tasks-container');
    const sortButton = document.getElementById('sort-button');
    const sortOptionsWindow = document.getElementById('sort-options-window');
    const importButton = document.getElementById('import-button');
    const exportButton = document.getElementById('export-button');
    const closeAppButton = document.getElementById('close-app-button');
    let tasksList = [];
    const maxNameLength = 17;

    closeAppButton.addEventListener('click', () => {
        window.electronAPI.closeApp();
    })

    // Функции сортировки
    function sortByName() {
        tasksList.sort((a, b) => a.name.localeCompare(b.name));
    }

    function sortByPriority() {
        tasksList.sort((a, b) => a.priority - b.priority);
    }

    function sortByDeadline() {
        tasksList.sort((a, b) => new Date(a.deadLine) - new Date(b.deadLine));
    }

    //Обработчики для кнопок сортировки
    document.getElementById('sort-by-name').addEventListener('click', () => {
        sortByName();
        updateTaskListDisplay();
        sortOptionsWindow.style.display = 'none';
    });

    document.getElementById('sort-by-priority').addEventListener('click', () => {
        sortByPriority();
        updateTaskListDisplay();
        sortOptionsWindow.style.display = 'none';
    });

    document.getElementById('sort-by-deadline').addEventListener('click', () => {
        sortByDeadline();
        updateTaskListDisplay();
        sortOptionsWindow.style.display = 'none';
    });

    document.getElementById('close-sort-options').addEventListener('click', () => {
        sortOptionsWindow.style.display = 'none';
    });

    sortButton.addEventListener('click', () => {
        sortOptionsWindow.style.display = 'block';
        const buttonRect = sortButton.getBoundingClientRect();
        sortOptionsWindow.style.left = buttonRect.left + 'px';
        sortOptionsWindow.style.top = buttonRect.bottom + 10 + 'px';
    });

    addTaskButton.addEventListener('click', function() {
        addTaskWindow.style.display = 'block';
        const buttonRect = addTaskButton.getBoundingClientRect();
        addTaskWindow.style.left = buttonRect.right + 10 + 'px';
        addTaskWindow.style.top = buttonRect.top + 'px';
    });

    closeAddTaskWindow.addEventListener('click', function(event) {
        event.preventDefault();
        addTaskWindow.style.display = 'none';
        form.reset();
    });

    // Проверка валидации формата даты (YYYY.MM.DD)
    function isValidDate(dateString) {
        const dateRegex = /^\d{4}\.\d{2}\.\d{2}$/;
        return dateRegex.test(dateString);
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = form.elements['name'].value;
        const description = form.elements['description'].value;
        const priority = form.elements['priority'].value;
        const deadLine = form.elements['deadLine'].value;

        if (!name || !description || !priority || !deadLine) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        if (name.length > maxNameLength) {
            alert(`Имя задачи не должно превышать ${maxNameLength} символов!`);
            return;
        }

        if (!isValidDate(deadLine)) {
            alert('Пожалуйста, введите дату в формате ГГГГ.ММ.ДД!');
            return;
        }

        if (isNaN(priority) || priority < 1 || priority > 3) {
            alert('Приоритет должен быть числом от 1 до 3!');
            return;
        }

        const task = new Task(name, description, priority, deadLine);
        tasksList.push(task);

        addTaskWindow.style.display = 'none';
        updateTaskListDisplay();
        form.reset();
    });

    function updateTaskListDisplay() {
        tasksContainer.innerHTML = '';

        tasksList.forEach(task => {
            const newTask = document.createElement('div');
            newTask.classList.add('task-block');
            const taskNameContainer = document.createElement('div');
            taskNameContainer.classList.add('task-name-container');
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');
            newTask.appendChild(taskNameContainer);
            newTask.appendChild(buttonsContainer);

            const taskName = document.createElement('h3');
            taskName.textContent = task.name;
            taskNameContainer.appendChild(taskName);

            function showTaskDetails(task) {
                showTaskWindow.innerHTML = '';

                const nameArea = document.createElement('div');
                nameArea.classList.add('task-window-shown-object');
                nameArea.textContent = `Название: ${task.name}`;
                showTaskWindow.appendChild(nameArea);

                const descriptionArea = document.createElement('div');
                descriptionArea.classList.add('task-window-shown-object');
                descriptionArea.textContent = `Описание: ${task.description}`;
                showTaskWindow.appendChild(descriptionArea);

                const priorityArea = document.createElement('div');
                priorityArea.classList.add('task-window-shown-object');
                priorityArea.textContent = `Приоритет: ${task.priority}`;
                showTaskWindow.appendChild(priorityArea);

                const deadLineArea = document.createElement('div');
                deadLineArea.classList.add('task-window-shown-object');
                deadLineArea.textContent = `Дедлайн: ${task.deadLine}`;
                showTaskWindow.appendChild(deadLineArea);

                const closeButton = document.createElement('button');
                closeButton.textContent = "Закрыть";
                closeButton.classList.add('task-window-shown-object');
                closeButton.addEventListener('click', () => {
                    showTaskWindow.style.display = 'none';
                });
                showTaskWindow.appendChild(closeButton);

                showTaskWindow.style.display = 'block';
            }


            const showTaskButton = document.createElement('button');
            showTaskButton.innerHTML = '<i class="fas fa-eye"></i>'; // Иконка просмотра
            showTaskButton.addEventListener('click', () => showTaskDetails(task));
            buttonsContainer.appendChild(showTaskButton);

            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Иконка редактирования
            editButton.addEventListener('click', () => {
                editTaskWindow.style.display = 'block';

                const newNameInput = document.getElementById('new-nameInput');
                newNameInput.value = task.name;

                const newDescriptionInput = document.getElementById('new-descriptionInput');
                newDescriptionInput.value = task.description;

                const newPriorityInput = document.getElementById('new-priorityInput');
                newPriorityInput.value = task.priority;

                const newDeadLineInput = document.getElementById('new-deadLineInput');
                newDeadLineInput.value = task.deadLine;

                function handleEditFormSubmit(e) {
                    e.preventDefault();

                    const newName = newNameInput.value;
                    const newDescription = newDescriptionInput.value;
                    const newPriority = newPriorityInput.value;
                    const newDeadLine = newDeadLineInput.value;

                    if (!newName || !newDescription || !newPriority || !newDeadLine) {
                        alert('Пожалуйста, заполните все поля!');
                        return;
                    }

                    if (newName.length > maxNameLength) {
                        alert(`Имя задачи не должно превышать ${maxNameLength} символов!`);
                        return;
                    }

                    if (!isValidDate(newDeadLine)) {
                        alert('Пожалуйста, введите дату в формате ГГГГ.ММ.ДД!');
                        return;
                    }

                    if (isNaN(newPriority) || newPriority < 1 || newPriority > 3) {
                        alert('Приоритет должен быть числом от 1 до 3!');
                        return;
                    }


                    task.name = newName;
                    task.description = newDescription;
                    task.priority = newPriority;
                    task.deadLine = newDeadLine;

                    taskName.textContent = newName;

                    editTaskWindow.style.display = 'none';
                    newTaskForm.removeEventListener('submit', handleEditFormSubmit);
                }
                newTaskForm.addEventListener('submit', handleEditFormSubmit);

                document.getElementById('new-close-add-task-button').addEventListener('click', function(e) {
                    e.preventDefault();
                    editTaskWindow.style.display = 'none';
                    newTaskForm.removeEventListener('submit', handleEditFormSubmit);
                });
            });
            buttonsContainer.appendChild(editButton);


            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Иконка удаления
            deleteButton.addEventListener('click', () => {
                const index = tasksList.findIndex(t => t.name === taskName.textContent);

                if (index !== -1) {
                    tasksList.splice(index, 1);
                    tasksContainer.removeChild(newTask);
                }
            });
            buttonsContainer.appendChild(deleteButton);

            tasksContainer.appendChild(newTask);
        });
    }

    newTaskForm.addEventListener('submit', function() {
        updateTaskListDisplay();
    });

    exportButton.addEventListener('click', () => {
        const jsonString = JSON.stringify(tasksList);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json'; // Указываем, что принимаем только .json файлы
        input.title = "Выберите JSON файл с задачами"; // Подсказка для пользователя

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                // Проверяем расширение файла
                if (!file.name.endsWith(".json")) {
                    alert("Пожалуйста, выберите файл с расширением .json");
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedTasks = JSON.parse(e.target.result);

                        // Валидация и фильтрация импортированных задач
                        tasksList = importedTasks.filter(task => {
                            return (
                                task.name &&
                                task.description &&
                                task.priority &&
                                task.deadLine &&
                                task.name.length <= maxNameLength &&
                                isValidDate(task.deadLine) &&
                                !isNaN(task.priority) &&
                                task.priority >= 1 &&
                                task.priority <= 3
                            );
                        }).map(task => new Task(task.name, task.description, task.priority, task.deadLine));

                        updateTaskListDisplay();
                        alert("Задачи успешно импортированы из файла!");
                    } catch (error) {
                        alert('Ошибка при чтении файла: ' + error);
                    }
                };
                reader.readAsText(file);
            }
        });

        input.click();
    });
});
