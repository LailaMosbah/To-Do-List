let input = document.querySelector(".input")
let submit = document.querySelector(".add")
let tasksDiv = document.querySelector(".tasks")

// Length of Text Area
  input.addEventListener('input', () => {
    input.style.width = `${input.value.length + 3}ch`;
  });




let arrayOfTasks = [];

if(window.localStorage.getItem('tasks')){
    arrayOfTasks = JSON.parse(window.localStorage.getItem('tasks')) 
}
getDataFromLocalStorage();


submit.onclick = () => {
    // Check if the input is valid
    if (validateInput()) {
        addTaskToArray(input.value);
        input.value = "";
        input.style.width = "auto";
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
tasksDiv.addEventListener("click",(e)=>{
    //Delete
    if(e.target.classList.contains("del")){
        //Remove Element from Local Storage
        deleteTaskWithId(e.target.parentElement.parentElement.getAttribute("data-id"))
        //Remove Element from Page
        e.target.parentElement.parentElement.remove();
    }

    //Update
    if(e.target.classList.contains("cmp")){
        toggleTaskStatusWithId(e.target.parentElement.parentElement.getAttribute("data-id"),e.target)
        e.target.parentElement.parentElement.classList.toggle("done")
       
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
    tasksDiv.innerHTML = "";
    // Looping on Array of Tasks

    arrayOfTasks.forEach((task) => {
        //main Task
        let taskDiv = document.createElement("div");
        taskDiv.className = 'task'
        if(task.completed) {
            taskDiv.className = "task done"
        }
        taskDiv.setAttribute("data-id",task.id)
        
        console.log(taskDiv)
        // Buttons Div
        let ButtonsDiv = document.createElement('div')
        ButtonsDiv.className = "Buttons"
        console.log(ButtonsDiv.parentElement)
        // Delete Button
        let spanDel = document.createElement("button")
        spanDel.className = 'del btn btn-danger'
        spanDel.appendChild(document.createTextNode("Delete"))
        ButtonsDiv.appendChild(spanDel);
        // Complete Button
        let spanCmp = document.createElement("button")
        spanCmp.className = 'cmp btn btn-success'
        if(task.completed)
         spanCmp.appendChild(document.createTextNode("Uncomplete"))
        else spanCmp.appendChild(document.createTextNode("Complete"))
        ButtonsDiv.appendChild(spanCmp)
    
        //display Task on Tasks
        taskDiv.appendChild(document.createTextNode(task.title))
        taskDiv.appendChild(ButtonsDiv);
        tasksDiv.append(taskDiv)
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

function toggleTaskStatusWithId(taskId,textButton){
    for(let i =0 ; i<arrayOfTasks.length ; i++){
        if(arrayOfTasks[i].id == taskId){
            if(arrayOfTasks[i].completed == false)
            {
                arrayOfTasks[i].completed = true;
                textButton.textContent = "Uncomplete"
            }
            else
            {
                arrayOfTasks[i].completed = false;
                 textButton.textContent = "Complete"
            }
            
        }
    }
    addDataToLocalStorageFrom(arrayOfTasks)
}
