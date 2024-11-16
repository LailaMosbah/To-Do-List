let input = document.querySelector(".input")
let submit = document.querySelector(".add")
let tasksdiv = document.querySelector(".tasks")

let arrayOfTasks = [];

if(window.localStorage.getItem('tasks')){
    arrayOfTasks = JSON.parse(window.localStorage.getItem('tasks')) 
}
getDataFromLocalStorage();


submit.onclick = ()=>{
    if(input.value !== ""){
        addTaskToArray(input.value);
        input.value = "";
    }
}

// Click on Task Element 
tasksdiv.addEventListener("click",(e)=>{
    //Delete
    if(e.target.classList.contains("del")){
        //Remove Element from Local Storage
        deleteTaskWithId(e.target.parentElement.getAttribute("data-id"))
        //Remove Element from Page
        e.target.parentElement.remove();
    }

    //Update
    if(e.target.classList.contains("task")){
        toggleTaskStatusWithId(e.target.getAttribute("data-id"))
        e.target.classList.toggle("done")
    }
})


function addTaskToArray(taskText){
    const task= 
    {
        id : Date.now(),
        title : taskText,
        completed : false,
    }
    arrayOfTasks.push(task);

    //display tasks on page
    addElementsToPageFrom(arrayOfTasks);
    addDataToLocalStorageFrom(arrayOfTasks);
    
}


//display task on page from the array
function addElementsToPageFrom(arrayOfTasks){
    // Empty Tasks Div
    tasksdiv.innerHTML = "";
    // Looping on Array of Tasks

    arrayOfTasks.forEach((task) => {
        //main Task
        let div = document.createElement("div");
        div.className = 'task'
        if(task.completed) {
            div.className = "task done"
        }
        div.setAttribute("data-id",task.id)
        div.appendChild(document.createTextNode(task.title))
        console.log(div)
        // Delete Button
        let span = document.createElement("span")
        span.className = 'del'
        span.appendChild(document.createTextNode("Delete"))
        div.appendChild(span);
        //display Task on Tasks
        tasksdiv.appendChild(div);
    });
}


function addDataToLocalStorageFrom(arrayOfTasks){
    window.localStorage.setItem("tasks",JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage(){
    let data = window.localStorage.getItem("tasks");
    if(data){
        let tasks = JSON.parse(data);
        addElementsToPageFrom(tasks)
    }
}

function deleteTaskWithId(taskId){
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId)
    addDataToLocalStorageFrom(arrayOfTasks)

}

function toggleTaskStatusWithId(taskId){
    for(let i =0 ; i<arrayOfTasks.length ; i++){
        if(arrayOfTasks[i].id == taskId){
            arrayOfTasks[i].completed == false ? (arrayOfTasks[i].completed = true) : (arrayOfTasks[i].completed = false)
        }
    }
    addDataToLocalStorageFrom(arrayOfTasks)
}
