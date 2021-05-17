class TodoList {
  constructor() {
    this.addTodoButton = document.querySelector(".todo-button");
    this.todoList = document.querySelector(".todo-list");
    this.todoInput = document.querySelector(".todo-input");
    this.filter = document.querySelector(".filter-todo");
    this.addListeners();
  }

  addListeners() {
    this.addTodoButton.addEventListener("click", this.addTodoTask);
    this.todoList.addEventListener("click", this.removeTodoTask);
    this.todoList.addEventListener("click", this.completeTodoTask);
    this.filter.addEventListener("click", this.applyFilter);
    document.addEventListener(
      "DOMContentLoaded",
      this.getTasksFromLocalStorage
    );
  }

  addTodoTask = (event) => {
    event.preventDefault();
    let todo = this.todoInput.value;
    if (!todo || todo[0] == " " || todo[todo.length-1] == ' ') {
      alert("Do not use whitespace as a first/last symbol");
      return;
    }
    this.todoList.insertAdjacentHTML("afterbegin", this.getTodotemplate(todo));

    //addinput to local storage
    this.addTaskToLocalStorage(todo);

    // clear todoiput
    this.todoInput.value = "";
  };

  getTodotemplate = (todo, style = "") => {
    return `
    <div class="todo ${style}">
          <li class="todo-item ">${todo}</li>
          <button class="complete-btn"><i class="fas fa-check"></i> </button>
          <button class="trash-btn"><i class="fas fa-trash"></i></button>
    </div>
    `;
  };

  removeTodoTask = (event) => {
    if (!event.target.classList.contains("trash-btn")) {
      return;
    }

    const todo = event.target.parentElement;
    todo.classList.add("fall");
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
    this.removeTaskFromLocalStorage(todo);
  };

  completeTodoTask = (event) => {
    if (event.target.classList.contains("complete-btn")) {
      event.target.parentElement.classList.toggle("completed");
      // add to localstorage styles
      const taskStyle = event.target.parentElement.classList[1];
      const taskText = event.target.parentElement.querySelector(".todo-item")
        .innerText;
      this.addTaskToLocalStorage(taskText, taskStyle);
    }
  };

  applyFilter = (event) => {
    if (!event.target.value) {
      return;
    }
    const todoElements = this.todoList.children;
    for (let item of todoElements) {
      switch (event.target.value) {
        case "all":
          item.style.display = "flex";
          break;
        case "completed":
          if (item.classList.contains("completed")) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
          break;
        case "uncomplited":
          if (!item.classList.contains("completed")) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
          break;
      }
    }
  };

  addTaskToLocalStorage = (todo, style = "") => {
    let tasks = null;
    let sameTaskInLocalStorage = null; // item in local storage
    let index = null;

    const todoObj = {
      task: todo,
      style: style,
    };

    if (localStorage.getItem("tasks") === null) {
      tasks = [];
      tasks.push(todoObj);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      return;
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
      sameTaskInLocalStorage = tasks.find((item) =>
        item.task == todoObj.task ? true : false
      );
    }

    if (!sameTaskInLocalStorage) {
      tasks.push(todoObj);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      return;
    } else {
      index = tasks.findIndex((item) =>
        item == sameTaskInLocalStorage ? true : false
      );
      sameTaskInLocalStorage.style = todoObj.style;
      Object.assign(tasks[index], sameTaskInLocalStorage);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  getTasksFromLocalStorage = () => {
    let tasks = null;
    if (localStorage.getItem("tasks") === null) {
      return;
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    // render tasks
    tasks.forEach((item) => {
      this.todoList.insertAdjacentHTML(
        "afterbegin",
        this.getTodotemplate(item.task, item.style)
      );
    });
  };

  removeTaskFromLocalStorage = (todo) => {
    let tasks = null;
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const todoText = todo.children[0].innerText; // get text from task
    tasks = tasks.filter((item) => item.task != todoText); // remove deleted item from array
    localStorage.setItem("tasks", JSON.stringify(tasks)); // push new array to local storage
  };
}

let createTodoList = new TodoList();
