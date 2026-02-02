// Simple Todo App

let todos = [];
let todoId = 1;
let todoModal;

// DOM Elements
const todoContainer = document.getElementById("todoContainer");
const saveTodoBtn = document.getElementById("saveTodo");
const titleInput = document.getElementById("todoTitle");
const descInput = document.getElementById("todoDescription");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  todoModal = new bootstrap.Modal(document.getElementById("todoModal"));
  loadTodos();
  renderTodos();
  saveTodoBtn.addEventListener("click", addTodo);
  document
    .getElementById("todoModal")
    .addEventListener("hidden.bs.modal", clearForm);
});

// Load from localStorage
function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
    todoId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  }
}

// Save to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Add todo
function addTodo() {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title || !description) {
    alert("Please fill all fields");
    return;
  }

  todos.unshift({
    id: todoId++,
    title,
    description,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoModal.hide();
}

// Clear form
function clearForm() {
  titleInput.value = "";
  descInput.value = "";
}

// Render todos
function renderTodos() {
  todoContainer.innerHTML = "";

  if (todos.length === 0) {
    todoContainer.appendChild(
      document
        .getElementById("emptyTemplate")
        .firstElementChild.cloneNode(true),
    );
    return;
  }

  const todoTemplate = document.getElementById("todoTemplate");

  todos.forEach((todo) => {
    const clone = todoTemplate.firstElementChild.cloneNode(true);

    console.log("clone", clone);

    clone.querySelector(".todo-title").textContent = todo.title;
    clone.querySelector(".todo-desc").textContent = todo.description;

    if (todo.completed) {
      clone.querySelector(".todo-card").classList.add("completed");
      clone.querySelector(".done-icon").classList.remove("d-none");
      clone.querySelector(".mark-done-item").remove();
    } else {
      clone
        .querySelector(".mark-done-btn")
        .addEventListener("click", () => markDone(todo.id));
    }

    clone
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteTodo(todo.id));

    todoContainer.appendChild(clone);
  });
}

// Mark as done
function markDone(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = true;
    saveTodos();
    renderTodos();
  }
}

// Delete todo
function deleteTodo(id) {
  const prompt = confirm("Delete this todo?");
  if (prompt) {
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
    renderTodos();
  }
}
