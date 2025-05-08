let input = document.querySelector(".input")
let submit = document.querySelector(".add")
let tasksDiv = document.querySelector(".tasks")

let editTaskId = null;

// Dynamic input width on focus
input.addEventListener('focus', () => {
    const length = input.value.length > 0 ? input.value.length + 3 : "100%";
    input.style.width = `${length}ch`;
});

// Reset width on blur
input.addEventListener('blur', () => {
    input.style.width = '100%';
});





let arrayOfTasks = [];

if (window.localStorage.getItem('tasks')) {
    arrayOfTasks = JSON.parse(window.localStorage.getItem('tasks'))
}
getDataFromLocalStorage();


submit.onclick = () => {

    if (validateInput()) {
        if (editTaskId) {
            updateTask(editTaskId, input.value);
            editTaskId = null;
            submit.textContent = "Add";
        } else {
            addTaskToArray(input.value);
        }
        input.value = "";
        input.style.width = '100%';
    }

};

// Remove validation error when the input gains focus
input.addEventListener("focus", () => {
    input.classList.remove("is-invalid");
});


// Validate the input
function validateInput() {
    if (input.value.trim() === "") {
        input.classList.add("is-invalid");
        return false;
    }
    input.classList.remove("is-invalid");
    return true;
}

// Click on Task Element 
tasksDiv.addEventListener("click", (e) => {
    //Delete
    if (e.target.classList.contains("del")) {
        //Remove Element from Local Storage
        deleteTaskWithId(e.target.parentElement.parentElement.getAttribute("data-id"))
        //Remove Element from Page
        e.target.parentElement.parentElement.remove();
    }

    //Update
    if (e.target.classList.contains("cmp")) {
        toggleTaskStatusWithId(e.target.parentElement.parentElement.getAttribute("data-id"), e.target)
        e.target.parentElement.parentElement.classList.toggle("done")

    }
    if (e.target.classList.contains('edit')) {
        let taskId = e.target.parentElement.parentElement.getAttribute("data-id");
        let task = arrayOfTasks.find(t => t.id == taskId);
        input.value = task.title;
        input.style.width = `${task.title.length + 3}ch`;
        input.focus();
        editTaskId = taskId;
        submit.textContent = "Update";
    }
})


function addTaskToArray(taskText) {
    const task =
    {
        id: Date.now(),
        title: taskText,
        completed: false,
    }
    arrayOfTasks.push(task);

    //display tasks on page
    addElementsToPageFrom(arrayOfTasks);
    addDataToLocalStorageFrom(arrayOfTasks);

}


//display task on page from the array
function addElementsToPageFrom(arrayOfTasks) {
    // Empty Tasks Div
    if (arrayOfTasks.length == 0) {
        tasksDiv.innerHTML = `<div class='task'> No Tasks </div>`
        return
    }
    tasksDiv.innerHTML = "";
    // Looping on Array of Tasks

    arrayOfTasks.forEach((task) => {
        //main Task
        let taskDiv = document.createElement("div");
        taskDiv.className = 'task'
        if (task.completed) {
            taskDiv.className = "task done"
        }
        taskDiv.setAttribute("data-id", task.id)

        //console.log(taskDiv)
        // Buttons Div
        let ButtonsDiv = document.createElement('div')
        ButtonsDiv.className = "Buttons"
        //console.log(ButtonsDiv.parentElement)

        // Complete Button
        let spanCmp = document.createElement("button")
        spanCmp.className = 'cmp btn btn-success'
        if (task.completed)
            spanCmp.appendChild(document.createTextNode("To Do"))
        else spanCmp.appendChild(document.createTextNode("Done"))
        ButtonsDiv.appendChild(spanCmp)
        //Edit Button
        let spanEdit = document.createElement("button")
        spanEdit.className = 'edit btn btn-secondary'
        spanEdit.appendChild(document.createTextNode("Edit"))
        ButtonsDiv.appendChild(spanEdit)
        // Delete Button
        let spanDel = document.createElement("button")
        spanDel.className = 'del btn btn-danger'
        spanDel.appendChild(document.createTextNode("Delete"))
        ButtonsDiv.appendChild(spanDel);

        //display Task on Tasks
        let titleDiv = document.createElement("div");
        titleDiv.className = "task-title";
        titleDiv.textContent = task.title;
        taskDiv.appendChild(titleDiv);

        taskDiv.appendChild(ButtonsDiv);
        tasksDiv.append(taskDiv)
    });
}


function addDataToLocalStorageFrom(arrayOfTasks) {
    window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage() {
    let data = window.localStorage.getItem("tasks");
    if (data) {
        arrayOfTasks = JSON.parse(data);
        addElementsToPageFrom(arrayOfTasks)
    }
    else {
        tasksDiv.innerHTML = `<div class='task'> No Tasks </div>`;
        //console.log(tasksDiv)
        return
    }
}

function deleteTaskWithId(taskId) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId)
    addDataToLocalStorageFrom(arrayOfTasks)
    addElementsToPageFrom(arrayOfTasks);

}

function updateTask(id, newTitle) {
    arrayOfTasks = arrayOfTasks.map(task => {
        if (task.id == id) {
            return { ...task, title: newTitle };
        }
        return task;
    });
    addDataToLocalStorageFrom(arrayOfTasks);
    addElementsToPageFrom(arrayOfTasks);
}

function toggleTaskStatusWithId(taskId, textButton) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == taskId) {
            if (arrayOfTasks[i].completed == false) {
                arrayOfTasks[i].completed = true;
                textButton.textContent = "To Do"
            }
            else {
                arrayOfTasks[i].completed = false;
                textButton.textContent = "Done"
            }

        }
    }
    addDataToLocalStorageFrom(arrayOfTasks)
}
