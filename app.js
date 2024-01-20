document.addEventListener("DOMContentLoaded", function () {
    const todoList = document.getElementById("todo-list");
    const todoInput = document.getElementById("todo-input");
    const addButton = document.getElementById("add-button");
    const showCompletedCheckbox = document.getElementById("show-completed");
    const clearCompletedButton = document.getElementById("clear-completed");
    const sortTasksButton = document.getElementById("sort-tasks");

    addButton.addEventListener("click", function () {
        const taskText = todoInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            todoInput.value = "";
        }
    });

    clearCompletedButton.addEventListener("click", function () {
        const completedTasks = document.querySelectorAll(".todo-item.completed");
        completedTasks.forEach(task => {
            todoList.removeChild(task);
        });
    });

    sortTasksButton.addEventListener("click", function () {
        const tasks = Array.from(todoList.children);
        tasks.sort((a, b) => {
            const aCompleted = a.classList.contains("completed");
            const bCompleted = b.classList.contains("completed");
            return aCompleted - bCompleted;
        });
        todoList.innerHTML = "";
        tasks.forEach(task => {
            todoList.appendChild(task);
        });
    });

    function addTask(taskText) {
        const todoItem = document.createElement("li");
        todoItem.className = "todo-item";
        const timestamp = getFormattedTimestamp();
        todoItem.innerHTML = `
            <input type="checkbox">
            <span>${taskText}</span>
            <span class="timestamp">${timestamp}</span>
            <button class="delete-button">Delete</button>
        `;
        todoList.appendChild(todoItem);

        const deleteButton = todoItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", function () {
            todoList.removeChild(todoItem);
        });

        const checkbox = todoItem.querySelector("input");
        checkbox.addEventListener("change", function () {
            todoItem.classList.toggle("completed", checkbox.checked);
            if (checkbox.checked) {
                showNotification(taskText);
            }
        });

        showCompletedCheckbox.addEventListener("change", function () {
            todoItem.style.display = showCompletedCheckbox.checked || !todoItem.classList.contains("completed")
                ? "flex"
                : "none";
        });
    }

    function getFormattedTimestamp() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        return now.toLocaleDateString('en-US', options);
    }

    function showNotification(taskText) {
        if (Notification.permission === "granted") {
            const notification = new Notification("Task Reminder", {
                body: `Don't forget to complete: ${taskText}`,
                icon: "notification-icon.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showNotification(taskText);
                }
            });
        }
    }
});
