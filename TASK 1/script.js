window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    const getTasksFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            createTaskElement(task);
        });
    };

    const createTaskElement = (task) => {
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        const task_input_el = document.createElement("input");
        task_input_el.type = "text";
        task_input_el.classList.add("text");
        task_input_el.value = task;
        task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);
        task_el.appendChild(task_content_el);

        const task_action_el = document.createElement("div");
        task_action_el.classList.add("action");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "EDIT";
        task_edit_el.setAttribute('aria-label', 'Edit task');

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "DELETE";
        task_delete_el.setAttribute('aria-label', 'Delete task');

        task_action_el.appendChild(task_edit_el);
        task_action_el.appendChild(task_delete_el);
        task_el.appendChild(task_action_el);
        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText === "EDIT") {
                task_input_el.removeAttribute('readonly');
                task_input_el.focus();
                task_edit_el.innerText = "SAVE";
            } else {
                task_input_el.setAttribute('readonly', 'readonly');
                task_edit_el.innerText = "EDIT";

                // Save updated task back to local storage
                updateTaskInLocalStorage(task_input_el.value);
            }
        });

        task_delete_el.addEventListener('click', () => {
            list_el.removeChild(task_el);
            deleteTaskFromLocalStorage(task);
        });
    };

    const updateTaskInLocalStorage = (updatedTask) => {
        const tasks = getTasksFromLocalStorage();
        const index = tasks.indexOf(updatedTask);
        if (index > -1) {
            tasks[index] = updatedTask;
        }
        saveTasks(tasks);
    };

    const deleteTaskFromLocalStorage = (task) => {
        const tasks = getTasksFromLocalStorage();
        const updatedTasks = tasks.filter(t => t !== task);
        saveTasks(updatedTasks);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = input.value.trim();
        if (!task) {
            alert("Please provide a task");
            return;
        }

        createTaskElement(task);
        input.value = "";

        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasks(tasks);
    });

    loadTasks();
});