function TodoList() {
    this.list = JSON.parse(localStorage.getItem('items')) || [];

    this.createItem = function(item) {
        const sanitizedValue = item.trim();
        this.list.push(sanitizedValue);
        return this.list.length > 0 ? {success:`${sanitizedValue} has been saved!`} : {error: `Todo list is empty. Item has not been saved.`};
    }

    this.saveItem = function() {
        console.log('item saved in the list');
        const uniqueItems = [... new Set(this.list)];
        localStorage.setItem('items', JSON.stringify(uniqueItems));
        this.renderItems();
    }

    this.deleteItem = function(item) {
        const itemIndex = this.list.indexOf(item);
        if (itemIndex !== -1) {
            this.list.splice(itemIndex, 1); 
            localStorage.setItem('items', JSON.stringify(this.list));
            this.renderItems();
        }
    }

    this.deleteAllItems = function() {
        localStorage.clear();
    }

    this.renderItems = function() {
        const listContainer = document.querySelector('.list_container');
        listContainer.innerHTML = '';
        const list = this.list.slice().reverse().map(item => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.classList.add('close');
            li.textContent = item;
            li.append(button)
            return li.outerHTML
        }).join("");
        listContainer.innerHTML = list;
        const buttons = document.querySelectorAll('.close');
        buttons.forEach((btn, index) => {
            btn.addEventListener("click", (e) => {
                const item = e.target.parentNode;
                this.deleteItem(item.textContent);
                item.remove();
            });
        });
    }
    
}

let todoList = new TodoList(); 

function titleComponent(titleName = 'To-Do List') {
    const app = document.getElementById('App');
    const h1 = document.createElement('h1');
    h1.textContent = titleName;
    const alertContainer = document.createElement('div');
    alertContainer.setAttribute('id', 'alertMessage')
    alertContainer.classList.add('warning');
    app.append(h1);
    app.append(alertContainer);
}

function inputComponent() {
    const app = document.getElementById('App');
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('add_task_container');
    
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('id', 'addTask');

    const button = document.createElement('button')
    button.classList.add('add_button');
    button.textContent = 'Add'
    button.addEventListener('click', () => {
        if (inputField.value.length !== '' && inputField.value.length > 3) {
            todoList.createItem(inputField.value);
            todoList.saveItem();
            todoList.renderItems();
            inputField.value = '';
        } else {
            document.getElementById('alertMessage').textContent = 'Cannot be empty or less than 3 chars or the same value';
        }
    })

    inputContainer.append(inputField);
    inputContainer.append(button);
    
    app.append(inputContainer);
}

function renderList() {
    const app = document.getElementById('App');
    const listContainer = document.createElement('ul');
    listContainer.classList.add('list_container');
    app.append(listContainer);
    todoList.renderItems();
}


titleComponent()
inputComponent()
renderList()
