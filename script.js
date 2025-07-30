class TodoList {
    constructor(containerSelector, listSelector) {
        this.container = document.querySelector(containerSelector);
        this.list = JSON.parse(localStorage.getItem('items')) || [];
        this.render();
    }

    add(item) {
        const value = item.trim();
        if (value.length < 3) {
            this.showAlert('Cannot be empty or less than 3 chars');
            return false;
        }
        if (this.list.includes(value)) {
            this.showAlert('Duplicate item');
            return false;
        }
        this.list.push(value);
        this.save();
        this.render();
        this.showAlert(`${value} has been saved!`, true);
        return true;
    }

    save() {
        localStorage.setItem('items', JSON.stringify(this.list));
    }

    remove(item) {
        const itemIndex = this.list.indexOf(item);
        if (itemIndex !== -1) {
            this.list.splice(itemIndex, 1);
            this.save();
            this.render();
            this.showAlert(`"${item}" removed.`, true);
        }
    }

    clear = function() {
        this.list.length = 0;
        localStorage.removeItem('items');
        this.render();
        this.showAlert('All items cleared.', true);
    }

    render() {
        const listContainer = document.querySelector('.list_container');

        listContainer.innerHTML = '';
        const ul = document.createElement('ul');
        
        this.list.slice().reverse().forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.setAttribute('data-value', item);

            const btn = document.createElement('button');
            btn.className = 'close';
            btn.onclick = () => this.remove(item);

            li.append(btn);
            ul.append(li);
        });

        listContainer.append(ul);
    }

    showAlert(message, success = false) {
        let alertDiv = document.getElementById('alertMessage');
        if (!alertDiv) {
            alertDiv = document.createElement('div');
            alertDiv.id = 'alertMessage';
            this.container.prepend(alertDiv);
        }
        alertDiv.textContent = message;
        alertDiv.className = success ? 'alert_message success' : 'alert_message warning';
        setTimeout(() => { alertDiv.textContent = ""; }, 2000);
    }
    
}

function titleComponent(title = 'To-Do List', appSelector = '#App') {
    const app = document.querySelector(appSelector);
    const h1 = document.createElement('h1');
    h1.textContent = title;
    app.append(h1);
    const alertDiv = document.createElement('div');
    alertDiv.id = 'alertMessage';
    alertDiv.className = 'alert_message';
    app.append(alertDiv);
}

function inputComponent(todoListInstance, appSelector = '#App') {
    const app = document.querySelector(appSelector);
    const inputContainer = document.createElement('div');
    inputContainer.className = 'add_task_container';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'addTask';
    input.placeholder = 'Enter your task...';

    const addBtn = document.createElement('button');
    addBtn.className = 'add_button';
    addBtn.textContent = 'Add';

    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear_button';
    clearBtn.textContent = 'Clear All';

    inputContainer.append(input, addBtn, clearBtn);
    app.append(inputContainer);
}

function listComponent(appSelector = '#App') {
    const app = document.querySelector(appSelector);
    const list = document.createElement('div');
    list.className = 'list_container';
    app.append(list);
}


function mountTodoApp() {
    titleComponent('To-Do List');
    inputComponent(null);
    listComponent();

    window.todoList = new TodoList('#App');
    const input = document.getElementById('addTask');
    const addBtn = document.querySelector('.add_button');
    const clearBtn = document.querySelector('.clear_button');
    addBtn.onclick = () => {
        if (window.todoList.add(input.value)) {
            input.value = '';
        }
    };
    clearBtn.onclick = () => window.todoList.clear();
}


mountTodoApp();
