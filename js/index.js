// alert("connected");
$(document).ready(function () {
    //create Base URL variable
    const BASE_URL = "http://localhost:3000";
  
    /**API Request Functions */
  
    //get all todos from DB
    const fetchTodos = async () => {
      //fetch data from the server using the fetch API
      const response = await fetch(`${BASE_URL}/todos`);
  
      //convert the response to JSON
      const data = await response.json();
      // console.log({ data });
  
      //return the data
      return data;
    };
  
    //get a todo by its ID
    const fetchTodo = async (id) => {
      //fetch data from the server using the fetch API
      const response = await fetch(`${BASE_URL}/todos/${id}`);
  
      //convert the response to JSON
      const data = await response.json();
      // console.log({ data });
  
      //return the data
      return data;
    };
  
    //add a new todo to the server
    const addTodo = async (text) => {
      //fetch data from the server using the fetch API
      const response = await fetch(`${BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, completed: false }),
      });
  
      //convert the response to JSON
      const data = await response.json();
      // console.log({ data });
  
      //return the data
      return data;
    };
  
    /**Other functions to handle CRUD requests */
  
    //create render function to retrieve data from the server and render it to the page
    const render = async () => {
      //fetch all todos from the server
      const todos = await fetchTodos();
      // console.log("todos from render", { todos });
  
      // Clear the current list
      $("#todoList").empty();
  
      // Loop through the todos array and append each todo to the list
      todos.forEach(function (todo, index) {
        let todoItem = `<li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span class="todo-text ${
                                      todo.completed ? "completed" : ""
                                    }">${todo.text}</span>
                                    <div>
                                        <button class="btn btn-sm btn-secondary editTodo" data-index="${
                                          todo.id
                                        }">Edit</button>
                                        <button class="btn btn-sm btn-success toggleTodo" data-index="${
                                          todo.id
                                        }">${
          todo.completed ? "Incomplete" : "Complete"
        }</button>
                                        <button class="btn btn-sm btn-danger deleteTodo" data-index="${
                                          todo.id
                                        }">Delete</button>
                                    </div>
                                </li>`;
        $("#todoList").append(todoItem);
      });
    };
  
    // Call the render function when the page loads
    render();
  
    //add event listener to the add todo button
    $("#addTodo").click(async (event) => {
      event.preventDefault();
      //get the value of the input field
      const text = $("#newTodo").val();
      // console.log({ text });
  
      if (!text) {
        alert("Please enter a todo");
        return;
      }
  
      //add the todo to the server
      try {
        await addTodo(text);
      } catch (error) {
        console.log(error);
      } finally {
        //clear the input field regardless of the outcome
        $("#newTodo").val("");
      }
  
      //re-render the todos by calling the render function
      render();
    });
  
    //add event listener to the delete button
    //Need to use event delegation since the delete button is dynamically created
    $(document).on("click", ".deleteTodo", async function () {
      // Get the id of the todo to be deleted
      const id = $(this).data("index");
      console.log("deleting", { id });
  
      // Delete the todo from the server
      await fetch(`${BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });
  
      // Re-render the todos by calling the render function
      render();
    });
  
    //add event listener to the toggleTodo button
    //Need to use event delegation since the toggleTodo button is dynamically created
    $(document).on("click", ".toggleTodo", async function () {
      // Get the id of the todo to be deleted
      const id = $(this).data("index");
      // fetch the todo from the server
      const todo = await fetchTodo(id);
      // console.log("editing", { id, todo });
  
      await fetch(`${BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // toggle the todo status to bo the opposite of what it currently is
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
  
      // Re-render the todos by calling the render function
      render();
    });
  
    //add event listener to the editTodo button
    //Need to use event delegation since the editTodo button is dynamically created
    $(document).on("click", ".editTodo", async function () {
      // Get the id of the todo to be deleted
      const id = $(this).data("index");
      // fetch the todo from the server
      const todo = await fetchTodo(id);
      let todoTextElement = $(this).closest("li").find(".todo-text");
      const newText = prompt("Edit your to-do:", todo.text);
  
      console.log("editing", { id, todoTextElement, newText });
  
      await fetch(`${BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // toggle the todo status to bo the opposite of what it currently is
        body: JSON.stringify({ ...todo, text: newText }),
      });
  
      // Re-render the todos by calling the render function
      render();
    });
  });