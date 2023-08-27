const taskInput = document.getElementById("task");
const taskTimeInput = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emojiSelect = document.getElementById("emojiSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    
    const isDarkMode = body.classList.contains("dark-mode");
    themeToggle.innerHTML = `<i class="fa-solid ${isDarkMode ? "fa-sun" : "fa-moon"}"></i>`;
    
    // Save the dark mode state in localStorage
    localStorage.setItem("darkMode", isDarkMode);
});
let tasks = [];

function addTask() {
    const taskType = document.getElementById("taskType").value;
    const taskText = taskInput.value;
    const selectedEmoji = emojiSelect.value;
    const taskTime = new Date(taskTimeInput.value).getTime();
    const currentTime = new Date().getTime();
    if (taskText.trim() === "" || isNaN(taskTime)) {
        alert("Please enter a valid task and due time.");
        return;
    }
    if (taskTime < currentTime) {
        alert("Task due time cannot be in the past.");
        return;
    }
    tasks.push({
        text: `${selectedEmoji} ${taskText}`,
        time: taskTime,
        completed: false,
        type: taskType,
    });
    updateTaskList();
    taskInput.value = "";
    taskTimeInput.value = "";
    emojiSelect.value = "";

    // updateTaskList();
    updateLocalStorage();
}
function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateLocalStorage();
}
function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText;
        updateTaskList();
    }
    // updateTaskList();
    updateLocalStorage();
}
function deleteTask(index) {
    const confirmation = confirm("Are you sure you want to delete this task?");
    if (confirmation) {
        tasks.splice(index, 1);
        updateTaskList();
    }
    // updateTaskList();
    updateLocalStorage();
}
function updateTaskList(filteredTasks = tasks) {
    filteredTasks.sort((a, b) => a.time - b.time);
    taskList.innerHTML = "";
    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task");
        if (task.completed) {
            taskItem.classList.add("completed");
        }
        const timeDifference = task.time - new Date().getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        taskItem.innerHTML = `
            <span class="output-task">${task.text}</span>
            <div class="actions">
                <button class="complete-btn"><i class="fa-regular fa-square-check"></i></button>
                <button class="edit-btn"><i class="fa-solid fa-marker"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
            <span class="time">${new Date(task.time).toLocaleString()}</span>
            <span class="type">Category: ${task.type}</span>
        `;
        // <span class="time">${new Date(task.time).toLocaleString()} (Due in ${daysRemaining} days)</span>
        const completeBtn = taskItem.querySelector(".complete-btn");
        const editBtn = taskItem.querySelector(".edit-btn");
        const deleteBtn = taskItem.querySelector(".delete-btn");
        completeBtn.addEventListener("click", () => completeTask(index));
        editBtn.addEventListener("click", () => editTask(index));
        deleteBtn.addEventListener("click", () => deleteTask(index));
        taskList.appendChild(taskItem);
    });
}
function searchTasks(query) {
    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(query.toLowerCase())
    );
    updateTaskList(filteredTasks);
}
searchBtn.addEventListener("click", () => {
    const searchText = searchInput.value.trim();
    searchTasks(searchText);
});
searchInput.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        const searchText = searchInput.value.trim();
        searchTasks(searchText);
    }
});
addBtn.addEventListener("click", addTask);
document.addEventListener("DOMContentLoaded", function () {
    updateTaskList();
});

function filterTasksByCategory(category) {
    const filteredTasks = tasks.filter(task => task.type === category);
    updateTaskList(filteredTasks);
}
const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.addEventListener("change", function () {
    const selectedCategory = categoryFilter.value;
    if (selectedCategory === "all") {
        updateTaskList();
    } else {
        filterTasksByCategory(selectedCategory);
    }
    // updateTaskList();
    updateLocalStorage();
});



const reminderDateTimeInput = document.getElementById("reminderDateTime");
const setReminderBtn = document.getElementById("setReminderBtn");

let reminders = [];

setReminderBtn.addEventListener("click", setReminder);

function setReminder() {
    const reminderDateTime = new Date(reminderDateTimeInput.value).getTime();

    if (isNaN(reminderDateTime)) {
        alert("Please select a valid date and time.");
        return;
    }

    const currentTime = new Date().getTime();
    const timeUntilReminder = reminderDateTime - currentTime;

    if (timeUntilReminder <= 0) {
        alert("Please select a future date and time for the reminder.");
        return;
    }

    reminders.push({ time: reminderDateTime, timeout: setTimeout(() => showReminder(reminders.length - 1), timeUntilReminder) });
    updateLocalStorage();
    alert("Reminder set successfully!");
}


function showReminder(reminderIndex) {
    // alert("It's time for your reminder!");

    // // Clear the timeout and remove the reminder after showing it
    // clearTimeout(reminders[reminderIndex].timeout);
    // reminders.splice(reminderIndex, 1);
    // updateLocalStorage();


    const notification = document.getElementById("notification");
    const reminderAudio = document.getElementById("reminderAudio");

    // Play the audio
    reminderAudio.play();

    // Show the notification
    notification.classList.add("active");

    setTimeout(() => {
        // Hide the notification
        notification.classList.remove("active");
        // Remove the reminder after showing it
        reminders.splice(reminderIndex, 1);
        updateLocalStorage();
    }, 5000);




}



function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// document.addEventListener("DOMContentLoaded", function () {
//     const storedTasks = localStorage.getItem('tasks');
//     if (storedTasks) {
//         tasks = JSON.parse(storedTasks);
//         updateTaskList();
//     }

//     const storedDarkMode = localStorage.getItem("darkMode");
//     if (storedDarkMode === "true") {
//         body.classList.add("dark-mode");
//         themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
//     } else {
//         themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
//     }

//     const storedReminders = localStorage.getItem('reminders');
//     if (storedReminders) {
//         reminders = JSON.parse(storedReminders);
//     }
    
// });
document.addEventListener("DOMContentLoaded", function () {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateTaskList();
    }

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
        reminders = JSON.parse(storedReminders);

        // Loop through reminders and schedule notifications
        for (let i = 0; i < reminders.length; i++) {
            const currentTime = new Date().getTime();
            const timeUntilReminder = reminders[i].time - currentTime;

            if (timeUntilReminder > 0) {
                reminders[i].timeout = setTimeout(() => showReminder(i), timeUntilReminder);
            } else {
                // Remove past reminders
                reminders.splice(i, 1);
                i--;
            }
        }
    }
});
