const inputUnit = document.getElementById("taskinput")
let addButton = document.getElementById("add")
let taskUnit = document.querySelector(".tasks")
let taskInfoUnit = document.querySelector("#task-info")
let taskCount = 0
let taskCompleted = 0
let editingTask = null
// taskInfoUnit.textContent = "Enter your Tasks"

function taskInfo() {
  if (taskCount === 0) {
    taskInfoUnit.textContent = "Enter your tasks"
  }
  else {
    taskInfoUnit.textContent = `${taskCompleted} completed out of ${taskCount}`
  }
}
function addTask() {
  let task = document.createElement("div")
  task.classList.add("taskbar")
  if (inputUnit.value === "") return;
  if (editingTask) {
    editingTask.textContent = inputUnit.value
    inputUnit.value = ""
    editingTask = null;
    addButton.innerHTML = `
      <span id="plus">+</span>
      <span>Add</span>
    `
    saveTasks();
    return;
  }
  task.innerHTML = `<div class = "checkbox-input">
                    <input type = "checkbox" class="taskCB">
                    <p>${inputUnit.value}</p>
                    </div>
                    <div class = "delete-edit">
                    <img src="edit.png" alt="delete" style="width:20px" class="editBtn"> 
                    <img src="delete.png" alt="delete" style="width:20px" class="deleteBtn"> 
                    </div>
                    </div>
                 `
  task.classList.add("taskbar")
  taskUnit.appendChild(task)
  inputUnit.value = ""
  taskCount++
  taskInfo();
  saveTasks();
}
addButton.addEventListener("click", addTask)
inputUnit.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask()
  }
})


taskUnit.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const taskEle = e.target.closest(".taskbar")
    const checkboxEle = taskEle.querySelector(".taskCB")
    if (checkboxEle.checked) {
      taskCompleted--
    }
    taskEle.remove();
    taskCount--
    taskInfo()
    saveTasks();
  }
})
taskUnit.addEventListener("change", (e) => {
  if (e.target.classList.contains("taskCB")) {
    e.target.parentElement.classList.toggle("checked", e.target.checked)
    if (e.target.checked) {
      taskCompleted++
    }
    else {
      taskCompleted--
    }
    taskInfo()
    saveTasks();
  }

})

taskUnit.addEventListener("click", (e) => {
  if (e.target.classList.contains("editBtn")) {
    let taskBarToEdit = e.target.closest(".taskbar")
    editingTask = taskBarToEdit.querySelector("p")
    addButton.innerHTML = `<span>Save</span>`
    inputUnit.focus()
    inputUnit.value = editingTask.textContent
    inputUnit.select();

  }
})

let allButton = document.getElementById("all")
let activeButton = document.getElementById("active")
let doneButton = document.getElementById("done")

allButton.addEventListener("click", () => {
  document.querySelectorAll(".taskbar").forEach((e) => {
    e.style.display = "flex"
  })
})

activeButton.addEventListener("click", () => {
  document.querySelectorAll(".taskbar").forEach((e) => {
    const checkbox = e.querySelector(".taskCB")
    if (checkbox.checked) {
      e.style.display = "none"
    }
    else {
      e.style.display = "flex"
    }
  })
})

doneButton.addEventListener("click", () => {
  document.querySelectorAll(".taskbar").forEach((e) => {
    const checkbox = e.querySelector(".taskCB")
    if (checkbox.checked) {
      e.style.display = "flex"
    }
    else {
      e.style.display = "none"
    }
  })
})
let clearBtn = document.querySelector(".clear-btn")
clearBtn.addEventListener("click", () => {
  let allCheckboxes = document.querySelectorAll(".checkbox-input")
  allCheckboxes.forEach((Ele) => {
    if (Ele.classList.contains("checked")) {
      taskCompleted--
      taskCount--
      Ele.parentElement.remove()
    }
  })
  taskInfo()
  saveTasks()
})
//Local Storage
function saveTasks() {
  let allItems = document.querySelectorAll(".taskbar")
  let taskArray = []
  allItems.forEach((Ele) => {
    let taskText = Ele.querySelector("p").textContent
    let ischecked = Ele.querySelector(".taskCB").checked
    taskArray.push({ text: taskText, completed: ischecked })
  })
  localStorage.setItem("taskItems", JSON.stringify(taskArray))
}

function loadTasks() {
  let tasksString = localStorage.getItem("taskItems")
  if (!tasksString) {
    return
  }
  let tasksArray = JSON.parse(tasksString)
  tasksArray.forEach((savedTask) => {
    let task = document.createElement("div")
    task.classList.add("taskbar")
    task.innerHTML = `
                    <div class = "checkbox-input">
                    <input type = "checkbox" class="taskCB">
                    <p>${savedTask.text}</p>
                    </div>
                    <div class = "delete-edit">
                    <img src="edit.png" alt="delete" style="width:20px" class="editBtn"> 
                    <img src="delete.png" alt="delete" style="width:20px" class="deleteBtn"> 
                    </div>
                    </div>`
    if (savedTask.completed) {
      let checkbox = task.querySelector(".taskCB")
      checkbox.checked = true
      task.querySelector(".checkbox-input").classList.add("checked")
      taskCompleted++
    }
    taskUnit.appendChild(task)
    taskCount++
  })
  taskInfo()
}
loadTasks();
taskInfo();
