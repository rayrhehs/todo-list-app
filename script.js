class todoMaker {
  constructor(newList) {
    this.newList = newList;
    this.todoID = 0;
    // stores the independent input state of each ID element.
    this.inputAllowed = {};
    this.todoState = {};
    this.iconNames = {
      trash: "delete",
      edit: "edit-button",
      add: "add-button",
      save: "save-button",
    };
  }

  // call this function after initializing the method to have it run
  setupAddButton() {
    let addButton = document.createElement("button");
    addButton.classList.add("add-button");
    this.createIcon(this.iconNames, addButton);

    addButton.addEventListener("click", () => {
      this.createListItem(this.todoID);
      this.todoID += 1;
    });

    this.newList.parentElement.appendChild(addButton);
  }

  createListItem(ID) {
    let newListItem = document.createElement("li");
    newListItem.classList.add("task");
    // newListItem.setAttribute("draggable", "false");

    newListItem.id = ID;

    this.setupCheckBox(newListItem, ID);
    this.setupTextBox(newListItem, ID);
    this.setupEditButton(newListItem, ID);
    this.setupDeleteButton(newListItem, ID);
    // this.setupDraggable(newListItem);
    this.newList.appendChild(newListItem);

    // puts textbox in focus once a list item is generated
    let textBox = document.querySelector(".textbox-" + ID);
    textBox.focus();
  }

  // setupDraggable(parentElement, ID) {
  //   let allLists = document.querySelectorAll(".todo-list");

  //   // code for dragging
  //   parentElement.addEventListener("dragstart", () => {
  //     parentElement.classList.add("is-dragging");
  //   });
  //   parentElement.addEventListener("dragend", () => {
  //     parentElement.classList.remove("is-dragging");

  //     let parentCategory = parentElement.parentNode;
  //     let textInput = document.querySelector(".textbox-" + ID);

  //     if (parentCategory.getAttribute("class") == "todo-list done") {
  //       parentElement.firstChild.checked = true;
  //     } else {
  //       parentElement.firstChild.checked = false;
  //     }
  //   });

  //   // code for dropping
  //   allLists.forEach((item) => {
  //     item.addEventListener("dragover", (e) => {
  //       e.preventDefault();

  //       const bottomTask = this.insertAboveTask(item, e.clientY);
  //       const currentDrag = document.querySelector(".is-dragging");

  //       if (!bottomTask) {
  //         item.appendChild(currentDrag);
  //       } else {
  //         item.insertBefore(currentDrag, bottomTask);
  //       }
  //     });
  //   });
  // }

  // insertAboveTask(listItem, mouseY) {
  //   const item = listItem.querySelectorAll(".task:not(.is-dragging)");

  //   let closestTask = null;
  //   let closestOffset = Number.NEGATIVE_INFINITY;

  //   item.forEach((task) => {
  //     const { top } = task.getBoundingClientRect();
  //     const offset = mouseY - top;

  //     if (offset < 0 && offset > closestOffset) {
  //       closestOffset = offset;
  //       closestTask = task;
  //     }
  //   });
  //   return closestTask;
  // }

  setupCheckBox(parentElement, ID) {
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("checkbox");
    checkBox.id = ID;

    checkBox.addEventListener("change", () => {
      this.checkState(checkBox, ID);
    });

    parentElement.appendChild(checkBox);
  }

  setupTextBox(parentElement, ID) {
    let textBox = document.createElement("input");
    textBox.setAttribute("placeholder", "enter task...");
    textBox.classList.add("textbox-" + ID);

    parentElement.appendChild(textBox);
  }

  setupEditButton(parentElement, ID) {
    let editButton = document.createElement("button");
    editButton.classList.add("save-button");
    editButton.id = ID;
    this.createIcon(this.iconNames, editButton);

    editButton.addEventListener("click", () => {
      this.editTextContent(parentElement, editButton, ID);
    });

    parentElement.appendChild(editButton);
  }

  editTextContent(parentElement, editButton, ID) {
    let textBox = document.querySelector(".textbox-" + ID);
    let iconNames = ["edit", "save"];

    // if this is not inside the inputAllowed object -> run this
    // runs the first time a button is made
    if (this.inputAllowed[ID] === undefined) {
      this.inputAllowed[ID] = false;
    }

    // inverts current input state so the opposite operation can be can be done
    // sets it into variable
    const newFlagState = !this.inputAllowed[ID];
    this.inputAllowed[ID] = newFlagState;

    if (newFlagState) {
      this.iconChanger(editButton, iconNames[0]);
      // disables editing
      textBox.setAttribute("readonly", "readonly"); // fake way of holding text - freezes text inside
      // parentElement.setAttribute("draggable", "true");
    } else {
      this.iconChanger(editButton, iconNames[1]);
      console.log(newFlagState);
      // enables editing
      textBox.removeAttribute("readonly", "readonly");
      // parentElement.setAttribute("draggable", "false");
      if (!textBox.focus()) {
        textBox.focus();
      }
    }
  }

  iconChanger(selectedButton, iconName) {
    selectedButton
      .querySelector(".icon")
      .setAttribute("src", "icons/" + iconName + ".svg");
  }

  // set the state
  // if checkbox is clicked -> set state to "done"
  // if checkbox is unclicked -> set state to "doing"

  // if parentElement = 1st list
  // how to create interactability between these

  // check the state
  // if state = "done" -> move to 2nd list
  // add strike through
  // else if state = "doing" -> move to 1st list

  checkState(checkBox, ID) {
    let oldParent = document.getElementsByClassName("todo-list")[0];
    let newParent = document.getElementsByClassName("todo-list")[1];
    let textInput = document.querySelector(".textbox-" + ID);

    // if (this.checkState[ID] === undefined) {
    //   this.checkState[ID] = "";
    // }

    if (checkBox.checked) {
      // change state to complete
      // if state complete -> move to other category
      newParent.appendChild(checkBox.parentElement);
      textInput.style.textDecoration = "line-through";
    } else {
      // change state to unchecked
      // move to unchecked category
      oldParent.appendChild(checkBox.parentElement);
      textInput.style.textDecoration = "none";
    }
  }

  setupDeleteButton(parentElement, ID) {
    let deleteB = document.createElement("button");
    deleteB.classList.add("delete");
    this.createIcon(this.iconNames, deleteB);

    deleteB.addEventListener("click", () => {
      this.deleteListItem(ID);
    });

    parentElement.appendChild(deleteB);
  }

  // flaw: if i add more buttons to this, how will it know which one is which?
  // replace parameter with ID instead of using element.parentnode
  // works the same but finds the element by the ID and uses it to remove child
  deleteListItem(ID) {
    let elementToDelete = document.getElementById(ID);
    if (elementToDelete) {
      elementToDelete.parentNode.removeChild(elementToDelete);
    }
  }

  createIcon(iconNames, parentButton) {
    let imageSpan = document.createElement("span");
    let createImg = document.createElement("img");
    let buttonClassName = parentButton.getAttribute("class");
    let imgName = this.getKeyByValue(iconNames, buttonClassName);

    // index object by iconNames[x]
    if (iconNames[imgName] === buttonClassName) {
      createImg.setAttribute("src", "icons/" + imgName + ".svg");
      createImg.classList.add("icon");
    }

    imageSpan.appendChild(createImg);
    parentButton.appendChild(imageSpan);
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  // saveData() {
  //   localStorage.setItem("data", this);
  //   localStorage.setItem("data", this);
  //   console.log("this is saved!");
  // }

  // loadData() {
  //   document.getElementsByClassName("todo-list")[0].innerHTML =
  //     localStorage.getItem("data");
  //   document.getElementsByClassName("todo-list")[1].innerHTML =
  //     localStorage.getItem("data");
  // }
}

const todoList = document.getElementsByClassName("todo-list")[0];
const todoListInit = new todoMaker(todoList);

const todoList2 = document.getElementsByClassName("todo-list")[1];
const todoListInit2 = new todoMaker(todoList2);

// calling this generates the "add" button
todoListInit.setupAddButton();
