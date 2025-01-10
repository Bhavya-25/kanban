const taskModal = document.getElementById("add_task_modal"),
  addTaskBtn = document.getElementById("add_task_btn"),
  editTaskBtn = document.getElementById("editTaskBtn"),
  taskFormModalCloseBtn = document.getElementById("task_modal_close_btn"),
  addBoardColumnBtn = document.getElementById("columnBoardBtn"),
  taskBoardModalCloseBtn = document.getElementById("board_close_btn"),
  createTaskBtn = document.getElementById("create_task_btn"),
  addBoardTaskBtn = document.getElementById("boardTaskBtn"),
  addBoardTaskInput = document.querySelectorAll(".add-board-task"),
  createFormTitle = document.getElementById("title"),
  createFormDiscreption = document.getElementById("discreption"),
  createFormSubtask = document.getElementById("subtaskInput"),
  createFormStatus = document.getElementById("statusInput"),
  boardModal = document.getElementById("boardForm"),
  createTaskBoardBtn = document.getElementById("createBoardBtn"),
  formDropdonMenue = document.getElementById("dropDownMenue"),
  newBoardTaskInputParent = document.querySelector(".board_form_subtask"),
  addNewSubtaskInputParent = document.querySelector(".form_subtask_content"),
  formAddSubtaskInput = document.getElementById("formAddSubtaskInput"),
  addnewColumnInputCta = document.getElementById("addnewColumnInputCta"),
   addNewTask = document.querySelector(".kanban_header_button"),
 addNewForm = document.querySelector(".addtask_popup_content");

 const sessionStoragefilteredCard = JSON.parse(sessionStorage.getItem("filteredCards")) || [];
let sessionStorageStatus = sessionStoragefilteredCard.map(data=>data.statusValue)
let sessionStorageTasks = []
sessionStoragefilteredCard.forEach(data=>{
    data.items.forEach(data=>{
        sessionStorageTasks.push(data)
    })
})

addTaskBtn.addEventListener("click", () => {
  showTaskModal(status, "");
  taskModal.classList.add("active");
  editTaskBtn.style.display = "none";
  createTaskBtn.style.display = "block";
  createFormTitle.value = "";
  createFormDiscreption.value = "";
  createFormSubtask.value = "";
  createFormStatus.value = "";
});

createTaskBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const status = "add";
  const taskData = {
    id: new Date().getTime(),
    title: createFormTitle.value,
    discreption: createFormDiscreption.value,
    subtask: createFormSubtask.value,
    statusInput: createFormStatus.value,
    status,
  };

  updateTasks({ status, taskData });

  // Clear the form fields and close the modal
  createFormTitle.value = "";
  createFormDiscreption.value = "";
  createFormSubtask.value = "";
  createFormStatus.value = "";
  taskModal.classList.remove("active");
  filteredCard();
  FetchDropdownData();
  FetchFormData();
  cardClick();
});

const showTaskModal = (status, taskId) => {
  if (status === "add") {
    createTaskBtn.style.display = "block";
    editTaskBtn.style.display = "none";
    // Clear the form fields
    createFormTitle.value = "";
    createFormDiscreption.value = "";
    createFormSubtask.value = "";
    createFormStatus.value = "";
    taskModal.dataset.taskId = "";
  } else if (status === "edit") {
    createTaskBtn.style.display = "none";
    editTaskBtn.style.display = "block";

    const currentTask = sessionStorageTasks.find((item) => item.id === parseInt(taskId));

    if (currentTask) {
      createFormTitle.value = currentTask.title;
      createFormDiscreption.value = currentTask.discreption;
      createFormSubtask.value = currentTask.subtask;
      createFormStatus.value = currentTask.statusInput;
      taskModal.dataset.taskId = currentTask.id;
    }
  }

  taskModal.classList.add("active");
};

const updateTasks = ({ status, taskData }) => {
  let updatedTasks;

  if (status === "add") {
    updatedTasks = [...sessionStorageTasks, taskData];
  } else if (status === "edit") {
    updatedTasks = sessionStorageTasks.map((task) =>
      task.id === taskData.id ? taskData : task
    );
  } else {
    updatedTasks = sessionStorageTasks;
  }
sessionStorageTasks = updatedTasks

};

taskFormModalCloseBtn.addEventListener("click", (event) => {
  event.preventDefault();
  taskModal.classList.remove("active");
});

addBoardColumnBtn.addEventListener("click", (event) => {
  event.preventDefault();
  boardModal.classList.add("active");

});

taskBoardModalCloseBtn.addEventListener("click", () => {
  boardModal.classList.remove("active");
});



async function FetchDropdownData() {
  let existingFormData = JSON.parse(sessionStorage.getItem("filteredCards")) || [];
  const rawTemplate = document.getElementById("dropdownTemplate").innerHTML;
  const compileData = Handlebars.compile(rawTemplate);
  const handlebarHTML = compileData(existingFormData);
  const columnData = document.getElementById("dropDownMenue");
  columnData.innerHTML = handlebarHTML;
}
FetchDropdownData();

createFormStatus.addEventListener("click", () => {
  formDropdonMenue.classList.toggle("active");
  dropdownMenu();
});
function dropdownMenu() {
  let formDropdonMenueList = document.querySelectorAll(".dropdown_menue_li");
  formDropdonMenueList.forEach((menuItem) => {
    menuItem.addEventListener("click", () => {
      formDropdonMenueList.forEach((item) => item.classList.remove("active"));
      menuItem.classList.add("active");
      createFormStatus.value = menuItem.innerText;
      formDropdonMenue.classList.remove("active");
    });
  });
}
dropdownMenu();
function cardClick() {
  const taskCards = document.querySelectorAll(".grid_cards");
  taskCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const taskId = card.dataset.id;

      if (taskId) {
        const status = "edit";
        showTaskModal(status, taskId);
      }
    });
  });
}
cardClick();

editTaskBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const status = "edit";
  const taskData = {
    id: parseInt(taskModal.dataset.taskId),
    title: createFormTitle.value,
    discreption: createFormDiscreption.value,
    subtask: createFormSubtask.value,
    statusInput: createFormStatus.value,
    status,
  };

  // Update the task data in sessionStorage

  updateTasks({ status, taskData });
  createFormTitle.value = "";
  createFormDiscreption.value = "";
  createFormSubtask.value = "";
  createFormStatus.value = "";
  taskModal.classList.remove("active");
  FetchDropdownData();
  filteredCard();
  FetchFormData();
  cardClick();
});

addnewColumnInputCta.addEventListener("click", (event) => {
  event.preventDefault();
  addNewtaskInput();
});

createTaskBoardBtn.addEventListener("click", (event) => {
  event.preventDefault();

  let existingBoardData = [...sessionStorageStatus];

  // Collect all subtask input values
  
  const boardInputs = document.querySelectorAll(".add-board-task");
  boardInputs.forEach((input) => {
    input.value;

    if (input.value !== "") {
      existingBoardData.push(input.value);
    }
  });
  sessionStorageStatus = existingBoardData

  boardInputs.forEach((input) => (input.value = ""));

  filteredCard();
  FetchDropdownData();
  FetchFormData();
  boardModal.classList.remove("active")
});

function addNewtaskInput(value = "") {
    
  const subTaskNode = document.createElement("div");
  subTaskNode.classList.add("form_subtasks");
  subTaskNode.innerHTML = `
      <input class="addtask_input task-input subtask-input add-board-task" required type="text" value="${value}" placeholder="e.g. Take coffee break">
      <span class="cross_icon"><img src="assets/icon/cross_icon.svg" alt="cross-icon"></span>`;
  newBoardTaskInputParent.appendChild(subTaskNode);

  // Attach event listener to remove subtask node
  const subTaskCloseCta = subTaskNode.querySelector(".cross_icon");
  subTaskCloseCta.addEventListener("click", () => {
    subTaskNode.remove();
  });
}

formAddSubtaskInput.addEventListener("click", (event) => {
  event.preventDefault();
  addNewtaskInput();

});

function filteredCard() {
  const status = [...sessionStorageStatus];
  const taskData = [...sessionStorageTasks];

  let filteredObj = {};
  taskData.forEach((obj) => {
    if (!filteredObj[obj.statusInput]) {
      filteredObj[obj.statusInput] = [];
    }
    filteredObj[obj.statusInput].push(obj);
  });
  const cards = status.map((statusValue) => ({
    statusValue,
    items: filteredObj[statusValue] || [],
  }));
  sessionStorage.setItem("filteredCards", JSON.stringify(cards));
}
filteredCard();


function addDragAndDropFunctionality() {
  const taskCards = document.querySelectorAll(".grid_cards");
  const columns = document.querySelectorAll(".column_data .dragable_div");

  taskCards.forEach(card => {
      card.addEventListener("dragstart", handleDragStart);
      card.addEventListener("dragend", handleDragEnd);
  });

  columns.forEach(column => {
      column.addEventListener("dragover", handleDragOver);
      column.addEventListener("drop", handleDrop);
  });
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
  setTimeout(() => {
      event.target.classList.add("dragging");
  }, 0);
}

function handleDragEnd(event) {
  event.target.classList.remove("dragging");
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text/plain");
  const draggableElement = document.querySelector(`.grid_cards[data-id="${id}"]`);
  const dropzone = event.target.closest(".column_data .dragable_div");
  dropzone.appendChild(draggableElement);

  // Update the task's status

  const newStatus = dropzone.querySelector("p").innerText;
  updateTaskStatus(id, newStatus);
}

function updateTaskStatus(id, newStatus) {
  let task = sessionStorageTasks.find(task => task.id == id);
  if (task) {
      task.statusInput = newStatus;
  }

  filteredCard();
  FetchDropdownData();
  FetchFormData();
  cardClick();
}

addDragAndDropFunctionality();



async function FetchFormData() {
  let existingFormData = JSON.parse(sessionStorage.getItem("filteredCards")) || [];
  const rawTemplate = document.getElementById("handlebarTemplate").innerHTML;
  const compileData = Handlebars.compile(rawTemplate);
  const handlebarHTML = compileData(existingFormData);
  const columnData = document.getElementById("columnData");
  columnData.innerHTML = handlebarHTML;
  addDragAndDropFunctionality();
}
FetchFormData();